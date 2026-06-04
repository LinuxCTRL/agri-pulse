from app.scrapers.base import BaseScraper
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WikipediaPepperScraper(BaseScraper):
    # This page has multiple sections for different species
    URL = "https://en.wikipedia.org/wiki/List_of_Capsicum_cultivars"

    def run(self):
        logger.info(f"Starting scraping from {self.URL}")
        page = self.fetch_page(self.URL)
        
        # This page has many small tables or lists
        # We'll look for tables specifically
        tables = page.css('table.wikitable')
        if not tables:
            logger.error("No wikitables found on page")
            return

        crop = self.save_crop("Pepper", "Peppers are cultivars of plants from the genus Capsicum, including both sweet and chili peppers.")
        
        count = 0
        for table in tables:
            rows = table.css('tr')
            for row in rows:
                # Column 0 is usually Image, Column 1 is Name
                cells = row.css('th, td')
                if len(cells) < 2:
                    continue
                
                name_cell = cells[1]
                
                try:
                    name_el = name_cell.css('::text').getall()
                    name = "".join(name_el).strip()
                    
                    if not name or len(name) < 2 or name.lower() in ["name", "cultivar"]:
                        continue
                    
                    # Image is usually in cells[0]
                    image_url = cells[0].css('img::attr(src)').get()
                    if image_url and image_url.startswith("//"):
                        image_url = f"https:{image_url}"

                    # Offset logic: if we are in a data row, td count might be different if some cells are th
                    # Let's just use the cells list we already have
                    heat = ""
                    if len(cells) > 4: # Heat is often column 4 (0:Img, 1:Name, 2:Type, 3:Origin, 4:Heat)
                        heat = "".join(cells[4].css('::text').getall()).strip()
                    
                    description = ""
                    if len(cells) > 3:
                        description = "".join(cells[3].css('::text').getall()).strip()
                    
                    variety = self.save_variety(
                        name=name,
                        crop_id=crop.id,
                        origin=description[:255] if description else None,
                        season=heat[:255] if heat else None,
                        fruit_size=None,
                        image_url=image_url
                    )
                    logger.info(f"Saved variety: {variety.name}")
                    count += 1
                except Exception as e:
                    logger.debug(f"Skipping row due to error: {e}")
                    continue
        
        logger.info(f"Scraping complete. Saved {count} varieties.")

if __name__ == "__main__":
    from app.database import create_db_and_tables
    create_db_and_tables()
    scraper = WikipediaPepperScraper()
    scraper.run()
