from fastapi.testclient import TestClient
from sqlmodel import Session
from app.models import Variety, Crop

def test_read_varieties_empty(client: TestClient):
    response = client.get("/api/v1/varieties")
    assert response.status_code == 200
    assert response.json() == []

def test_read_varieties(session: Session, client: TestClient):
    crop = Crop(name="Tomato", description="Red fruit")
    session.add(crop)
    session.commit()
    session.refresh(crop)
    
    variety = Variety(name="Cherry", crop_id=crop.id, origin="Italy", season="Summer")
    session.add(variety)
    session.commit()
    
    response = client.get("/api/v1/varieties")
    data = response.json()
    
    assert response.status_code == 200
    assert len(data) == 1
    assert data[0]["name"] == "Cherry"
    assert data[0]["crop_id"] == crop.id
