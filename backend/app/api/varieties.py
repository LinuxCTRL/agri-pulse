from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Variety

router = APIRouter()

@router.get("/", response_model=List[Variety])
def read_varieties(session: Session = Depends(get_session)):
    varieties = session.exec(select(Variety)).all()
    return varieties

@router.get("/{id}", response_model=Variety)
def read_variety(id: int, session: Session = Depends(get_session)):
    variety = session.get(Variety, id)
    if not variety:
        raise HTTPException(status_code=404, detail="Variety not found")
    return variety
