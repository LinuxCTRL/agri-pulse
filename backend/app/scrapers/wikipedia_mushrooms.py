from app.scrapers.base import BaseScraper
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WikipediaMushroomScraper(BaseScraper):
    URL = "https://en.wikipedia.org/wiki/Edible_mushroom"

    def run(self):
        logger.info(f"Starting scraping from {self.URL}")
        page = self.fetch_page(self.URL)
        
        tables = page.css('table.wikitable')
        
        crop = self.save_crop("Mushroom", "The fleshy, spore-bearing fruiting body of a fungus, typically produced above ground on soil or on its food source.")
        
        count = 0
        
        # Method 1: Tables
        for i, table in enumerate(tables):
            headers = " ".join(table.css('th ::text').getall()).lower()
            if "common name" not in headers and "scientific name" not in headers:
                continue
                
            rows = table.css('tr')[1:]
            for row in rows:
                cols = row.css('td')
                if len(cols) < 2:
                    continue
                    
                try:
                    # Check headers to find column indexes
                    header_list = [ "".join(h.css('::text').getall()).strip().lower() for h in table.css('th') ]
                    
                    name = None
                    sci_name = None
                    image_url = None
                    
                    if "common name" in header_list:
                        idx = header_list.index("common name")
                        if idx < len(cols):
                            name = "".join(cols[idx].css('::text').getall()).strip()
                    
                    if "scientific name" in header_list:
                        idx = header_list.index("scientific name")
                        if idx < len(cols):
                            sci_name = "".join(cols[idx].css('::text').getall()).strip()
                    
                    if "mushroom image" in header_list:
                        idx = header_list.index("mushroom image")
                        if idx < len(cols):
                            image_url = cols[idx].css('img::attr(src)').get()
                    
                    if not name and sci_name:
                        name = sci_name
                    
                    if not name or len(name) < 2:
                        continue
                        
                    if image_url and image_url.startswith("//"):
                        image_url = f"https:{image_url}"
                    
                    # Find notes/description
                    notes = ""
                    if "description" in header_list:
                        idx = header_list.index("description")
                        if idx < len(cols):
                            notes = "".join(cols[idx].css('::text').getall()).strip()
                    
                    variety = self.save_variety(
                        name=name,
                        crop_id=crop.id,
                        origin=sci_name[:255] if sci_name else None,
                        season=notes[:255] if notes else None,
                        image_url=image_url
                    )
                    logger.debug(f"Saved variety: {variety.name}")
                    count += 1
                except Exception as e:
                    logger.warning(f"Error processing row in table {i}: {e}")
                    continue

        # Method 2: Extract common ones from the body text lists
        # Many mushrooms are listed in bullet points: * B. edulis (Porcini)
        list_items = page.css('ul li')
        for item in list_items:
            text = "".join(item.css('::text').getall()).strip()
            # Look for pattern "Scientific name (Common name)"
            if "(" in text and ")" in text and len(text) < 100:
                parts = text.split("(")
                sci = parts[0].strip()
                common = parts[1].split(")")[0].strip()
                
                if sci and common and len(sci) > 5 and len(common) > 2:
                    image_url = item.css('a img::attr(src)').get() # Rarely in li but possible
                    if image_url and image_url.startswith("//"):
                        image_url = f"https:{image_url}"
                        
                    self.save_variety(
                        name=common,
                        crop_id=crop.id,
                        origin=sci[:255],
                        image_url=image_url
                    )
                    count += 1

        # Fallback for the heavy hitters if not caught
        essentials = [
            ("Button Mushroom", "Agaricus bisporus", "Widely cultivated white mushroom"),
            ("Cremini", "Agaricus bisporus", "Brown version of button mushroom"),
            ("Portobello", "Agaricus bisporus", "Mature version of button mushroom"),
            ("Shiitake", "Lentinula edodes", "East Asian edible mushroom"),
            ("Oyster Mushroom", "Pleurotus ostreatus", "Common edible mushroom"),
            ("Enoki", "Flammulina filiformis", "Long, thin white mushrooms"),
            ("Porcini", "Boletus edulis", "Prized wild mushroom"),
            ("Chanterelle", "Cantharellus cibarius", "Yellow, funnel-shaped wild mushroom"),
            ("Morel", "Morchella esculenta", "Honeycomb-like cap"),
            ("Truffle", "Tuber melanosporum", "Underground prized fungus"),
            ("Lion's Mane", "Hericium erinaceus", "Icicle-like spines"),
            ("Maitake", "Grifola frondosa", "Hen-of-the-woods"),
        ]
        for name, sci, desc in essentials:
            self.save_variety(name=name, crop_id=crop.id, origin=sci, season=desc)
            count += 1
        
        logger.info(f"Scraping complete. Saved {count} varieties.")

if __name__ == "__main__":
    from app.database import create_db_and_tables
    create_db_and_tables()
    scraper = WikipediaMushroomScraper()
    scraper.run()
