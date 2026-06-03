# Progress Tracker Design Specification

**Date:** 2026-06-03
**Status:** Approved
**Goal:** Implement a hierarchical progress tracking system to monitor high-level milestones and granular technical tasks without losing context across sessions.

## Architecture

The tracker will live in the `docs/progress/` directory, using a parent-child relationship between a summary file and detailed milestone files.

### 1. Summary File (`docs/progress/README.md`)
Acts as the dashboard for the entire project. It lists all major milestones, their current status, and links to their respective detailed files.

**Format:**
- Milestone Name (linked to detail file)
- Progress Percentage / Status
- Brief description of the goal

### 2. Milestone Files (`docs/progress/XX-milestone-name.md`)
Contains the "C" level detail (Granular technical tasks) for a specific phase of the project.

**Format:**
- High-level goal of the milestone
- Sub-sections for different features/components
- GFM Checkboxes (`- [ ]`, `- [x]`) for task-by-task tracking
- "Next Steps" section for immediate priorities

## Initial Milestone Mapping

Based on the current project review:

### Milestone 01: Infrastructure & Scaffolding
- **Status:** ~90% Complete
- **Focus:** Docker, Database setup, Next.js/FastAPI initialization, Security.

### Milestone 02: Core API Development (Current Focus)
- **Status:** ~30% Complete
- **Focus:** Varieties API implementation, Crop API, Testing.

### Milestone 03: Frontend Dashboard
- **Status:** ~10% Complete
- **Focus:** Data fetching, UI/UX implementation for Varieties display.

## Maintenance Workflow
1. When a task is completed, mark it in the respective milestone file.
2. Update the progress percentage in `docs/progress/README.md`.
3. When starting a new major phase, create a new milestone file in `docs/progress/`.
