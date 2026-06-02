from typing import List, Optional
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
    crop_id: int = Field(foreign_key="crop.id")

class Variety(VarietyBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    crop: "Crop" = Relationship(back_populates="varieties")
