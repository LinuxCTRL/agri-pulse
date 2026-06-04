from app.scrapers.base import BaseScraper
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WikipediaHerbsScraper(BaseScraper):
    URL = "https://en.wikipedia.org/wiki/Plants_used_as_herbs_or_spices"

    def run(self):
        logger.info(f"Starting scraping from {self.URL}")
        page = self.fetch_page(self.URL)
        
        tables = page.css('table.wikitable')
        if not tables:
            logger.error("No wikitables found on page")
            return

        crop = self.save_crop("Herbs & Spices", "Plants used for food, flavoring, medicine, or fragrances.")
        
        count = 0
        for i, table in enumerate(tables):
            # 0:Herb, 1:Species, 2:Family, 3:Form, 4:Purposes, 5:Parts, 6:Notes
            rows = table.css('tr')[1:]
            for row in rows:
                cols = row.css('td')
                if len(cols) < 2:
                    continue
                    
                try:
                    name_el = cols[0].css('::text').getall()
                    name = "".join(name_el).strip()
                    
                    if not name or len(name) < 2:
                        continue
                    
                    # This table doesn't have an image column directly in the main layout research
                    # But often Wikipedia tables have images or we can search for one
                    # Let's check if there's an img in the first cell
                    image_url = cols[0].css('img::attr(src)').get()
                    if not image_url and len(cols) > 1:
                        image_url = cols[1].css('img::attr(src)').get() # Check second cell too
                        
                    if image_url and image_url.startswith("//"):
                        image_url = f"https:{image_url}"
                    
                    species = "".join(cols[1].css('::text').getall()).strip()
                    notes = "".join(cols[6].css('::text').getall()).strip() if len(cols) > 6 else ""
                    parts = "".join(cols[5].css('::text').getall()).strip() if len(cols) > 5 else ""
                    
                    variety = self.save_variety(
                        name=name,
                        crop_id=crop.id,
                        origin=f"{species} | {parts}"[:255],
                        season=notes[:255] if notes else None,
                        image_url=image_url
                    )
                    logger.debug(f"Saved variety: {variety.name}")
                    count += 1
                except Exception as e:
                    logger.warning(f"Error processing row in table {i}: {e}")
                    continue
        
        logger.info(f"Scraping complete. Saved {count} varieties.")

if __name__ == "__main__":
    from app.database import create_db_and_tables
    create_db_and_tables()
    scraper = WikipediaHerbsScraper()
    scraper.run()
