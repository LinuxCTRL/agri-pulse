from app.scrapers.base import BaseScraper
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WikipediaGrapeScraper(BaseScraper):
    URL = "https://en.wikipedia.org/wiki/List_of_grape_varieties"

    def run(self):
        logger.info(f"Starting scraping from {self.URL}")
        page = self.fetch_page(self.URL)
        
        tables = page.css('table.wikitable')
        if not tables:
            logger.error("No wikitables found on page")
            return

        crop = self.save_crop("Grape", "A fruit, botanically a berry, of the deciduous woody vines of the flowering plant genus Vitis.")
        
        count = 0
        for i, table in enumerate(tables):
            # Check if this table has grape varieties
            # Common headers: Common name(s), Image, All synonyms, Country of origin
            headers = " ".join(table.css('th ::text').getall()).lower()
            if "common name" not in headers:
                continue
                
            rows = table.css('tr')[1:]
            for row in rows:
                cells = row.css('th, td')
                if len(cells) < 3:
                    continue
                    
                try:
                    # Usually 0:Name, 1:Image, 2:Synonyms, 3:Origin
                    name_el = cells[0].css('::text').getall()
                    name = "".join(name_el).strip()
                    
                    if not name or len(name) < 2 or name.lower() in ["common name", "name"]:
                        continue
                    
                    image_url = cells[1].css('img::attr(src)').get()
                    if image_url and image_url.startswith("//"):
                        image_url = f"https:{image_url}"
                    
                    # Grab all text to find origin and pedigree
                    text_content = [ "".join(c.css('::text').getall()).strip() for c in cells ]
                    
                    # Try to find origin (index 3 or 4 usually)
                    origin = None
                    if "origin" in headers:
                        # Find index of origin header
                        header_list = [ "".join(h.css('::text').getall()).strip().lower() for h in table.css('th') ]
                        try:
                            idx = header_list.index("country of origin")
                            if idx < len(text_content):
                                origin = text_content[idx]
                        except ValueError:
                            try:
                                idx = header_list.index("origin")
                                if idx < len(text_content):
                                    origin = text_content[idx]
                            except ValueError:
                                pass
                    
                    # If we didn't find it, fallback to index 3
                    if not origin and len(text_content) > 3:
                        origin = text_content[3]

                    season = text_content[2] if len(text_content) > 2 else None # Use synonyms/notes
                    
                    variety = self.save_variety(
                        name=name,
                        crop_id=crop.id,
                        origin=origin[:255] if origin else None,
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
    scraper = WikipediaGrapeScraper()
    scraper.run()
