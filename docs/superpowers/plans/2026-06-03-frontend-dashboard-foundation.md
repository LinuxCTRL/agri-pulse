# Frontend Dashboard Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the foundation for the Agri-Pulse frontend dashboard using shadcn/ui and TanStack Query.

**Architecture:** Top navigation layout with TanStack Query for state management and shadcn/ui for components.

**Tech Stack:** Next.js 14, Tailwind CSS, shadcn/ui, TanStack Query v5.

---

### Task 1: Initialize shadcn/ui and Dependencies

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/components.json`
- Create: `frontend/src/lib/utils.ts`

- [x] **Step 1: Install dependencies**

Run: `docker compose run --rm frontend npm install @tanstack/react-query @tanstack/react-query-devtools clsx tailwind-merge lucide-react`

- [x] **Step 2: Create shadcn/ui utility file**

Create `frontend/src/lib/utils.ts`:
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [x] **Step 3: Create `components.json`**

Create `frontend/components.json`:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

- [x] **Step 4: Update `tsconfig.json` for aliases**

Ensure `frontend/tsconfig.json` has:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [x] **Step 5: Commit initialization**

Run: `git add frontend/package.json frontend/components.json frontend/src/lib/utils.ts frontend/tsconfig.json && git commit -m "chore: initialize shadcn/ui and install dependencies"`

---

### Task 2: Setup TanStack Query Provider

**Files:**
- Create: `frontend/src/providers/query-provider.tsx`
- Modify: `frontend/src/app/layout.tsx`

- [ ] **Step 1: Create the Query Provider**

Create `frontend/src/providers/query-provider.tsx`:
```tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

- [ ] **Step 2: Wrap root layout with Provider**

Modify `frontend/src/app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/providers/query-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agri-Pulse',
  description: 'Agricultural Intelligence Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit Providers**

Run: `git add frontend/src/providers/query-provider.tsx frontend/src/app/layout.tsx && git commit -m "feat: setup TanStack Query provider"`

---

### Task 3: Create Global Navbar

**Files:**
- Create: `frontend/src/components/navbar.tsx`
- Modify: `frontend/src/app/layout.tsx`

- [ ] **Step 1: Create Navbar component**

Create `frontend/src/components/navbar.tsx`:
```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Sprout, Leaf } from "lucide-react"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/crops", label: "Crops", icon: Sprout },
  { href: "/varieties", label: "Varieties", icon: Leaf },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-8 flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold tracking-tight">Agri-Pulse</span>
        </div>
        <div className="flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-green-600",
                pathname === item.href ? "text-green-600" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Add Navbar to Root Layout**

Modify `frontend/src/app/layout.tsx`:
```tsx
// ... imports
import { Navbar } from '@/components/navbar'

// ... metadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit Navbar**

Run: `git add frontend/src/components/navbar.tsx frontend/src/app/layout.tsx && git commit -m "feat: add global navbar"`

---

### Task 4: Setup Data Fetching Hooks

**Files:**
- Create: `frontend/src/hooks/use-crops.ts`
- Create: `frontend/src/hooks/use-varieties.ts`

- [ ] **Step 1: Create `useCrops` hook**

Create `frontend/src/hooks/use-crops.ts`:
```typescript
import { useQuery } from "@tanstack/react-query"

export interface Crop {
  id: number
  name: string
  description: string | null
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function useCrops() {
  return useQuery<Crop[]>({
    queryKey: ["crops"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/crops/`)
      if (!response.ok) {
        throw new Error("Failed to fetch crops")
      }
      return response.json()
    },
  })
}
```

- [ ] **Step 2: Create `useVarieties` hook**

Create `frontend/src/hooks/use-varieties.ts`:
```typescript
import { useQuery } from "@tanstack/react-query"

export interface Variety {
  id: number
  name: string
  origin: string | null
  season: string | null
  crop_id: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function useVarieties() {
  return useQuery<Variety[]>({
    queryKey: ["varieties"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/varieties/`)
      if (!response.ok) {
        throw new Error("Failed to fetch varieties")
      }
      return response.json()
    },
  })
}
```

- [ ] **Step 3: Commit Hooks**

Run: `git add frontend/src/hooks/use-crops.ts frontend/src/hooks/use-varieties.ts && git commit -m "feat: add data fetching hooks for crops and varieties"`

---

### Task 5: Initial Dashboard Page

**Files:**
- Modify: `frontend/src/app/page.tsx`

- [ ] **Step 1: Update home page with basic stats**

Modify `frontend/src/app/page.tsx`:
```tsx
"use client"

import { useCrops } from "@/hooks/use-crops"
import { useVarieties } from "@/hooks/use-varieties"
import { Sprout, Leaf, Activity } from "lucide-react"

export default function Home() {
  const { data: crops, isLoading: isLoadingCrops } = useCrops()
  const { data: varieties, isLoading: isLoadingVarieties } = useVarieties()

  const stats = [
    {
      label: "Total Crops",
      value: crops?.length ?? 0,
      icon: Sprout,
      loading: isLoadingCrops,
    },
    {
      label: "Total Varieties",
      value: varieties?.length ?? 0,
      icon: Leaf,
      loading: isLoadingVarieties,
    },
    {
      label: "System Status",
      value: "Online",
      icon: Activity,
      loading: false,
    },
  ]

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Dashboard Overview</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">
                  {stat.loading ? "..." : stat.value}
                </p>
              </div>
              <stat.icon className="h-8 w-8 text-green-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit Dashboard**

Run: `git add frontend/src/app/page.tsx && git commit -m "feat: update home page with dashboard stats"`
