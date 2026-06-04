from app.scrapers.base import BaseScraper
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WikipediaPotatoScraper(BaseScraper):
    URL = "https://en.wikipedia.org/wiki/List_of_potato_cultivars"

    def run(self):
        logger.info(f"Starting scraping from {self.URL}")
        page = self.fetch_page(self.URL)
        
        tables = page.css('table.wikitable')
        if not tables:
            logger.error("No wikitables found on page")
            return

        table = tables[0]
        rows = table.css('tr')[1:]
        
        crop = self.save_crop("Potato", "A starchy tuber of the plant Solanum tuberosum.")
        
        count = 0
        for row in rows:
            cols = row.css('td')
            if len(cols) < 4:
                continue
                
            try:
                # Based on research: 0:Name, 1:Image, 2:Origin, 3:Year, 4:Notes
                name_el = cols[0].css('::text').getall()
                name = "".join(name_el).strip()
                
                if not name or len(name) < 2:
                    continue
                
                image_url = cols[1].css('img::attr(src)').get()
                if image_url and image_url.startswith("//"):
                    image_url = f"https:{image_url}"
                
                origin = cols[2].css('::text').getall()
                origin = "".join(origin).strip()
                
                notes = cols[4].css('::text').getall() if len(cols) > 4 else []
                notes = "".join(notes).strip()
                
                variety = self.save_variety(
                    name=name,
                    crop_id=crop.id,
                    origin=origin[:255] if origin else None,
                    season=notes[:255] if notes else None, # Using season/notes field
                    image_url=image_url
                )
                logger.info(f"Saved variety: {variety.name}")
                count += 1
            except Exception as e:
                logger.warning(f"Error processing row: {e}")
                continue
        
        logger.info(f"Scraping complete. Saved {count} varieties.")

if __name__ == "__main__":
    from app.database import create_db_and_tables
    create_db_and_tables()
    scraper = WikipediaPotatoScraper()
    scraper.run()
