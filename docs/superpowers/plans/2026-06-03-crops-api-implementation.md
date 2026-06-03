# Crops API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Crops API (`GET /api/v1/crops/`, `GET /api/v1/crops/{id}`, `GET /api/v1/crops/{id}/varieties`) using TDD.

**Architecture:** Dedicated router in `app/api/crops.py` following existing patterns.

**Tech Stack:** FastAPI, SQLModel, Pytest.

---

### Task 1: Setup Crops API Tests (RED)

**Files:**
- Create: `backend/tests/test_crops.py`

- [x] **Step 1: Create `backend/tests/test_crops.py` with failing tests**

```python
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
```

- [x] **Step 2: Run tests to verify they fail**

Run: `cd backend && uv run pytest tests/test_crops.py -v`
Expected: FAIL (404 Not Found)

- [x] **Step 3: Commit**

```bash
git add backend/tests/test_crops.py
git commit -m "test: add failing tests for Crops API"
```

---

### Task 2: Implement Crops API (GREEN)

**Files:**
- Create: `backend/app/api/crops.py`
- Modify: `backend/app/main.py`

- [x] **Step 1: Create `backend/app/api/crops.py`**

```python
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
```

- [x] **Step 2: Register router in `backend/app/main.py`**

```python
from fastapi import FastAPI
from app.api import varieties, crops

app = FastAPI(title="Agri-Pulse API")

app.include_router(varieties.router, prefix="/api/v1/varieties", tags=["varieties"])
app.include_router(crops.router, prefix="/api/v1/crops", tags=["crops"])

@app.get("/")
async def root():
    return {"message": "Welcome to Agri-Pulse API"}
```

- [x] **Step 3: Run tests to verify they pass**

Run: `cd backend && uv run pytest tests/test_crops.py -v`
Expected: PASS

- [x] **Step 4: Commit**

```bash
git add backend/app/api/crops.py backend/app/main.py
git commit -m "feat: implement Crops API endpoints"
```

---

### Task 3: Final Verification and Progress Update

**Files:**
- Modify: `docs/progress/README.md`
- Modify: `docs/progress/02-core-api.md`

- [x] **Step 1: Run all backend tests**

Run: `cd backend && uv run pytest -v`
Expected: ALL PASS

- [x] **Step 2: Update `docs/progress/02-core-api.md`**

```markdown
# Milestone 02: Core API Development

**Goal:** Implement the primary business logic and data access layer.

## Database Models
- [x] Define `Crop` SQLModel
- [x] Define `Variety` SQLModel
- [x] Establish Relationships (Crop has many Varieties)

## Varieties API
- [x] Create API router in `backend/app/api/varieties.py`
- [x] Implement `GET /api/v1/varieties`
- [x] Fix failing tests in `backend/tests/test_api.py`

## Crops API
- [x] Implement `GET /api/v1/crops`
- [x] Implement `GET /api/v1/crops/{id}`
- [x] Implement `GET /api/v1/crops/{id}/varieties`
- [x] Verify with tests

## Next Steps
1. Ensure tests pass locally and in CI.
```

- [x] **Step 3: Update `docs/progress/README.md`**

Set Milestone 02 progress to 100%.

```markdown
| Milestone | Status | Progress |
| :--- | :--- | :--- |
| [01-infrastructure.md](./01-infrastructure.md) | COMPLETED | 100% |
| [02-core-api.md](./02-core-api.md) | COMPLETED | 100% |
| [03-frontend-dashboard.md](./03-frontend-dashboard.md) | PLANNED | 10% |
```

- [x] **Step 4: Commit progress updates**

```bash
git add docs/progress/
git commit -m "docs: complete Milestone 02 progress update"
```
