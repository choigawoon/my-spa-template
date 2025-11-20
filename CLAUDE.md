# CLAUDE.md - AI Assistant Development Guide

**Repository**: mermaidchart-clone
**Last Updated**: 2025-11-20
**Purpose**: Comprehensive guide for AI assistants working on this codebase

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Directory Structure](#directory-structure)
4. [Development Workflow](#development-workflow)
5. [Code Conventions](#code-conventions)
6. [Styling Guidelines](#styling-guidelines)
7. [Routing Patterns](#routing-patterns)
8. [State Management](#state-management)
9. [Data Fetching & API Layer](#data-fetching--api-layer)
10. [API Mocking with MSW](#api-mocking-with-msw)
11. [Schema Validation with Zod](#schema-validation-with-zod)
12. [Testing](#testing)
13. [Common Tasks](#common-tasks)
14. [Important Notes for AI Assistants](#important-notes-for-ai-assistants)

---

## Project Overview

This is a modern React application built with TanStack Router, featuring:

- **Type-safe routing** with file-based routes
- **Modern styling** with Tailwind CSS v4
- **Component library** integration via shadcn/ui
- **State management** with Zustand (slice pattern)
- **Data fetching** with TanStack Query
- **API mocking** with MSW (Mock Service Worker)
- **Schema validation** with Zod
- **Development tooling** with Vite for fast HMR
- **Strict TypeScript** configuration for type safety

### Project Status

- **Current Branch**: `claude/claude-md-mi7g0dgho4blc3b7-01SymnBd9oUjixnUYxNjpGRF`
- **Git Status**: Clean (no uncommitted changes)
- **Last Commit**: `4d537bf - 빌드 배포해도 msw로 동작하게끔 수정`
- **Production Ready**: Development environment with full MSW mocking support

---

## Tech Stack

### Core Dependencies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 19.2.0 | UI library with concurrent features |
| **Build Tool** | Vite | 7.1.7 | Fast dev server & bundler |
| **Language** | TypeScript | 5.7.2 | Type-safe JavaScript |
| **Routing** | TanStack Router | 1.132.0 | File-based routing with code splitting |
| **Data Fetching** | TanStack Query | 5.90.10 | Server state management |
| **State Management** | Zustand | 5.0.8 | Client state with slice pattern |
| **Styling** | Tailwind CSS | 4.0.6 | Utility-first CSS framework |
| **UI Components** | shadcn/ui | latest | Pre-built component system |
| **Icons** | Lucide React | 0.544.0 | Modern icon library |
| **API Mocking** | MSW | 2.12.2 | Mock Service Worker for API mocking |
| **Validation** | Zod | 4.1.12 | Schema validation & type inference |
| **Testing** | Vitest | 3.0.5 | Unit test framework |

### Key Utilities

- **clsx** (2.1.1) - Conditional className utility
- **tailwind-merge** (3.0.2) - Merge Tailwind classes safely
- **class-variance-authority** (0.7.1) - Component variant management
- **tw-animate-css** (1.3.6) - Animation utilities
- **web-vitals** (5.1.0) - Performance monitoring

### Development Tools

- **@tanstack/react-devtools** - Global debugging panel
- **@tanstack/react-router-devtools** - Router state inspection
- **@tanstack/react-query-devtools** - Query state inspection
- **@testing-library/react** (16.2.0) - Component testing
- **jsdom** (27.0.0) - DOM test environment

### Package Manager

**IMPORTANT**: This project uses **pnpm v10.19.0** (not npm or yarn)

```bash
# Install dependencies
pnpm install

# DO NOT USE:
npm install  # Wrong package manager
yarn install # Wrong package manager
```

---

## Directory Structure

```
/home/user/mermaidchart-clone/
├── src/                          # Main source code
│   ├── api/                     # API layer
│   │   ├── client.ts           # API fetch wrapper
│   │   ├── config.ts           # API configuration (mock/real mode)
│   │   └── services/           # TanStack Query hooks
│   │       ├── index.ts        # Re-exports all services
│   │       ├── items.ts        # Items CRUD hooks
│   │       ├── users.ts        # Users CRUD hooks
│   │       ├── auth.ts         # Authentication hooks
│   │       ├── search.ts       # Search hook
│   │       └── health.ts       # Health check hook
│   ├── components/              # React components
│   │   └── Header.tsx          # Navigation header (mobile sidebar)
│   ├── lib/                     # Utility functions
│   │   ├── utils.ts            # cn() helper for class merging
│   │   └── query-client.ts     # TanStack Query client config
│   ├── mocks/                   # MSW mock handlers
│   │   ├── browser.ts          # MSW browser setup
│   │   ├── handlers.ts         # API route handlers
│   │   └── schemas.ts          # Zod schemas for validation
│   ├── routes/                  # File-based routing (TanStack Router)
│   │   ├── __root.tsx          # Root layout (persistent across routes)
│   │   ├── index.tsx           # Home page (/)
│   │   ├── zustand-test.tsx    # Zustand test page
│   │   ├── msw-test.tsx        # MSW + TanStack Query test page
│   │   └── routeTree.gen.ts    # AUTO-GENERATED - DO NOT EDIT
│   ├── stores/                  # Zustand state management
│   │   ├── slices/             # Store slices (modular state)
│   │   │   ├── apiSlice.ts    # API data management
│   │   │   ├── uiSlice.ts     # UI state management
│   │   │   ├── taskSlice.ts   # Task management
│   │   │   └── workflowSlice.ts # Workflow/progress tracking
│   │   └── index.ts            # Combined store with middleware
│   ├── main.tsx                # App entry point
│   ├── styles.css              # Global styles + Tailwind config
│   ├── reportWebVitals.ts      # Performance monitoring
│   └── logo.svg                # React logo
├── public/                       # Static assets (served as-is)
│   ├── mockServiceWorker.js    # MSW service worker
│   ├── favicon.ico
│   ├── manifest.json           # PWA manifest
│   └── robots.txt
├── .env.example                 # Environment variables template
├── API_INTEGRATION.md           # API integration documentation
├── BACKEND_ROADMAP.md          # Backend development roadmap
├── FEATURES_ROADMAP.md         # Feature development roadmap
├── SERVICE_ARCHITECTURE.md     # Service architecture documentation
├── package.json                # Dependencies & scripts
├── pnpm-lock.yaml              # Lock file (commit this)
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite build config
├── components.json             # shadcn/ui config
└── index.html                  # HTML entry point
```

### Key File Locations

- **API Services**: `src/api/services/*.ts` (TanStack Query hooks)
- **API Client**: `src/api/client.ts` (fetch wrapper)
- **Mock Handlers**: `src/mocks/handlers.ts` (MSW routes)
- **Schemas**: `src/mocks/schemas.ts` (Zod validation)
- **Components**: `src/components/*.tsx`
- **Routes**: `src/routes/*.tsx` (auto-discovered)
- **Stores**: `src/stores/` (Zustand state management)
- **Utilities**: `src/lib/*.ts`
- **Styles**: `src/styles.css` (global CSS + Tailwind)

---

## Development Workflow

### Environment Configuration

Create a `.env` file from the template:

```bash
cp .env.example .env
```

**Environment Variables**:
```bash
# API Mode: 'mock' uses MSW, 'real' uses actual backend
VITE_API_MODE=mock

# Backend API URL (used when VITE_API_MODE=real)
VITE_API_BASE_URL=http://localhost:8000

# Feature Flags
VITE_ENABLE_DEVTOOLS=true
```

### Starting Development

```bash
# 1. Install dependencies (if not already done)
pnpm install

# 2. Start dev server on http://localhost:3000
pnpm dev

# 3. Run tests
pnpm test

# 4. Build for production
pnpm build

# 5. Preview production build
pnpm serve
```

### Available Scripts

| Command | Purpose | Details |
|---------|---------|---------|
| `pnpm dev` | Start dev server | Port 3000, HMR enabled, MSW active |
| `pnpm build` | Production build | Runs `vite build && tsc` |
| `pnpm serve` | Preview build | Serves `dist/` on port 4173 |
| `pnpm test` | Run tests | Executes Vitest test suite |

### Development Server Features

- **Hot Module Replacement (HMR)**: Instant updates without page refresh
- **TanStack DevTools**: Open browser to see debugging panels
- **React Query DevTools**: Inspect query state and cache
- **MSW Console**: Logs mock API requests in console
- **React StrictMode**: Enabled in development for warnings

### Test Pages

- `/` - Home page
- `/zustand-test` - Interactive Zustand store demos
- `/msw-test` - TanStack Query + MSW API demos

---

## Code Conventions

### TypeScript Configuration

**Strict Mode Enabled** - All code must be type-safe:

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedSideEffectImports": true
}
```

**Path Aliases**:
```typescript
// Use @ alias for src imports
import { cn } from '@/lib/utils'
import Header from '@/components/Header'
import { useItems } from '@/api/services'

// NOT:
import { cn } from '../lib/utils'  // Avoid relative imports
```

### Component Patterns

#### 1. Functional Components (Recommended)

```tsx
// Good: Arrow function component
export const MyComponent = () => {
  return <div>Content</div>
}

// Also Good: Named function component
export function MyComponent() {
  return <div>Content</div>
}
```

#### 2. React Hooks

```tsx
import { useState } from 'react'

export const Counter = () => {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

#### 3. Component File Naming

- **Components**: PascalCase (e.g., `Header.tsx`, `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`, `apiHelpers.ts`)
- **Routes**: lowercase/kebab-case (e.g., `index.tsx`, `msw-test.tsx`)
- **Services**: camelCase (e.g., `items.ts`, `auth.ts`)

### Import Order Convention

```tsx
// 1. React imports
import { useState } from 'react'

// 2. Third-party libraries
import { Link } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Menu, X } from 'lucide-react'

// 3. Internal utilities
import { cn } from '@/lib/utils'
import { apiClient } from '@/api/client'

// 4. API services
import { useItems, useCreateItem } from '@/api/services'

// 5. Stores
import { useStore } from '@/stores'

// 6. Components
import Header from '@/components/Header'

// 7. Types
import type { Item } from '@/mocks/schemas'
```

---

## Styling Guidelines

### Tailwind CSS v4 Approach

This project uses **Tailwind CSS v4** with CSS variables for theming.

#### 1. Inline Utility Classes (Primary Method)

```tsx
// Preferred: Tailwind utilities directly in JSX
export const Button = () => {
  return (
    <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
      Click Me
    </button>
  )
}
```

#### 2. Conditional Classes with `cn()` Utility

```tsx
import { cn } from '@/lib/utils'

export const Button = ({ variant, className }: ButtonProps) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg", // Base styles
        variant === "primary" && "bg-primary text-white",
        variant === "secondary" && "bg-secondary text-foreground",
        className // Allow override
      )}
    >
      Click Me
    </button>
  )
}
```

#### 3. Component Variants with CVA

```tsx
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  "px-4 py-2 rounded-lg", // Base styles
  {
    variants: {
      variant: {
        primary: "bg-primary text-white",
        secondary: "bg-secondary text-foreground",
      },
      size: {
        sm: "text-sm px-3 py-1",
        lg: "text-lg px-6 py-3",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
)
```

### Theme Colors (CSS Variables)

Available in both light and dark modes:

```css
/* Semantic colors */
--background, --foreground
--card, --card-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground

/* UI elements */
--border, --input, --ring

/* Chart colors */
--chart-1 through --chart-5

/* Border radius */
--radius-sm, --radius-md, --radius-lg, --radius-xl
```

**Usage in Tailwind**:
```tsx
<div className="bg-background text-foreground border-border rounded-lg">
  <p className="text-muted-foreground">Muted text</p>
  <button className="bg-primary text-primary-foreground">Primary Button</button>
</div>
```

### Dark Mode

Toggle dark mode by adding `.dark` class to `<html>` (handled automatically by root layout):

```tsx
// Use the UI actions from Zustand
const { setTheme } = useUiActions()

setTheme('dark')   // Enable dark mode
setTheme('light')  // Enable light mode
setTheme('system') // Follow system preference
```

### Adding shadcn/ui Components

```bash
# Install new components
pnpx shadcn@latest add button
pnpx shadcn@latest add card
pnpx shadcn@latest add dialog

# Components will be added to src/components/ui/
```

---

## Routing Patterns

### File-Based Routing

TanStack Router uses **file-based routing** - routes are defined by files in `src/routes/`.

#### Route File Structure

| File Path | Route URL | Description |
|-----------|-----------|-------------|
| `index.tsx` | `/` | Home page |
| `zustand-test.tsx` | `/zustand-test` | Zustand test page |
| `msw-test.tsx` | `/msw-test` | MSW + Query test page |
| `blog.$id.tsx` | `/blog/:id` | Dynamic blog post |
| `__root.tsx` | N/A | Root layout (persistent) |

#### Creating a New Route

**Step 1**: Create file in `src/routes/`

```bash
touch src/routes/about.tsx
```

**Step 2**: Define route component

```tsx
// src/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage
})

function AboutPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">About Us</h1>
      <p>This is the about page</p>
    </div>
  )
}
```

**Step 3**: Route is automatically registered (via `routeTree.gen.ts`)

**IMPORTANT**:
- Do NOT manually edit `src/routes/routeTree.gen.ts` (auto-generated)
- Vite plugin automatically updates route tree on file changes

### Navigation with Link Component

```tsx
import { Link } from '@tanstack/react-router'

export const Navigation = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/msw-test">MSW Test</Link>

      {/* Active link styling */}
      <Link
        to="/zustand-test"
        activeProps={{ className: 'text-primary font-bold' }}
      >
        Zustand Test
      </Link>

      {/* Dynamic routes */}
      <Link to="/blog/$id" params={{ id: '123' }}>
        Blog Post 123
      </Link>
    </nav>
  )
}
```

### Root Layout (`__root.tsx`)

The root layout wraps ALL routes and persists across navigation:

```tsx
// src/routes/__root.tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import Header from '@/components/Header'
import { useTheme } from '@/stores'

function RootComponent() {
  const theme = useTheme()

  // Apply theme to DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <>
      <Header />
      <Outlet />
      <TanStackDevtools />
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
```

### Programmatic Navigation

```tsx
import { useNavigate } from '@tanstack/react-router'

export const LoginForm = () => {
  const navigate = useNavigate()

  const handleLogin = async () => {
    // ... login logic
    navigate({ to: '/dashboard' })
  }

  return <button onClick={handleLogin}>Login</button>
}
```

---

## State Management

### Current Setup: Zustand with Slice Pattern

This project uses **Zustand** for global state management with a modular slice pattern.

#### Store Architecture

```
src/stores/
├── slices/
│   ├── apiSlice.ts      # API data management (users, posts)
│   ├── uiSlice.ts       # UI state (theme, sidebar, modals)
│   ├── taskSlice.ts     # Task management (CRUD, filtering)
│   └── workflowSlice.ts # Workflow progress tracking
└── index.ts             # Combined store with middleware
```

### Basic Usage

```tsx
import { useStore } from '@/stores'

export const MyComponent = () => {
  // Use specific state (recommended for performance)
  const users = useStore(state => state.users)
  const theme = useStore(state => state.theme)

  // Use actions
  const addTask = useStore(state => state.addTask)

  return <div>...</div>
}
```

### Selector Hooks (Recommended)

Use pre-built selector hooks for better performance:

```tsx
import {
  useUsers, useTheme, useTasks,
  useApiActions, useUiActions, useTaskActions, useWorkflowActions
} from '@/stores'

export const MyComponent = () => {
  // State selectors
  const users = useUsers()
  const theme = useTheme()
  const tasks = useTasks()

  // Action selectors
  const { fetchUsers, addUser } = useApiActions()
  const { setTheme, addNotification } = useUiActions()

  return <div>...</div>
}
```

### Store Slices

#### 1. API Slice (Data Management)

```tsx
import { useApiActions, useUsers } from '@/stores'

export const UserList = () => {
  const users = useUsers()
  const { fetchUsers, addUser, removeUser } = useApiActions()

  return (
    <div>
      <button onClick={fetchUsers}>Fetch Users</button>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

#### 2. UI Slice (UI State)

```tsx
import { useTheme, useUiActions } from '@/stores'

export const ThemeToggle = () => {
  const theme = useTheme()
  const { setTheme, addNotification } = useUiActions()

  return (
    <div>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <button onClick={() => addNotification('Hello!', 'success')}>
        Notify
      </button>
    </div>
  )
}
```

#### 3. Task Slice (Task Management)

```tsx
import { useTasks, useTaskActions } from '@/stores'

export const TaskList = () => {
  const tasks = useTasks() // Already filtered and sorted
  const { addTask, deleteTask, setFilter } = useTaskActions()

  return (
    <div>
      <button onClick={() => setFilter('completed')}>Show Completed</button>
      {tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  )
}
```

#### 4. Workflow Slice (Progress Tracking)

```tsx
import {
  useCurrentWork, useWorkHistory, useWorkLogs,
  useIsWorkInProgress, useWorkflowActions
} from '@/stores'

export const WorkflowDemo = () => {
  const currentWork = useCurrentWork()
  const workHistory = useWorkHistory()
  const isWorking = useIsWorkInProgress()
  const { simulateWork, clearHistory } = useWorkflowActions()

  return (
    <div>
      <button
        onClick={() => simulateWork('Build Project', 3000)}
        disabled={isWorking}
      >
        Start Work
      </button>
      {currentWork && (
        <div>
          <p>{currentWork.name}: {currentWork.progress}%</p>
        </div>
      )}
    </div>
  )
}
```

### Middleware

The store uses two Zustand middleware:

#### 1. DevTools (Development Only)

Redux DevTools integration for debugging - automatically enabled in development.

#### 2. Persist

LocalStorage persistence for UI preferences:
- theme
- language
- isSidebarOpen

---

## Data Fetching & API Layer

### TanStack Query Integration

This project uses **TanStack Query** for all server state management.

#### Query Client Configuration

```tsx
// src/lib/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,  // 5 minutes
      gcTime: 10 * 60 * 1000,    // 10 minutes
    },
    mutations: {
      retry: 0,
    },
  },
})
```

### API Client

The API client (`src/api/client.ts`) provides a unified fetch wrapper:

```tsx
import { apiClient } from '@/api/client'

// GET request
const data = await apiClient.get<ItemsResponse>('/api/items', {
  params: { skip: 0, limit: 10 }
})

// POST request
const newItem = await apiClient.post<Item>('/api/items', {
  name: 'New Item',
  price: 100
})

// PUT request
const updated = await apiClient.put<Item>('/api/items/1', {
  name: 'Updated'
})

// DELETE request
await apiClient.delete<{ message: string }>('/api/items/1')
```

### API Services Pattern

Each resource has its own service file with TanStack Query hooks:

```tsx
// src/api/services/items.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

// Query keys for cache management
export const itemsKeys = {
  all: ['items'] as const,
  lists: () => [...itemsKeys.all, 'list'] as const,
  list: (params) => [...itemsKeys.lists(), params] as const,
  detail: (id: number) => [...itemsKeys.all, 'detail', id] as const,
}

// Fetch items list
export const useItems = (params?: { skip?: number; limit?: number }) => {
  return useQuery({
    queryKey: itemsKeys.list(params),
    queryFn: () => apiClient.get<ItemsListResponse>('/api/items', { params }),
  })
}

// Create item with cache invalidation
export const useCreateItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ItemCreate) => apiClient.post<Item>('/api/items', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() })
    },
  })
}
```

### Using API Hooks in Components

```tsx
import { useItems, useCreateItem, useDeleteItem } from '@/api/services'

export const ItemsPage = () => {
  const { data, isLoading, error, refetch } = useItems()
  const createMutation = useCreateItem()
  const deleteMutation = useDeleteItem()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>

      {data?.items.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <button
            onClick={() => deleteMutation.mutate(item.id)}
            disabled={deleteMutation.isPending}
          >
            Delete
          </button>
        </div>
      ))}

      <button
        onClick={() => createMutation.mutate({ name: 'New', price: 100 })}
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? 'Creating...' : 'Create Item'}
      </button>
    </div>
  )
}
```

### Available API Services

| Service | Hooks | Endpoints |
|---------|-------|-----------|
| **items.ts** | `useItems`, `useItem`, `useCreateItem`, `useUpdateItem`, `useDeleteItem` | `/api/items` |
| **users.ts** | `useUsers`, `useUser`, `useCreateUser` | `/api/users` |
| **auth.ts** | `useLogin` | `/api/auth/login` |
| **search.ts** | `useSearch` | `/api/search` |
| **health.ts** | `useHealthCheck` | `/api/health` |

---

## API Mocking with MSW

### Overview

This project uses **MSW (Mock Service Worker)** to mock backend APIs during development and production builds. This allows frontend development without a real backend.

### Configuration

**API Mode** is controlled by environment variable:

```bash
# .env
VITE_API_MODE=mock  # Use MSW (default)
VITE_API_MODE=real  # Use actual backend
```

### MSW Setup

```tsx
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

export async function startMockServiceWorker() {
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
}
```

### Creating Mock Handlers

```tsx
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'
import { ItemSchema, ItemCreateSchema } from './schemas'

export const handlers = [
  // GET /api/items
  http.get('/api/items', ({ request }) => {
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '100')

    const paginatedItems = items.slice(skip, skip + limit)
    return HttpResponse.json({
      items: paginatedItems,
      total: items.length,
      skip,
      limit,
    })
  }),

  // POST /api/items
  http.post('/api/items', async ({ request }) => {
    const body = await request.json()

    // Validate with Zod
    const result = ItemCreateSchema.safeParse(body)
    if (!result.success) {
      return HttpResponse.json(
        { detail: result.error.issues },
        { status: 422 }
      )
    }

    const newItem = { id: nextId++, ...result.data }
    items.push(newItem)

    return HttpResponse.json(newItem, { status: 201 })
  }),
]
```

### Available Mock Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/items` | List items (paginated) |
| GET | `/api/items/:id` | Get single item |
| POST | `/api/items` | Create item |
| PUT | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |
| GET | `/api/users` | List users |
| GET | `/api/users/:id` | Get single user |
| POST | `/api/users` | Create user |
| POST | `/api/auth/login` | Login (admin/admin) |
| GET | `/api/search` | Search items |

### Switching to Real Backend

1. Update `.env`:
   ```bash
   VITE_API_MODE=real
   VITE_API_BASE_URL=http://localhost:8000
   ```

2. MSW will not start, and requests go to actual backend
3. Vite proxy handles CORS in development

---

## Schema Validation with Zod

### Overview

This project uses **Zod** for schema validation, providing:
- Runtime validation
- TypeScript type inference
- Consistent error handling

### Schema Location

All schemas are in `src/mocks/schemas.ts`:

```tsx
import { z } from 'zod'

// Base schema with validation rules
export const ItemBaseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
})

// Create schema (request body)
export const ItemCreateSchema = ItemBaseSchema

// Update schema (partial fields)
export const ItemUpdateSchema = ItemBaseSchema.partial()

// Full schema (with ID and timestamps)
export const ItemSchema = ItemBaseSchema.extend({
  id: z.number().int().positive(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

// Type inference
export type Item = z.infer<typeof ItemSchema>
export type ItemCreate = z.infer<typeof ItemCreateSchema>
export type ItemUpdate = z.infer<typeof ItemUpdateSchema>
```

### Using Schemas

```tsx
import { ItemCreateSchema, type ItemCreate } from '@/mocks/schemas'

// Validate data
const result = ItemCreateSchema.safeParse(userData)

if (result.success) {
  // result.data is typed as ItemCreate
  const validData = result.data
} else {
  // Handle validation errors
  console.error(result.error.issues)
}
```

### Available Schemas

- **Item**: `ItemSchema`, `ItemCreateSchema`, `ItemUpdateSchema`
- **User**: `UserSchema`, `UserCreateSchema`
- **Auth**: `LoginRequestSchema`, `LoginResponseSchema`
- **Health**: `HealthCheckSchema`
- **Search**: `SearchResponseSchema`
- **Errors**: `HTTPErrorSchema`, `HTTPValidationErrorSchema`

---

## Testing

### Test Framework: Vitest

**Configuration**: Tests run via Vitest with jsdom environment.

**Running Tests**:
```bash
pnpm test         # Run all tests
```

### Writing Component Tests

```tsx
// src/components/__tests__/Header.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '../Header'

describe('Header Component', () => {
  it('renders menu button', () => {
    render(<Header />)
    const menuButton = screen.getByRole('button', { name: /menu/i })
    expect(menuButton).toBeDefined()
  })
})
```

### Testing TanStack Query Hooks

```tsx
import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { useItems } from '@/api/services'

describe('useItems', () => {
  it('fetches items', async () => {
    const queryClient = new QueryClient()

    const { result } = renderHook(() => useItems(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })
})
```

---

## Common Tasks

### Task 1: Add a New API Endpoint

**Step 1**: Add Zod schemas in `src/mocks/schemas.ts`:
```tsx
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
})

export type Product = z.infer<typeof ProductSchema>
```

**Step 2**: Add MSW handler in `src/mocks/handlers.ts`:
```tsx
http.get('/api/products', () => {
  return HttpResponse.json({ products: mockProducts })
}),
```

**Step 3**: Create service in `src/api/services/products.ts`:
```tsx
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => apiClient.get<ProductsResponse>('/api/products'),
  })
}
```

**Step 4**: Export from `src/api/services/index.ts`:
```tsx
export * from './products'
```

### Task 2: Add a New Route

```bash
touch src/routes/products.tsx
```

```tsx
// src/routes/products.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useProducts } from '@/api/services'

export const Route = createFileRoute('/products')({
  component: ProductsPage
})

function ProductsPage() {
  const { data, isLoading } = useProducts()

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Products</h1>
      {data?.products.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  )
}
```

### Task 3: Add a New Zustand Slice

**Step 1**: Create slice in `src/stores/slices/authSlice.ts`:
```tsx
import { StateCreator } from 'zustand'

export interface AuthSlice {
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  isAuthenticated: false,
  login: (token, user) => {
    localStorage.setItem('token', token)
    set({ user, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, isAuthenticated: false })
  },
})
```

**Step 2**: Add to main store in `src/stores/index.ts`:
```tsx
import { createAuthSlice, AuthSlice } from './slices/authSlice'

export type Store = ApiSlice & UiSlice & TaskSlice & WorkflowSlice & AuthSlice

// Add to store creation
...createAuthSlice(...args),
```

### Task 4: Add shadcn/ui Component

```bash
pnpx shadcn@latest add button
pnpx shadcn@latest add card

# Use in your code:
import { Button } from '@/components/ui/button'
```

---

## Important Notes for AI Assistants

### Critical Rules

1. **DO NOT Edit Auto-Generated Files**
   - `src/routes/routeTree.gen.ts` is auto-generated by TanStack Router plugin
   - Never manually modify this file

2. **Use pnpm, Not npm/yarn**
   - Project uses `pnpm@10.19.0`
   - Commands: `pnpm install`, `pnpm add`, `pnpm dev`

3. **TypeScript Strict Mode**
   - All code must be type-safe
   - No `any` types unless absolutely necessary
   - Use Zod schemas for type inference

4. **Prefer Editing Over Creating**
   - ALWAYS prefer editing existing files
   - DO NOT create new files unless required

5. **Use TanStack Query for Server State**
   - All API data should use TanStack Query hooks
   - Use Zustand only for client-side state
   - Never duplicate server state in Zustand

6. **Validate with Zod**
   - All API schemas should have Zod validation
   - Use `safeParse` for runtime validation
   - Infer TypeScript types from schemas

7. **Follow API Service Pattern**
   - Create query keys factory
   - Invalidate related queries on mutations
   - Export hooks from index.ts

8. **Git Workflow**
   - Current branch: `claude/claude-md-mi7g0dgho4blc3b7-01SymnBd9oUjixnUYxNjpGRF`
   - Use `git push -u origin <branch>` for pushing
   - Use descriptive commit messages

### Common Pitfalls to Avoid

**DON'T**:
- Use `npm` or `yarn` instead of `pnpm`
- Edit `routeTree.gen.ts` manually
- Put server state in Zustand (use TanStack Query)
- Forget to invalidate queries after mutations
- Add emojis unless requested
- Create unnecessary documentation files
- Use relative imports instead of `@/` alias
- Skip Zod validation in mock handlers

**DO**:
- Use `pnpm` for all package operations
- Use TanStack Query for all API data
- Use Zustand for client-only state (theme, UI)
- Validate all data with Zod schemas
- Follow query key factory pattern
- Use `@/` alias for all imports
- Invalidate related queries after mutations

### File Modification Guidelines

**Always Read Before Writing**:
- Use `Read` tool before `Edit` or `Write`
- Understand existing code structure first
- Maintain consistent coding style

**When Adding Features**:
1. Check if similar functionality exists
2. Add Zod schemas for validation
3. Add MSW handlers for mocking
4. Create TanStack Query hooks
5. Follow established patterns

### Performance Considerations

- **Code Splitting**: Routes are automatically code-split
- **Query Caching**: Leverage staleTime and gcTime
- **Selector Hooks**: Use Zustand selectors for performance
- **Query Keys**: Use factories for proper cache management

### Security Best Practices

- **Environment Variables**: Use `.env` for configuration
- **API Keys**: Never hardcode in source
- **Input Validation**: Always validate with Zod
- **Token Storage**: Handle JWT tokens securely

---

## Quick Reference Commands

```bash
# Development
pnpm install              # Install dependencies
pnpm dev                  # Start dev server (port 3000)
pnpm build                # Production build
pnpm serve                # Preview production build
pnpm test                 # Run tests

# Adding Dependencies
pnpm add <package>        # Add production dependency
pnpm add -D <package>     # Add dev dependency

# shadcn/ui Components
pnpx shadcn@latest add <component>

# Git Operations
git status
git add .
git commit -m "message"
git push -u origin claude/claude-md-mi7g0dgho4blc3b7-01SymnBd9oUjixnUYxNjpGRF
```

---

## Additional Resources

- **TanStack Router Docs**: https://tanstack.com/router/latest
- **TanStack Query Docs**: https://tanstack.com/query/latest
- **MSW Docs**: https://mswjs.io/docs
- **Zod Docs**: https://zod.dev
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **shadcn/ui Components**: https://ui.shadcn.com/
- **Zustand Docs**: https://zustand-demo.pmnd.rs/

---

**Last Updated**: 2025-11-20
**Maintained By**: AI Assistants (Claude Code)

---

## Changelog

### 2025-11-20
- Major update reflecting current codebase state
- Added TanStack Query integration documentation
- Added MSW (Mock Service Worker) documentation
- Added Zod schema validation documentation
- Added workflowSlice to Zustand stores
- Updated API layer documentation with services pattern
- Added new test pages (msw-test)
- Updated dependencies and versions
- Added environment configuration section
- Added comprehensive API mocking guide

### 2025-11-18 (Update 2)
- Implemented Zustand state management with slice pattern
- Created apiSlice, uiSlice, and taskSlice
- Added /zustand-test route

### 2025-11-18
- Initial creation of CLAUDE.md
- Documented core technologies and patterns
