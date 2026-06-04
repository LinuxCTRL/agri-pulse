from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Planting, PlantingBase

router = APIRouter()

@router.get("/", response_model=List[Planting])
def read_plantings(session: Session = Depends(get_session)):
    plantings = session.exec(select(Planting)).all()
    return plantings

@router.post("/", response_model=Planting)
def create_planting(planting: PlantingBase, session: Session = Depends(get_session)):
    db_planting = Planting.from_orm(planting)
    session.add(db_planting)
    session.commit()
    session.refresh(db_planting)
    return db_planting

@router.get("/{id}", response_model=Planting)
def read_planting(id: int, session: Session = Depends(get_session)):
    planting = session.get(Planting, id)
    if not planting:
        raise HTTPException(status_code=404, detail="Planting not found")
    return planting

@router.patch("/{id}", response_model=Planting)
def update_planting(id: int, planting: PlantingBase, session: Session = Depends(get_session)):
    db_planting = session.get(Planting, id)
    if not db_planting:
        raise HTTPException(status_code=404, detail="Planting not found")
    
    planting_data = planting.dict(exclude_unset=True)
    for key, value in planting_data.items():
        setattr(db_planting, key, value)
    
    session.add(db_planting)
    session.commit()
    session.refresh(db_planting)
    return db_planting

@router.delete("/{id}")
def delete_planting(id: int, session: Session = Depends(get_session)):
    planting = session.get(Planting, id)
    if not planting:
        raise HTTPException(status_code=404, detail="Planting not found")
    session.delete(planting)
    session.commit()
    return {"ok": True}
