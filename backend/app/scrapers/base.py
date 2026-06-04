from typing import List, Dict, Any, Optional
from scrapling import Fetcher
from sqlmodel import Session, select
from app.database import engine
from app.models import Crop, Variety

class BaseScraper:
    def __init__(self):
        self.engine = engine

    def fetch_page(self, url: str):
        return Fetcher.get(url)

    def save_crop(self, name: str, description: Optional[str] = None) -> Crop:
        with Session(self.engine) as session:
            statement = select(Crop).where(Crop.name == name)
            crop = session.exec(statement).first()
            if not crop:
                crop = Crop(name=name, description=description)
                session.add(crop)
                session.commit()
                session.refresh(crop)
            return crop

    def save_variety(self, name: str, crop_id: int, **kwargs) -> Variety:
        with Session(self.engine) as session:
            statement = select(Variety).where(Variety.name == name, Variety.crop_id == crop_id)
            variety = session.exec(statement).first()
            if not variety:
                variety = Variety(name=name, crop_id=crop_id, **kwargs)
                session.add(variety)
            else:
                # Update existing variety with new data
                for key, value in kwargs.items():
                    if value is not None:
                        setattr(variety, key, value)
                session.add(variety)
            
            session.commit()
            session.refresh(variety)
            return variety
