# FastAPI Core & Varieties API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize FastAPI app and implement the `GET /api/v1/varieties` endpoint with TDD.

**Architecture:** Use FastAPI with SQLModel. Organize routes in `app/api/`. Use dependency injection for database sessions.

**Tech Stack:** FastAPI, SQLModel, Pytest, HTTPX.

---

### Task 1: FastAPI App Initialization

**Files:**
- Create: `backend/app/main.py`
- Modify: `backend/main.py`
- Modify: `docker-compose.yml`

- [ ] **Step 1: Move FastAPI app to `backend/app/main.py`**

```python
from fastapi import FastAPI
from .api import varieties

app = FastAPI(title="Agri-Pulse API")

@app.get("/")
async def root():
    return {"message": "Welcome to Agri-Pulse API"}

# Router will be included in Task 4
```

- [ ] **Step 2: Update `backend/main.py` to import and expose the app**

```python
from app.main import app
```

- [ ] **Step 3: Update `docker-compose.yml` backend command**

Change `command: uvicorn main:app --host 0.0.0.0 --reload` to `command: uvicorn main:app --host 0.0.0.0 --reload --reload-dir app` (or similar, ensuring it points to the right place). Actually `main:app` should still work if `backend/main.py` imports it.

- [ ] **Step 4: Commit**

```bash
git add backend/app/main.py backend/main.py
git commit -m "feat: initialize FastAPI app in app/main.py"
```

### Task 2: Varieties API Test (RED)

**Files:**
- Create: `backend/tests/test_api.py`

- [ ] **Step 1: Write failing test for `GET /api/v1/varieties`**

```python
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from app.main import app
from app.database import get_session
from app.models import Crop, Variety

# Setup in-memory SQLite for testing
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine("sqlite://")
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

def test_read_varieties(client: TestClient, session: Session):
    # Setup: Create a crop and a variety
    crop = Crop(name="Tomato", description="Red")
    session.add(crop)
    session.commit()
    
    variety = Variety(name="Roma", crop_id=crop.id, origin="Italy")
    session.add(variety)
    session.commit()
    
    # Action
    response = client.get("/api/v1/varieties")
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Roma"
    assert data[0]["origin"] == "Italy"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest backend/tests/test_api.py`
Expected: FAIL (404 Not Found)

- [ ] **Step 3: Commit**

```bash
git add backend/tests/test_api.py
git commit -m "test: add failing test for read varieties endpoint"
```

### Task 3: Implement Varieties API (GREEN)

**Files:**
- Create: `backend/app/api/varieties.py`
- Create: `backend/app/api/__init__.py`

- [ ] **Step 1: Implement the router and endpoint**

```python
from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ..database import get_session
from ..models import Variety

router = APIRouter(prefix="/varieties", tags=["varieties"])

@router.get("/", response_model=List[Variety])
def read_varieties(session: Session = Depends(get_session)):
    varieties = session.exec(select(Variety)).all()
    return varieties
```

- [ ] **Step 2: Create `backend/app/api/__init__.py`**

(Empty or export routers)

- [ ] **Step 3: Commit**

```bash
git add backend/app/api/varieties.py backend/app/api/__init__.py
git commit -m "feat: implement varieties API endpoint"
```

### Task 4: Connect Router and Verify

**Files:**
- Modify: `backend/app/main.py`

- [ ] **Step 1: Include the varieties router in `app/main.py`**

```python
from fastapi import FastAPI, APIRouter
from .api import varieties

app = FastAPI(title="Agri-Pulse API")

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(varieties.router)

app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "Welcome to Agri-Pulse API"}
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `pytest backend/tests/test_api.py`
Expected: PASS

- [ ] **Step 3: Run all tests**

Run: `pytest backend/tests`
Expected: ALL PASS

- [ ] **Step 4: Commit**

```bash
git add backend/app/main.py
git commit -m "feat: include varieties router in main app"
```
