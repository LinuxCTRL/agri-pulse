# Agri-Pulse Cleanup and Security Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the repository by removing build artifacts from git, securing credentials using environment variables, and improving Docker build efficiency with `.dockerignore` files.

**Architecture:** Use `.gitignore` and `.dockerignore` to manage file exclusion. Use a root-level `.env` file for docker-compose and pass variables to services. Add support for internal networking during SSR.

**Tech Stack:** Git, Docker Compose, Next.js, FastAPI, PostgreSQL.

---

### Task 1: Remove Build Artifacts from Git

**Files:**
- Modify: `.git` (via git commands)

- [ ] **Step 1: Remove artifacts from git index**

Run: `git -C /home/soufiane/Work/agri-pulse rm -r --cached backend/__pycache__ frontend/.next`
Expected: Files removed from tracking but stay on disk.

- [ ] **Step 2: Commit removal**

Run: `git -C /home/soufiane/Work/agri-pulse commit -m "chore: remove build artifacts from tracking"`

### Task 2: Create .gitignore Files

**Files:**
- Create: `/home/soufiane/Work/agri-pulse/.gitignore`
- Create: `/home/soufiane/Work/agri-pulse/backend/.gitignore`
- Create: `/home/soufiane/Work/agri-pulse/frontend/.gitignore`

- [ ] **Step 1: Create root .gitignore**

```text
# OS files
.DS_Store
Thumbs.db

# Environment variables
.env
.env.local

# IDEs
.vscode/
.idea/
```

- [ ] **Step 2: Create backend .gitignore**

```text
__pycache__/
*.py[cod]
*$py.class
.venv/
env/
venv/
ENV/
.env
```

- [ ] **Step 3: Create frontend .gitignore**

```text
node_modules/
.next/
out/
build/
.env*.local
.vercel
```

- [ ] **Step 4: Commit .gitignore files**

Run: `git -C /home/soufiane/Work/agri-pulse add .gitignore backend/.gitignore frontend/.gitignore && git -C /home/soufiane/Work/agri-pulse commit -m "chore: add .gitignore files"`

### Task 3: Secure Credentials and Configure Networking with .env

**Files:**
- Create: `/home/soufiane/Work/agri-pulse/.env`
- Create: `/home/soufiane/Work/agri-pulse/.env.example`
- Modify: `/home/soufiane/Work/agri-pulse/docker-compose.yml`

- [ ] **Step 1: Create .env.example**

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=agripulse
DATABASE_URL=postgresql://postgres:postgres@db:5432/agripulse
NEXT_PUBLIC_API_URL=http://localhost:8000
INTERNAL_API_URL=http://backend:8000
```

- [ ] **Step 2: Create .env**

Run: `cp /home/soufiane/Work/agri-pulse/.env.example /home/soufiane/Work/agri-pulse/.env`

- [ ] **Step 3: Update docker-compose.yml to use variables**

```yaml
services:
  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    ports:
      - "5432:5432"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=${DATABASE_URL}
    ports:
      - "8000:8000"
    depends_on:
      - db

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
      - INTERNAL_API_URL=${INTERNAL_API_URL}
    depends_on:
      - backend

volumes:
  postgres_data:
```

- [ ] **Step 4: Commit security changes**

Run: `git -C /home/soufiane/Work/agri-pulse add .env.example docker-compose.yml && git -C /home/soufiane/Work/agri-pulse commit -m "chore: secure credentials and configure networking"`

### Task 4: Add .dockerignore Files

**Files:**
- Create: `/home/soufiane/Work/agri-pulse/backend/.dockerignore`
- Create: `/home/soufiane/Work/agri-pulse/frontend/.dockerignore`

- [ ] **Step 1: Create backend .dockerignore**

```text
__pycache__
*.pyc
.venv
.git
.gitignore
```

- [ ] **Step 2: Create frontend .dockerignore**

```text
node_modules
.next
out
build
.git
.gitignore
```

- [ ] **Step 3: Commit .dockerignore files**

Run: `git -C /home/soufiane/Work/agri-pulse add backend/.dockerignore frontend/.dockerignore && git -C /home/soufiane/Work/agri-pulse commit -m "chore: add .dockerignore files"`

### Task 5: Verify Networking and Services

- [ ] **Step 1: Start services**

Run: `docker-compose -f /home/soufiane/Work/agri-pulse/docker-compose.yml up -d`

- [ ] **Step 2: Verify services are running**

Run: `docker-compose -f /home/soufiane/Work/agri-pulse/docker-compose.yml ps`

- [ ] **Step 3: Verify frontend can reach backend**

Check logs or use curl to verify connectivity.
Run: `docker exec agri-pulse-frontend-1 curl http://backend:8000` (adjust container name if needed)
