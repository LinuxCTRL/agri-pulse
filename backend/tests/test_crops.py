from fastapi.testclient import TestClient
from sqlmodel import Session
from app.models import Crop, Variety

def test_read_crops_empty(client: TestClient):
    response = client.get("/api/v1/crops/")
    assert response.status_code == 200
    assert response.json() == []

def test_read_crops(session: Session, client: TestClient):
    crop = Crop(name="Wheat", description="Cereal grain")
    session.add(crop)
    session.commit()
    
    response = client.get("/api/v1/crops/")
    data = response.json()
    
    assert response.status_code == 200
    assert len(data) == 1
    assert data[0]["name"] == "Wheat"

def test_read_crop_detail(session: Session, client: TestClient):
    crop = Crop(name="Corn", description="Yellow kernels")
    session.add(crop)
    session.commit()
    session.refresh(crop)
    
    response = client.get(f"/api/v1/crops/{crop.id}")
    data = response.json()
    
    assert response.status_code == 200
    assert data["name"] == "Corn"

def test_read_crop_not_found(client: TestClient):
    response = client.get("/api/v1/crops/999")
    assert response.status_code == 404

def test_read_crop_varieties(session: Session, client: TestClient):
    crop = Crop(name="Rice", description="White grain")
    session.add(crop)
    session.commit()
    session.refresh(crop)
    
    variety = Variety(name="Basmati", crop_id=crop.id, origin="India")
    session.add(variety)
    session.commit()
    
    response = client.get(f"/api/v1/crops/{crop.id}/varieties")
    data = response.json()
    
    assert response.status_code == 200
    assert len(data) == 1
    assert data[0]["name"] == "Basmati"

def test_read_crop_varieties_not_found(client: TestClient):
    response = client.get("/api/v1/crops/999/varieties")
    assert response.status_code == 404
