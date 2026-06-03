from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database import get_session
from app.models import Variety

router = APIRouter()

@router.get("/", response_model=List[Variety])
def read_varieties(session: Session = Depends(get_session)):
    varieties = session.exec(select(Variety)).all()
    return varieties
