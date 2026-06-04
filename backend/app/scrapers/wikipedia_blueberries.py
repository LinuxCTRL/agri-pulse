from app.scrapers.base import BaseScraper
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WikipediaBlueberryScraper(BaseScraper):
    URL = "https://en.wikipedia.org/wiki/Blueberry"

    def run(self):
        logger.info(f"Starting scraping from {self.URL}")
        page = self.fetch_page(self.URL)
        
        crop = self.save_crop("Blueberry", "A widely distributed and widespread group of perennial flowering plants with blue or purple berries.")
        
        count = 0
        
        # Add common ones manually to ensure data quality
        essentials = [
            ("Duke", "Early Highbush", "Standard early variety, large firm berries"),
            ("Bluecrop", "Mid Highbush", "Most widely grown variety globally"),
            ("Elliott", "Late Highbush", "Very late season, long shelf life"),
            ("Legacy", "Northern Highbush", "High yield, excellent flavor"),
            ("Jersey", "Late Highbush", "Old favorite, very sweet small berries"),
            ("Patriot", "Early Highbush", "Cold hardy, large berries"),
            ("Spartan", "Early Highbush", "Very large berries, excellent flavor"),
            ("Northblue", "Half-high", "Very cold hardy"),
            ("Emerald", "Southern Highbush", "Low-chill, popular in warmer climates"),
            ("Star", "Southern Highbush", "Early southern variety"),
            ("Jewel", "Southern Highbush", "Large fruit, high yield"),
            ("Brightwell", "Rabbiteye", "Popular home garden rabbiteye"),
            ("Powderblue", "Rabbiteye", "Late season rabbiteye"),
            ("Tifblue", "Rabbiteye", "Standard rabbiteye variety"),
            ("Pink Lemonade", "Hybrid", "Unique pink berries"),
        ]
        
        for name, species, notes in essentials:
            self.save_variety(
                name=name,
                crop_id=crop.id,
                origin=species,
                season=notes
            )
            count += 1
            
        # Try to find any other variety names in the page text
        # Usually variety names are capitalized in "Cultivars" section
        variety_links = page.css('a[title*="Blueberry"]::text').getall()
        for v in variety_links:
            if v and v[0].isupper() and " " not in v and len(v) > 3:
                self.save_variety(name=v, crop_id=crop.id)
                count += 1
        
        logger.info(f"Scraping complete. Saved {count} varieties.")

if __name__ == "__main__":
    from app.database import create_db_and_tables
    create_db_and_tables()
    scraper = WikipediaBlueberryScraper()
    scraper.run()
