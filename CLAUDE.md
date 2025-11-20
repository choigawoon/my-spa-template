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
11. [IndexedDB with Dexie](#indexeddb-with-dexie)
12. [Schema Validation with Zod](#schema-validation-with-zod)
13. [Internationalization (i18n)](#internationalization-i18n)
14. [PWA Support](#pwa-support)
15. [Testing](#testing)
16. [Common Tasks](#common-tasks)
17. [Important Notes for AI Assistants](#important-notes-for-ai-assistants)

---

## Project Overview

This is a modern React application built with TanStack Router, featuring:

- **Type-safe routing** with file-based routes
- **Modern styling** with Tailwind CSS v4
- **Component library** integration via shadcn/ui
- **State management** with Zustand (slice pattern)
- **Data fetching** with TanStack Query
- **API mocking** with MSW (Mock Service Worker)
- **Persistent mock DB** with IndexedDB (Dexie)
- **Schema validation** with Zod
- **Internationalization** with i18next (en, ko, ja)
- **PWA support** with offline capability
- **Desktop app** with Tauri 2.0
- **Development tooling** with Vite for fast HMR
- **Strict TypeScript** configuration for type safety

### Project Status

- **Current Branch**: `claude/claude-md-mi7l5ydscdhl78fr-01D9vaQmAhRnKde3E1EdZUji`
- **Git Status**: Clean (no uncommitted changes)
- **Last Commit**: `4e73c96 - Merge pull request #18 (IndexedDB mock DB)`
- **Production Ready**: Development environment with full MSW + IndexedDB mocking support

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
| **Mock Database** | Dexie | 4.2.1 | IndexedDB wrapper for persistent mock data |
| **Validation** | Zod | 4.1.12 | Schema validation & type inference |
| **i18n** | i18next | 25.6.3 | Internationalization framework |
| **PWA** | vite-plugin-pwa | 1.1.0 | Progressive Web App support |
| **Desktop** | Tauri | 2.9.0 | Cross-platform desktop app framework |
| **Testing** | Vitest | 3.0.5 | Unit test framework |

### Key Utilities

- **clsx** (2.1.1) - Conditional className utility
- **tailwind-merge** (3.0.2) - Merge Tailwind classes safely
- **class-variance-authority** (0.7.1) - Component variant management
- **tw-animate-css** (1.3.6) - Animation utilities
- **web-vitals** (5.1.0) - Performance monitoring
- **react-i18next** (16.3.5) - React bindings for i18next
- **i18next-browser-languagedetector** (8.2.0) - Auto language detection
- **workbox-window** (7.4.0) - Service worker management

### Radix UI Primitives

- **@radix-ui/react-dialog** (1.1.15)
- **@radix-ui/react-label** (2.1.8)
- **@radix-ui/react-progress** (1.1.8)
- **@radix-ui/react-select** (2.2.6)
- **@radix-ui/react-separator** (1.1.8)
- **@radix-ui/react-slot** (1.2.4)

### Development Tools

- **@tanstack/devtools-vite** (0.3.11) - Integrated devtools
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
│   │   ├── Header.tsx          # Navigation header (mobile sidebar)
│   │   ├── LanguageSelector.tsx # Language switcher component
│   │   ├── PWAPrompt.tsx       # PWA install/update prompts
│   │   └── ui/                 # shadcn/ui components
│   │       ├── alert.tsx, badge.tsx, button.tsx, card.tsx
│   │       ├── dialog.tsx, input.tsx, label.tsx, progress.tsx
│   │       ├── select.tsx, separator.tsx, sheet.tsx
│   ├── db/                      # IndexedDB database
│   │   └── index.ts            # Dexie setup, entities, seed data
│   ├── hooks/                   # Custom React hooks
│   │   ├── index.ts            # Re-exports
│   │   └── usePWA.ts           # PWA installation & update hook
│   ├── lib/                     # Utility functions
│   │   ├── utils.ts            # cn() helper for class merging
│   │   ├── query-client.ts     # TanStack Query client config
│   │   └── i18n.ts             # i18next configuration
│   ├── locales/                 # Translation files
│   │   ├── index.ts, en.json, ko.json, ja.json
│   ├── mocks/                   # MSW mock handlers
│   │   ├── browser.ts          # MSW browser setup
│   │   ├── handlers.ts         # API route handlers (uses IndexedDB)
│   │   └── schemas.ts          # Re-exports from src/schemas
│   ├── schemas/                 # Zod schema definitions
│   │   ├── api/                # API request/response schemas
│   │   ├── models/             # DB model schemas (mirrors Prisma)
│   │   └── index.ts            # Main entry point
│   ├── routes/                  # File-based routing (TanStack Router)
│   │   ├── __root.tsx          # Root layout
│   │   ├── index.tsx           # Home page (/)
│   │   ├── zustand-test.tsx    # Zustand test page
│   │   ├── msw-test.tsx        # MSW + TanStack Query test page
│   │   └── routeTree.gen.ts    # AUTO-GENERATED - DO NOT EDIT
│   ├── stores/                  # Zustand state management
│   │   ├── slices/             # apiSlice, uiSlice, taskSlice, workflowSlice
│   │   └── index.ts            # Combined store with middleware
│   ├── test/                    # Test utilities
│   │   ├── setup.ts            # Vitest setup
│   │   └── i18n-test-utils.tsx # i18n testing helpers
│   ├── main.tsx                # App entry point
│   ├── styles.css              # Global styles + Tailwind config
│   └── vite-env.d.ts           # Vite type definitions
├── public/                      # Static assets
│   ├── mockServiceWorker.js, favicon.ico
│   ├── logo192.png, logo512.png # PWA icons
│   └── manifest.json           # PWA manifest
├── src-tauri/                   # Tauri desktop app
│   ├── src/                    # Rust source code
│   │   ├── main.rs            # Main entry point
│   │   └── lib.rs             # App library
│   ├── capabilities/           # Tauri permissions
│   ├── icons/                  # App icons
│   ├── tauri.conf.json        # Tauri configuration
│   └── Cargo.toml             # Rust dependencies
├── prisma/schema.prisma        # Database schema (source of truth)
├── vite.config.ts              # Vite build config (includes PWA)
└── package.json                # Dependencies & scripts
```

---

## Development Workflow

### Environment Configuration

```bash
cp .env.example .env
```

**Environment Variables**:
```bash
VITE_API_MODE=mock              # 'mock' or 'real'
VITE_API_BASE_URL=http://localhost:8000
VITE_ENABLE_DEVTOOLS=true
```

### Available Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server (port 3000) |
| `pnpm build` | Production build |
| `pnpm serve` | Preview production build |
| `pnpm test` | Run tests |
| `pnpm tauri:dev` | Start Tauri desktop app (dev mode) |
| `pnpm tauri:build` | Build Tauri desktop app |

---

## Internationalization (i18n)

### Overview

Supports **English (en)**, **Korean (ko)**, and **Japanese (ja)** using i18next.

### Usage

```tsx
import { useTranslation } from 'react-i18next'

export const MyComponent = () => {
  const { t } = useTranslation()
  return <h1>{t('page.title')}</h1>
}
```

### Changing Language

```tsx
import { useLanguage, useUiActions } from '@/stores'

const { setLanguage } = useUiActions()
setLanguage('ko') // Syncs with i18next automatically
```

### Translation Files

Located in `src/locales/`:
- `en.json` - English
- `ko.json` - Korean
- `ja.json` - Japanese

---

## IndexedDB with Dexie

### Overview

Uses **Dexie.js** for persistent mock data storage in IndexedDB.

### Database Setup

```tsx
// src/db/index.ts
import { db, initializeDatabase, resetDatabase } from '@/db'

// Query
const items = await db.items.toArray()
const item = await db.items.get(1)

// Create
const id = await db.items.add({ name: 'New Item', ... })

// Update
await db.items.put({ id: 1, ...updatedData })

// Delete
await db.items.delete(1)

// Reset to seed data
await resetDatabase()
```

### Tables

- **items**: id, name, description, price, category, created_at, updated_at
- **users**: id, email, username, full_name, is_active, created_at

---

## PWA Support

### Overview

Progressive Web App with offline capability using vite-plugin-pwa.

### usePWA Hook

```tsx
import { usePWA } from '@/hooks/usePWA'

const {
  canInstall,      // Can show install prompt
  installPrompt,   // Trigger install
  needRefresh,     // Update available
  updateServiceWorker, // Apply update
  isOnline,        // Network status
} = usePWA()
```

### PWAPrompt Component

Included in root layout, provides UI for:
- Install prompts
- Update notifications
- Offline indicator

---

## Tauri Desktop App

### Overview

Build native desktop applications using Tauri 2.0 with the existing React frontend.

### Prerequisites

**Linux** (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

**macOS**:
```bash
xcode-select --install
```

**Windows**:
- Microsoft Visual Studio C++ Build Tools
- WebView2 (included with Edge)

### Development

```bash
# Start desktop app in development mode
pnpm tauri:dev

# Build production desktop app
pnpm tauri:build
```

### Configuration

- **tauri.conf.json** - Main Tauri configuration (window size, app name, etc.)
- **Cargo.toml** - Rust dependencies
- **capabilities/default.json** - API permissions for the app

### Tauri API Usage

```tsx
import { invoke } from '@tauri-apps/api/core'
import { open } from '@tauri-apps/plugin-dialog'

// Call Rust backend
const result = await invoke('my_command', { arg: 'value' })

// Use Tauri plugins
const file = await open({ multiple: false })
```

### Adding Rust Commands

```rust
// src-tauri/src/lib.rs
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

---

## State Management

### Zustand Slices

- **apiSlice** - API data (users, posts)
- **uiSlice** - UI state (theme, language, sidebar, modals)
- **taskSlice** - Task management
- **workflowSlice** - Progress tracking

### Usage

```tsx
import { useTheme, useLanguage, useUiActions } from '@/stores'

const theme = useTheme()
const language = useLanguage()
const { setTheme, setLanguage } = useUiActions()
```

---

## API Mocking with MSW

Uses MSW + IndexedDB for persistent mock API. Data survives page reloads.

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | List items |
| POST | `/api/items` | Create item |
| PUT | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |
| GET/POST | `/api/users` | Users CRUD |
| POST | `/api/auth/login` | Login (admin/admin) |
| GET | `/api/search` | Search items |

---

## Available shadcn/ui Components

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent } from '@/components/ui/sheet'
```

---

## Important Notes for AI Assistants

### Critical Rules

1. **DO NOT** edit `routeTree.gen.ts` (auto-generated)
2. **Use pnpm** - not npm or yarn
3. **TypeScript strict mode** - no `any` types
4. **TanStack Query** for server state, **Zustand** for client state
5. **i18n** for all user-facing text
6. **Zod** for all API validation

### Common Pitfalls

**DON'T**:
- Use npm/yarn
- Put server state in Zustand
- Hardcode text (use i18n)
- Skip Zod validation
- Forget translations in ALL locale files

**DO**:
- Use `@/` alias for imports
- Invalidate queries after mutations
- Add translations to en.json, ko.json, ja.json
- Use selector hooks for Zustand

---

## Quick Reference

```bash
pnpm dev                  # Start dev server
pnpm build                # Production build
pnpm test                 # Run tests
pnpm tauri:dev            # Start Tauri desktop app
pnpm tauri:build          # Build desktop app
pnpx shadcn@latest add X  # Add UI component
```

---

## Changelog

### 2025-11-20 (Update 3)
- Added Tauri 2.0 for desktop app support
- Added @tauri-apps/cli and @tauri-apps/api
- Added src-tauri directory with Rust backend
- Updated vite.config.ts for Tauri compatibility
- Added tauri:dev and tauri:build scripts

### 2025-11-20 (Update 2)
- Added IndexedDB with Dexie for persistent mock data
- Added PWA support with vite-plugin-pwa
- Added i18n with i18next (en, ko, ja)
- Added shadcn/ui components (alert, badge, button, card, dialog, input, label, progress, select, separator, sheet)
- Added LanguageSelector and PWAPrompt components
- Updated MSW handlers to use IndexedDB
- Updated uiSlice with language management

### 2025-11-20
- Added TanStack Query, MSW, Zod documentation
- Added workflowSlice

### 2025-11-18
- Initial CLAUDE.md creation
- Zustand slice pattern implementation
