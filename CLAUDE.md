# CLAUDE.md - AI Assistant Development Guide

**Repository**: mermaidchart-clone
**Last Updated**: 2025-11-18
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
9. [Data Fetching](#data-fetching)
10. [Testing](#testing)
11. [Common Tasks](#common-tasks)
12. [Important Notes for AI Assistants](#important-notes-for-ai-assistants)

---

## Project Overview

This is a modern React application built with TanStack Router, featuring:

- **Type-safe routing** with file-based routes
- **Modern styling** with Tailwind CSS v4
- **Component library** integration via shadcn/ui
- **Development tooling** with Vite for fast HMR
- **Strict TypeScript** configuration for type safety

### Project Status

- **Current Branch**: `claude/claude-md-mi3wt3hjre4d4hsq-01TogY8r8Z42SbobhnEcji7T`
- **Git Status**: Clean (no uncommitted changes)
- **Last Commit**: `bae939f - latest setup`
- **Production Ready**: ⚠️ Needs tests, environment config, and API integration

---

## Tech Stack

### Core Dependencies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 19.2.0 | UI library with concurrent features |
| **Build Tool** | Vite | 7.1.7 | Fast dev server & bundler |
| **Language** | TypeScript | 5.7.2 | Type-safe JavaScript |
| **Routing** | TanStack Router | 1.132.0 | File-based routing with code splitting |
| **Styling** | Tailwind CSS | 4.0.6 | Utility-first CSS framework |
| **UI Components** | shadcn/ui | latest | Pre-built component system |
| **Icons** | Lucide React | 0.544.0 | Modern icon library |
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
- **@testing-library/react** (16.2.0) - Component testing
- **jsdom** (27.0.0) - DOM test environment

### Package Manager

**IMPORTANT**: This project uses **pnpm v10.19.0** (not npm or yarn)

```bash
# Install dependencies
pnpm install

# DO NOT USE:
npm install  # ❌ Wrong package manager
yarn install # ❌ Wrong package manager
```

---

## Directory Structure

```
/home/user/mermaidchart-clone/
├── src/                          # Main source code
│   ├── components/               # React components
│   │   └── Header.tsx           # Navigation header (mobile sidebar)
│   ├── routes/                  # File-based routing (TanStack Router)
│   │   ├── __root.tsx          # Root layout (persistent across routes)
│   │   ├── index.tsx           # Home page (/)
│   │   └── routeTree.gen.ts    # AUTO-GENERATED - DO NOT EDIT
│   ├── lib/                     # Utility functions
│   │   └── utils.ts            # cn() helper for class merging
│   ├── main.tsx                # App entry point
│   ├── styles.css              # Global styles + Tailwind config
│   ├── reportWebVitals.ts      # Performance monitoring
│   └── logo.svg                # React logo
├── public/                       # Static assets (served as-is)
│   ├── favicon.ico
│   ├── manifest.json           # PWA manifest
│   ├── robots.txt
│   └── *.png, *.svg            # Logos and icons
├── .vscode/                      # VS Code settings
├── package.json                # Dependencies & scripts
├── pnpm-lock.yaml              # Lock file (commit this)
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite build config
├── components.json             # shadcn/ui config
└── index.html                  # HTML entry point
```

### Key File Locations

- **Components**: `src/components/*.tsx`
- **Routes**: `src/routes/*.tsx` (auto-discovered)
- **Utilities**: `src/lib/*.ts`
- **Styles**: `src/styles.css` (global CSS + Tailwind)
- **Types**: Inferred from TypeScript, no separate types folder

---

## Development Workflow

### Starting Development

```bash
# 1. Install dependencies (if not already done)
pnpm install

# 2. Start dev server on http://localhost:3000
pnpm dev

# 3. Run tests (when available)
pnpm test

# 4. Build for production
pnpm build

# 5. Preview production build
pnpm serve
```

### Available Scripts

| Command | Purpose | Details |
|---------|---------|---------|
| `pnpm dev` | Start dev server | Port 3000, HMR enabled |
| `pnpm build` | Production build | Runs `vite build && tsc` |
| `pnpm serve` | Preview build | Serves `dist/` on port 4173 |
| `pnpm test` | Run tests | Executes Vitest test suite |

### Development Server Features

- **Hot Module Replacement (HMR)**: Instant updates without page refresh
- **TanStack DevTools**: Open browser to see debugging panels
- **React StrictMode**: Enabled in development for warnings
- **TypeScript checking**: Runs in parallel with Vite

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

// NOT:
import { cn } from '../lib/utils'  // ❌ Avoid relative imports
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
- **Routes**: lowercase/kebab-case (e.g., `index.tsx`, `about.tsx`)

### Import Order Convention

```tsx
// 1. React imports
import { useState } from 'react'

// 2. Third-party libraries
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'

// 3. Internal utilities
import { cn } from '@/lib/utils'

// 4. Components
import Header from '@/components/Header'

// 5. Styles (if any)
import './styles.css'
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

export const Button = ({ variant, size, className, ...props }) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
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

Toggle dark mode by adding `.dark` class to `<html>`:

```tsx
// Example: Dark mode toggle
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark')
}
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
| `about.tsx` | `/about` | About page |
| `blog.index.tsx` | `/blog` | Blog index |
| `blog.$id.tsx` | `/blog/:id` | Dynamic blog post |
| `__root.tsx` | N/A | Root layout (persistent) |

#### Creating a New Route

**Step 1**: Create file in `src/routes/`

```bash
# Example: Create an about page
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
    <div>
      <h1>About Us</h1>
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
      <Link to="/about">About</Link>

      {/* Active link styling */}
      <Link
        to="/dashboard"
        activeProps={{ className: 'text-primary font-bold' }}
      >
        Dashboard
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

export const Route = createRootRoute({
  component: () => (
    <>
      <Header /> {/* Persistent header */}
      <Outlet /> {/* Route content renders here */}
      <TanStackRouterDevtools /> {/* Dev tools (dev only) */}
    </>
  )
})
```

### Dynamic Routes with Parameters

```tsx
// src/routes/blog.$postId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/$postId')({
  component: BlogPost
})

function BlogPost() {
  const { postId } = Route.useParams()

  return <h1>Blog Post ID: {postId}</h1>
}
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

### Current Setup: Local State Only

No centralized state management library is installed. Use React's built-in hooks:

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

### Recommended: TanStack Store (If Needed)

For complex client-side state:

```bash
# Install TanStack Store
pnpm add @tanstack/store @tanstack/react-store
```

**Example Usage**:

```tsx
import { useStore } from '@tanstack/react-store'
import { Store } from '@tanstack/store'

// Create store
const countStore = new Store(0)

// Use in component
export const Counter = () => {
  const count = useStore(countStore)

  return (
    <button onClick={() => countStore.setState((n) => n + 1)}>
      Count: {count}
    </button>
  )
}
```

**Derived State**:

```tsx
import { Derived } from '@tanstack/store'

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
})
doubledStore.mount()
```

### Context API for Shared State

For simple global state (theme, auth):

```tsx
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext<'light' | 'dark'>('light')

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

---

## Data Fetching

### Method 1: TanStack Router Loaders (Recommended)

Load data **before** route renders:

```tsx
// src/routes/users.tsx
import { createFileRoute } from '@tanstack/react-router'

type User = { id: number; name: string }

export const Route = createFileRoute('/users')({
  loader: async () => {
    const response = await fetch('https://api.example.com/users')
    return response.json() as Promise<{ results: User[] }>
  },
  component: UsersPage
})

function UsersPage() {
  const data = Route.useLoaderData()

  return (
    <ul>
      {data.results.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Method 2: TanStack Query (For Complex Data)

**Install**:
```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

**Setup in `main.tsx`**:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

root.render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)
```

**Usage**:

```tsx
import { useQuery } from '@tanstack/react-query'

export const UsersList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('https://api.example.com/users')
      return res.json()
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

### Method 3: Native Fetch in useEffect

For simple one-off fetches:

```tsx
import { useState, useEffect } from 'react'

export const UsersList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://api.example.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>

  return <ul>{/* render users */}</ul>
}
```

---

## Testing

### Test Framework: Vitest

**Configuration**: Tests run via Vitest with jsdom environment.

**Running Tests**:
```bash
pnpm test         # Run all tests
pnpm test --watch # Watch mode (not in package.json)
```

### Writing Component Tests

**Example Test** (create in `src/components/__tests__/Header.test.tsx`):

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '../Header'

describe('Header Component', () => {
  it('renders menu button', () => {
    render(<Header />)

    const menuButton = screen.getByRole('button', { name: /menu/i })
    expect(menuButton).toBeDefined()
  })

  it('shows logo text', () => {
    render(<Header />)

    expect(screen.getByText('My App')).toBeDefined()
  })
})
```

### Testing Library Queries

```tsx
// Preferred query order:
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email')
screen.getByPlaceholderText('Enter email')
screen.getByText('Welcome')
screen.getByTestId('custom-element')  // Last resort
```

### Test File Naming

- Component tests: `Component.test.tsx` or `Component.spec.tsx`
- Utility tests: `utils.test.ts`
- Place tests in `__tests__/` folder or alongside components

### Current Test Coverage

**Status**: ⚠️ No tests exist yet

**To Add Tests**:
1. Create test files following conventions above
2. Run `pnpm test` to execute
3. Add to CI/CD pipeline before production

---

## Common Tasks

### Task 1: Add a New Route

```bash
# 1. Create route file
touch src/routes/pricing.tsx

# 2. Add component
cat > src/routes/pricing.tsx << 'EOF'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pricing')({
  component: PricingPage
})

function PricingPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Pricing</h1>
      <p>Our pricing plans</p>
    </div>
  )
}
EOF

# 3. Add link in Header component
# (Edit src/components/Header.tsx manually)
```

### Task 2: Add a New Component

```bash
# 1. Create component file
touch src/components/Button.tsx

# 2. Define component
cat > src/components/Button.tsx << 'EOF'
import { cn } from '@/lib/utils'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  className?: string
}

export const Button = ({ children, onClick, variant = 'primary', className }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-colors",
        variant === 'primary' && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === 'secondary' && "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        className
      )}
    >
      {children}
    </button>
  )
}

export default Button
EOF
```

### Task 3: Add shadcn/ui Component

```bash
# Add button component
pnpx shadcn@latest add button

# Add card component
pnpx shadcn@latest add card

# Components are added to src/components/ui/
# Use in your code:
```

```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const MyPage = () => {
  return (
    <Card>
      <Button>Click Me</Button>
    </Card>
  )
}
```

### Task 4: Add Environment Variables

```bash
# 1. Create .env file (already gitignored)
cat > .env << 'EOF'
VITE_API_URL=https://api.example.com
VITE_APP_NAME=My App
EOF

# 2. Access in code
```

```tsx
const apiUrl = import.meta.env.VITE_API_URL
const appName = import.meta.env.VITE_APP_NAME
```

### Task 5: Add TanStack Query

```bash
# 1. Install dependencies
pnpm add @tanstack/react-query @tanstack/react-query-devtools

# 2. Update main.tsx (see Data Fetching section)

# 3. Use in components
```

```tsx
import { useQuery } from '@tanstack/react-query'

const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos
})
```

---

## Important Notes for AI Assistants

### Critical Rules

1. **DO NOT Edit Auto-Generated Files**
   - `src/routes/routeTree.gen.ts` is auto-generated by TanStack Router plugin
   - VS Code is configured to hide this file (`.vscode/settings.json`)
   - Never manually modify this file

2. **Use pnpm, Not npm/yarn**
   - Project uses `pnpm@10.19.0` (specified in package.json)
   - Commands: `pnpm install`, `pnpm add`, `pnpm dev`

3. **TypeScript Strict Mode**
   - All code must be type-safe
   - No `any` types unless absolutely necessary
   - Use proper type annotations

4. **Prefer Editing Over Creating**
   - ALWAYS prefer editing existing files
   - DO NOT create new files unless required
   - Exception: New routes in `src/routes/`

5. **Tailwind-First Styling**
   - Use Tailwind utility classes, not custom CSS
   - Use `cn()` utility for conditional classes
   - Leverage CSS variables for theming

6. **Component Patterns**
   - Functional components with hooks
   - Use `@/` alias for imports (not relative paths)
   - Export components as default or named

7. **Git Workflow**
   - Current branch: `claude/claude-md-mi3wt3hjre4d4hsq-01TogY8r8Z42SbobhnEcji7T`
   - Always push to this branch
   - Use descriptive commit messages

### Common Pitfalls to Avoid

❌ **DON'T**:
- Use `npm` or `yarn` instead of `pnpm`
- Edit `routeTree.gen.ts` manually
- Add emojis unless requested
- Create unnecessary documentation files
- Use relative imports (`../`) instead of `@/` alias
- Bypass TypeScript strict checks
- Write inline styles instead of Tailwind

✅ **DO**:
- Use `pnpm` for all package operations
- Let TanStack Router auto-generate route tree
- Use `@/` alias for all imports
- Follow TypeScript strict mode
- Use Tailwind utilities for styling
- Use `cn()` helper for class merging
- Add tests for new components (when applicable)

### File Modification Guidelines

**Always Read Before Writing**:
- Use `Read` tool before `Edit` or `Write`
- Understand existing code structure first
- Maintain consistent coding style

**When Adding Features**:
1. Check if similar functionality exists
2. Reuse existing components/utilities
3. Follow established patterns
4. Update this CLAUDE.md if patterns change

### Performance Considerations

- **Code Splitting**: Routes are automatically code-split
- **Bundle Size**: Use tree-shakeable imports
- **Lazy Loading**: Components can use `React.lazy()`
- **Web Vitals**: Monitor via `reportWebVitals()`

### Security Best Practices

- **Environment Variables**: Use `.env` for secrets (gitignored)
- **API Keys**: Never hardcode in source
- **Input Validation**: Validate user inputs
- **XSS Prevention**: React escapes by default, but be careful with `dangerouslySetInnerHTML`

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
git status                # Check status
git add .                 # Stage changes
git commit -m "message"   # Commit
git push -u origin claude/claude-md-mi3wt3hjre4d4hsq-01TogY8r8Z42SbobhnEcji7T
```

---

## Additional Resources

- **TanStack Router Docs**: https://tanstack.com/router/latest
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **shadcn/ui Components**: https://ui.shadcn.com/
- **Vitest Docs**: https://vitest.dev/
- **React 19 Docs**: https://react.dev/

---

**Last Updated**: 2025-11-18
**Maintained By**: AI Assistants (Claude Code)

---

## Changelog

### 2025-11-18
- Initial creation of CLAUDE.md
- Documented all core technologies and patterns
- Added comprehensive development guidelines
- Included common tasks and AI assistant rules
