# Frontend Dashboard Foundation Design Specification

**Date:** 2026-06-03
**Status:** Approved
**Goal:** Establish the foundation for the Agri-Pulse frontend dashboard using modern React patterns and a high-quality UI component library.

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Data Fetching:** [TanStack Query v5](https://tanstack.com/query/latest)
- **Icons:** Lucide React

## Architecture

### 1. Global Layout
- **Component:** `Navbar`
- **Structure:** Top navigation bar persistent across all dashboard routes.
- **Links:** Dashboard, Crops, Varieties.

### 2. Data Fetching Strategy
- **Library:** TanStack Query.
- **Provider:** A `QueryClientProvider` will wrap the entire application in `layout.tsx`.
- **Hooks:** Custom hooks (e.g., `useCrops`, `useVarieties`) will encapsulate fetching logic using `fetch` or `axios`.

### 3. UI Components (shadcn/ui)
We will initialize shadcn/ui and add the initial set of components required for the dashboard:
- `Button`
- `Table` (for data lists)
- `Card` (for summary stats)
- `NavigationMenu` (for the navbar)

## Directory Structure

```text
frontend/src/
├── components/
│   ├── ui/             # shadcn/ui components
│   └── navbar.tsx      # Global navigation
├── hooks/
│   ├── use-crops.ts    # TanStack Query hooks for crops
│   └── use-varieties.ts# TanStack Query hooks for varieties
├── lib/
│   └── utils.ts        # shadcn/ui helper
└── providers/
    └── query-provider.tsx # TanStack Query Provider
```

## Implementation Phases (High-Level)

1. **Initialization:** Install dependencies and initialize shadcn/ui.
2. **Providers & Layout:** Set up TanStack Query provider and the global `Navbar`.
3. **Data Fetching:** Implement basic fetching hooks for Crops and Varieties.
4. **Initial Views:** Replace the landing page with a basic dashboard summary.
