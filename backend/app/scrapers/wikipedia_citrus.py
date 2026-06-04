from app.scrapers.base import BaseScraper
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WikipediaCitrusScraper(BaseScraper):
    URL = "https://en.wikipedia.org/wiki/List_of_citrus_fruits"

    def run(self):
        logger.info(f"Starting scraping from {self.URL}")
        page = self.fetch_page(self.URL)
        
        tables = page.css('table.wikitable')
        if not tables:
            logger.error("No wikitables found on page")
            return

        crop = self.save_crop("Citrus", "A genus of flowering trees and shrubs in the rue family, Rutaceae.")
        
        count = 0
        for i, table in enumerate(tables):
            # Check if this table has citrus species/cultivars
            headers = " ".join(table.css('th ::text').getall()).lower()
            if "common name" not in headers:
                continue
                
            rows = table.css('tr')[1:]
            for row in rows:
                # Some tables use <th> for the first column
                name_th = row.css('th:first-child')
                name_td = row.css('td:first-child')
                
                # If th exists and has text, use it. Otherwise use td.
                is_th = False
                if name_th and "".join(name_th.css('::text').getall()).strip():
                    name_cell = name_th
                    is_th = True
                elif name_td:
                    name_cell = name_td
                else:
                    continue
                
                cols = row.css('td')
                
                try:
                    name_el = name_cell.css('::text').getall()
                    name = "".join(name_el).strip()
                    
                    if not name or len(name) < 2 or name.lower() in ["common name", "name"]:
                        continue
                    
                    # If name was th, image is in cols[0]
                    # If name was td, image is in cols[1]
                    img_col_idx = 0 if is_th else 1
                    
                    image_url = None
                    if len(cols) > img_col_idx:
                        image_url = cols[img_col_idx].css('img::attr(src)').get()
                        
                    if image_url and image_url.startswith("//"):
                        image_url = f"https:{image_url}"
                    
                    # Search for scientific name and notes in remaining columns
                    # We'll just grab all text from all cells to be safe
                    all_cells = row.css('th, td')
                    text_content = [ "".join(c.css('::text').getall()).strip() for c in all_cells ]
                    
                    # Scientific is usually next to image
                    # 0:Name, 1:Image, 2:Scientific, 3:Notes
                    scientific = text_content[2] if len(text_content) > 2 else None
                    notes = text_content[3] if len(text_content) > 3 else None
                    
                    variety = self.save_variety(
                        name=name,
                        crop_id=crop.id,
                        origin=scientific[:255] if scientific else None,
                        season=notes[:255] if notes else None,
                        image_url=image_url
                    )
                    logger.info(f"Saved variety: {variety.name}")
                    count += 1
                except Exception as e:
                    logger.warning(f"Error processing row in table {i}: {e}")
                    continue
        
        logger.info(f"Scraping complete. Saved {count} varieties.")

if __name__ == "__main__":
    from app.database import create_db_and_tables
    create_db_and_tables()
    scraper = WikipediaCitrusScraper()
    scraper.run()
