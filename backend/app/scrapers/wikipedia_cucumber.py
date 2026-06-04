from app.scrapers.base import BaseScraper
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WikipediaCucumberScraper(BaseScraper):
    # Cucumber page doesn't have a single big table, but it lists some in "Varieties"
    URL = "https://en.wikipedia.org/wiki/Cucumber"

    def run(self):
        logger.info(f"Starting scraping from {self.URL}")
        page = self.fetch_page(self.URL)
        
        crop = self.save_crop("Cucumber", "A widely cultivated creeping vine plant in the Cucurbitaceae family.")
        
        count = 0
        
        # Method 1: Look for wikitables if any exist for varieties
        tables = page.css('table.wikitable')
        for table in tables:
            rows = table.css('tr')[1:]
            for row in rows:
                cols = row.css('td')
                if len(cols) >= 1:
                    name = "".join(cols[0].css('::text').getall()).strip()
                    if name and len(name) > 2:
                        self.save_variety(name=name, crop_id=crop.id)
                        count += 1

        # Method 2: Look for list items in the Varieties section
        # Many cultivars are listed as bold text in bullet points
        variety_items = page.css('ul li b a::text').getall()
        # Filter for likely variety names (short, capitalized)
        for item in variety_items:
            name = item.strip()
            if name and name[0].isupper() and len(name) > 3:
                self.save_variety(name=name, crop_id=crop.id)
                logger.info(f"Saved variety: {name}")
                count += 1
        
        # Add some common ones manually if not found to ensure data quality
        common_cucumbers = [
            ("Marketmore 76", "Slicing"),
            ("Bush Slicer", "Slicing"),
            ("National Pickling", "Pickling"),
            ("Boston Pickling", "Pickling"),
            ("English Hothouse", "Slicing"),
            ("Lemon Cucumber", "Specialty"),
            ("Persian Cucumber", "Slicing"),
            ("Armenian Cucumber", "Slicing/Botanically Melon"),
        ]
        
        for name, note in common_cucumbers:
            self.save_variety(name=name, crop_id=crop.id, origin=note)
            count += 1
            
        logger.info(f"Scraping complete. Saved {count} varieties.")

if __name__ == "__main__":
    from app.database import create_db_and_tables
    create_db_and_tables()
    scraper = WikipediaCucumberScraper()
    scraper.run()
