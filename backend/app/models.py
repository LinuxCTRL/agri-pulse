from typing import List, Optional
from datetime import datetime
from sqlmodel import Field, Relationship, SQLModel

class CropBase(SQLModel):
    name: str = Field(index=True)
    description: Optional[str] = None

class Crop(CropBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    varieties: List["Variety"] = Relationship(back_populates="crop")

class VarietyBase(SQLModel):
    name: str = Field(index=True)
    origin: Optional[str] = None
    season: Optional[str] = None
    fruit_size: Optional[str] = None
    image_url: Optional[str] = None
    crop_id: int = Field(foreign_key="crop.id")

class Variety(VarietyBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    crop: "Crop" = Relationship(back_populates="varieties")
    plantings: List["Planting"] = Relationship(back_populates="variety")

class PlantingBase(SQLModel):
    variety_id: int = Field(foreign_key="variety.id")
    status: str = Field(default="Planned") # Planned, Sown, Seedling, Vegetative, Flowering, Fruiting, Harvested, Failed
    planted_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    expected_harvest_at: Optional[datetime] = None
    notes: Optional[str] = None
    quantity: int = Field(default=1)

class Planting(PlantingBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    variety: Variety = Relationship(back_populates="plantings")
    activities: List["PlantingActivity"] = Relationship(back_populates="planting")
    images: List["PlantingImage"] = Relationship(back_populates="planting")

class PlantingImageBase(SQLModel):
    planting_id: int = Field(foreign_key="planting.id")
    image_url: str
    caption: Optional[str] = None
    taken_at: datetime = Field(default_factory=datetime.utcnow)

class PlantingImage(PlantingImageBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    planting: Planting = Relationship(back_populates="images")

class PlantingActivityBase(SQLModel):
    planting_id: int = Field(foreign_key="planting.id")
    type: str = Field(default="Observation") # Watering, Fertilizing, Pruning, Observation, Harvest
    note: str
    activity_at: datetime = Field(default_factory=datetime.utcnow)

class PlantingActivity(PlantingActivityBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    planting: Planting = Relationship(back_populates="activities")
