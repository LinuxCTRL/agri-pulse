# Task 3: FastAPI Core & Varieties API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the `GET /api/v1/varieties` endpoint to return all crop varieties from the database and verify it with tests.

**Architecture:** Standard FastAPI with SQLModel. Dependency injection for database sessions. Router-based API structure.

**Tech Stack:** FastAPI, SQLModel, PostgreSQL (prod/dev), SQLite (testing), Pytest.

---

### Task 1: Setup Testing Environment

**Files:**
- Create: `backend/tests/conftest.py`
- Modify: `backend/tests/test_api.py`

- [x] **Step 1: Create `backend/tests/conftest.py` with database and client fixtures**
```python
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.main import app
from app.database import get_session

@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()
```

- [x] **Step 2: Create `backend/tests/test_api.py` with failing test for `GET /api/v1/varieties`**
```python
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
```

- [x] **Step 3: Run test to verify it fails**
Run: `pytest backend/tests/test_api.py -v`
Expected: FAIL (404 Not Found)

- [x] **Step 4: Commit**
```bash
git add backend/tests/conftest.py backend/tests/test_api.py
git commit -m "test: add failing tests for varieties API"
```

---

### Task 2: Implement Varieties API

**Files:**
- Create: `backend/app/api/varieties.py`
- Modify: `backend/app/main.py`

- [x] **Step 1: Create `backend/app/api/varieties.py`**
```python
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
```

- [x] **Step 2: Register router in `backend/app/main.py`**
```python
from fastapi import FastAPI
from app.api import varieties

app = FastAPI(title="Agri-Pulse API")

app.include_router(varieties.router, prefix="/api/v1/varieties", tags=["varieties"])

@app.get("/")
async def root():
    return {"message": "Welcome to Agri-Pulse API"}
```

- [x] **Step 3: Run tests to verify they pass**
Run: `pytest backend/tests/test_api.py -v`
Expected: PASS

- [x] **Step 4: Commit**
```bash
git add backend/app/api/varieties.py backend/app/main.py
git commit -m "feat: implement GET /api/v1/varieties endpoint"
```
