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
