from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import PlantingActivity, PlantingActivityBase

router = APIRouter()

@router.get("/{planting_id}", response_model=List[PlantingActivity])
def read_activities(planting_id: int, session: Session = Depends(get_session)):
    activities = session.exec(select(PlantingActivity).where(PlantingActivity.planting_id == planting_id)).all()
    return activities

@router.post("/", response_model=PlantingActivity)
def create_activity(activity: PlantingActivityBase, session: Session = Depends(get_session)):
    db_activity = PlantingActivity.from_orm(activity)
    session.add(db_activity)
    session.commit()
    session.refresh(db_activity)
    return db_activity

@router.delete("/{id}")
def delete_activity(id: int, session: Session = Depends(get_session)):
    activity = session.get(PlantingActivity, id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    session.delete(activity)
    session.commit()
    return {"ok": True}
