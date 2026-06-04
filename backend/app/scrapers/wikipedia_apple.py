from app.scrapers.base import BaseScraper
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WikipediaAppleScraper(BaseScraper):
    URL = "https://en.wikipedia.org/wiki/List_of_apple_cultivars"

    def run(self):
        logger.info(f"Starting scraping from {self.URL}")
        page = self.fetch_page(self.URL)
        
        tables = page.css('table.wikitable')
        if not tables:
            logger.error("No wikitables found on page")
            return

        crop = self.save_crop("Apple", "A sweet, edible fruit produced by an apple tree (Malus domestica).")
        
        count = 0
        for i, table in enumerate(tables):
            headers = "".join(table.css('th::text').getall())
            if "Common name" not in headers:
                continue
                
            rows = table.css('tr')[1:]
            for row in rows:
                cols = row.css('td')
                if len(cols) < 5:
                    continue
                    
                try:
                    # 0:Name, 1:Image, 2:Origin, 3:Developed, 4:Comment, 5:Use, 6:Pick
                    name_el = cols[0].css('::text').getall()
                    name = "".join(name_el).strip()
                    
                    if not name or len(name) < 2:
                        continue
                    
                    image_url = cols[1].css('img::attr(src)').get()
                    if image_url and image_url.startswith("//"):
                        image_url = f"https:{image_url}"
                    
                    origin = cols[2].css('::text').getall()
                    origin = "".join(origin).strip()
                    
                    comment = cols[4].css('::text').getall()
                    comment = "".join(comment).strip()
                    
                    use = cols[5].css('::text').getall() if len(cols) > 5 else []
                    use = "".join(use).strip()
                    
                    variety = self.save_variety(
                        name=name,
                        crop_id=crop.id,
                        origin=origin[:255] if origin else None,
                        season=use[:255] if use else None, # Using use for season/notes
                        fruit_size=comment[:255] if comment else None, # Using comment for fruit_size/desc
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
    scraper = WikipediaAppleScraper()
    scraper.run()
