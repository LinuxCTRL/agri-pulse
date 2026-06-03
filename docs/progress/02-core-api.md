# Milestone 02: Core API Development

**Goal:** Implement the primary business logic and data access layer.

## Database Models
- [x] Define `Crop` SQLModel
- [x] Define `Variety` SQLModel
- [x] Establish Relationships (Crop has many Varieties)

## Varieties API
- [ ] Create API router in `backend/app/api/varieties.py`
- [ ] Implement `GET /api/v1/varieties`
- [ ] Fix failing tests in `backend/tests/test_api.py`

## Next Steps
1. Register varieties router in `main.py`.
2. Ensure tests pass locally and in CI.
