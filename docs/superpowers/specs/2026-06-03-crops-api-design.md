# Crops API Design Specification

**Date:** 2026-06-03
**Status:** Approved
**Goal:** Implement the Crops API to allow users to list crops, view crop details, and see varieties associated with a specific crop.

## Architecture

The Crops API will follow the established modular pattern by using a dedicated router.

- **File:** `backend/app/api/crops.py`
- **Registration:** Added to `backend/app/main.py` under the `/api/v1/crops` prefix.

## Endpoints

### 1. List Crops
- **Path:** `GET /api/v1/crops/`
- **Response:** `200 OK` with `List[Crop]`
- **Description:** Returns all crops currently stored in the database.

### 2. Get Crop Detail
- **Path:** `GET /api/v1/crops/{id}`
- **Response:** 
  - `200 OK` with `Crop` object
  - `404 Not Found` if the ID does not exist
- **Description:** Returns the metadata for a specific crop.

### 3. List Varieties for Crop
- **Path:** `GET /api/v1/crops/{id}/varieties`
- **Response:**
  - `200 OK` with `List[Variety]`
  - `404 Not Found` if the Crop ID does not exist
- **Description:** Returns all varieties that belong to the specified crop.

## Data Flow & Models

The API will use the existing `Crop` and `Variety` SQLModel classes. Relationships are already defined in `models.py`.

## Testing Strategy

Implementation will follow Test-Driven Development (TDD):
1. **Red:** Write failing tests for each endpoint in `backend/tests/test_crops.py`.
2. **Green:** Implement the router logic to make tests pass.
3. **Refactor:** Ensure clean code and proper error handling.

Tests will use the existing `conftest.py` fixtures (in-memory SQLite).
