# Project Scaffolding & Docker Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the project scaffolding by setting up environment variables, Docker configuration, and ignore files.

**Architecture:** Use environment variables for service configuration and separate ignore files for Docker contexts to optimize build performance and security.

**Tech Stack:** Docker, Docker Compose, PostgreSQL

---

### Task 1: Environment Configuration

**Files:**
- Create: `.env.example`
- Create: `.env`

- [ ] **Step 1: Create .env.example**
Create `.env.example` at the root with the required environment variables.

- [ ] **Step 2: Create .env**
Copy `.env.example` to `.env`.

- [ ] **Step 3: Verify files exist**
Run `ls -a .env .env.example`

### Task 2: Docker Compose Refactoring

**Files:**
- Modify: `docker-compose.yml`

- [ ] **Step 1: Update docker-compose.yml**
Replace hardcoded strings with `${VAR}` variables in `docker-compose.yml`.

- [ ] **Step 2: Verify docker-compose syntax**
Run `docker compose config`

### Task 3: Docker Ignore Files

**Files:**
- Create: `backend/.dockerignore`
- Create: `frontend/.dockerignore`

- [ ] **Step 1: Create backend/.dockerignore**
Add `__pycache__`, `.venv`, `.git`, etc. to `backend/.dockerignore`.

- [ ] **Step 2: Create frontend/.dockerignore**
Add `node_modules`, `.next`, `.git`, etc. to `frontend/.dockerignore`.

- [ ] **Step 3: Verify files exist**
Run `ls backend/.dockerignore frontend/.dockerignore`

### Task 4: Final Validation

- [ ] **Step 1: Start services**
Run `docker compose up -d`

- [ ] **Step 2: Verify services are running**
Run `docker compose ps`

- [ ] **Step 3: Stop services**
Run `docker compose down`
