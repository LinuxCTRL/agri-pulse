from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Crop, Variety

router = APIRouter()

@router.get("/", response_model=List[Crop])
def read_crops(session: Session = Depends(get_session)):
    crops = session.exec(select(Crop)).all()
    return crops

@router.get("/{id}", response_model=Crop)
def read_crop(id: int, session: Session = Depends(get_session)):
    crop = session.get(Crop, id)
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    return crop

@router.get("/{id}/varieties", response_model=List[Variety])
def read_crop_varieties(id: int, session: Session = Depends(get_session)):
    crop = session.get(Crop, id)
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    varieties = session.exec(select(Variety).where(Variety.crop_id == id)).all()
    return varieties
