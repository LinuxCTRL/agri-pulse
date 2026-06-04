from app.scrapers.base import BaseScraper
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WikipediaTomatoScraper(BaseScraper):
    URL = "https://en.wikipedia.org/wiki/List_of_tomato_cultivars"

    def run(self):
        logger.info(f"Starting scraping from {self.URL}")
        page = self.fetch_page(self.URL)
        
        # The table of cultivars is likely the first or second wikitable
        tables = page.css('table.wikitable')
        if not tables:
            logger.error("No wikitables found on page")
            return

        # Usually it's the first big table
        table = tables[0]
        rows = table.css('tr')[1:]  # Skip header
        
        crop = self.save_crop("Tomato", "A widely grown fruit from the Solanaceae family.")
        
        count = 0
        for row in rows:
            cols = row.css('td')
            if len(cols) < 5:
                continue
                
            # Column mapping based on research:
            # 0: Image
            # 1: Common name
            # 2: Color
            # 3: Maturity
            # 4: Genetic type
            # 5: Fruit size
            # 6: Shape
            
            try:
                name = cols[1].css('::text').getall()
                name = "".join(name).strip()
                
                if not name:
                    continue
                
                image_url = cols[0].css('img::attr(src)').get()
                if image_url and image_url.startswith("//"):
                    image_url = f"https:{image_url}"
                
                origin = cols[11].css('::text').getall() if len(cols) > 11 else []
                origin = "".join(origin).strip()
                
                season = cols[3].css('::text').getall()
                season = "".join(season).strip()
                
                fruit_size = cols[5].css('::text').getall()
                fruit_size = "".join(fruit_size).strip()
                
                variety = self.save_variety(
                    name=name,
                    crop_id=crop.id,
                    origin=origin[:255] if origin else None,
                    season=season[:255] if season else None,
                    fruit_size=fruit_size[:255] if fruit_size else None,
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
    scraper = WikipediaTomatoScraper()
    scraper.run()
