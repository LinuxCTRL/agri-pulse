from app.scrapers.base import BaseScraper
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WikipediaStrawberryScraper(BaseScraper):
    URL = "https://en.wikipedia.org/wiki/List_of_strawberry_cultivars"

    def run(self):
        logger.info(f"Starting scraping from {self.URL}")
        page = self.fetch_page(self.URL)
        
        tables = page.css('table.wikitable')
        if not tables:
            logger.error("No wikitables found on page")
            return

        crop = self.save_crop("Strawberry", "A widely grown hybrid species of the genus Fragaria.")
        
        count = 0
        for i, table in enumerate(tables):
            rows = table.css('tr')[1:]
            for row in rows:
                cols = row.css('td')
                # 0:Variety, 1:Image, 2:Season, 3:Developed by, 4:Released, 5:Notes
                if len(cols) < 3:
                    continue
                    
                try:
                    name_el = cols[0].css('::text').getall()
                    name = "".join(name_el).strip().replace("'", "")
                    
                    if not name or len(name) < 2:
                        continue
                    
                    image_url = cols[1].css('img::attr(src)').get()
                    if image_url and image_url.startswith("//"):
                        image_url = f"https:{image_url}"
                    
                    season = "".join(cols[2].css('::text').getall()).strip()
                    notes = "".join(cols[5].css('::text').getall()).strip() if len(cols) > 5 else ""
                    
                    variety = self.save_variety(
                        name=name,
                        crop_id=crop.id,
                        origin=notes[:255] if notes else None,
                        season=season[:255] if season else None,
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
    scraper = WikipediaStrawberryScraper()
    scraper.run()
