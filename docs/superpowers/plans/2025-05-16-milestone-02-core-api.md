# Milestone 02: Core API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the primary business logic and data access layer for varieties.

**Architecture:** Create a new API router for varieties, implement a list endpoint, and ensure database models and relationships are correctly defined.

**Tech Stack:** Python, FastAPI, SQLModel.

---

### Task 1: Create the Milestone 02 file

**Files:**
- Create: `docs/progress/02-core-api.md`

- [ ] **Step 1: Create the Milestone 02 file**

```markdown
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
```

- [ ] **Step 2: Commit Milestone 02**

Run: `git add docs/progress/02-core-api.md && git commit -m "docs: add milestone 02 (core api) detail"`
