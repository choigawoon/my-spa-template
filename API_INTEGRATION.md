# API Integration Guide

This document explains how the API integration is structured and how to switch between mock (MSW) and real backend.

## Architecture Overview

```
src/
├── api/
│   ├── client.ts          # API client (fetch wrapper)
│   ├── config.ts          # Environment-based configuration
│   └── services/          # API service modules
│       ├── index.ts       # Re-export all services
│       ├── items.ts       # Items API hooks
│       ├── users.ts       # Users API hooks
│       ├── auth.ts        # Auth API hooks
│       ├── search.ts      # Search API hooks
│       └── health.ts      # Health check hooks
├── mocks/
│   ├── handlers.ts        # MSW request handlers
│   ├── browser.ts         # MSW browser worker setup
│   └── schemas.ts         # Zod schemas for validation
└── lib/
    └── query-client.ts    # React Query configuration
```

## Environment Configuration

### `.env` File

Create a `.env` file in the project root:

```bash
# API Configuration
# Set to 'mock' to use MSW, or 'real' to use actual backend
VITE_API_MODE=mock

# Backend API URL (used when VITE_API_MODE=real)
VITE_API_BASE_URL=http://localhost:8000

# Feature Flags
VITE_ENABLE_DEVTOOLS=true
```

### Switching Between Mock and Real Backend

#### Using Mock (MSW)

```bash
# .env
VITE_API_MODE=mock
```

- All API requests go to MSW handlers
- No real backend needed
- Perfect for development and testing
- Data is stored in memory (resets on refresh)

#### Using Real Backend

```bash
# .env
VITE_API_MODE=real
VITE_API_BASE_URL=http://localhost:8000  # Your backend URL
```

- All API requests go to the real backend
- MSW is disabled
- Vite proxy forwards `/api/*` requests to backend
- Perfect for production or integration testing

## API Client Layer

### `src/api/client.ts`

Generic fetch wrapper that:
- Automatically adds base URL based on mode
- Handles request/response transformation
- Provides typed error handling
- Supports all HTTP methods (GET, POST, PUT, DELETE)

```typescript
import { apiClient } from '@/api/client'

// GET request
const data = await apiClient.get('/api/items')

// POST request
const newItem = await apiClient.post('/api/items', { name: 'Item' })

// PUT request
const updated = await apiClient.put('/api/items/1', { name: 'Updated' })

// DELETE request
await apiClient.delete('/api/items/1')
```

### `src/api/config.ts`

Configuration module that:
- Reads environment variables
- Provides API mode (mock/real)
- Constructs full API URLs
- Enables/disables DevTools

```typescript
import { API_CONFIG, getApiUrl, isMockMode } from '@/api/config'

console.log(API_CONFIG.mode)        // 'mock' or 'real'
console.log(getApiUrl('/api/items')) // Full URL
console.log(isMockMode())            // true/false
```

## API Service Modules

Each service module provides React Query hooks for a specific resource.

### Items Service (`src/api/services/items.ts`)

```typescript
import {
  useItems,
  useItem,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
} from '@/api/services'

function ItemsPage() {
  // Fetch items list
  const { data, isLoading, error } = useItems()

  // Fetch single item
  const { data: item } = useItem(itemId)

  // Create item
  const createMutation = useCreateItem()
  createMutation.mutate({ name: 'New Item', ... })

  // Update item
  const updateMutation = useUpdateItem()
  updateMutation.mutate({ id: 1, data: { name: 'Updated' } })

  // Delete item
  const deleteMutation = useDeleteItem()
  deleteMutation.mutate(itemId)
}
```

### Users Service (`src/api/services/users.ts`)

```typescript
import { useUsers, useUser, useCreateUser } from '@/api/services'

function UsersPage() {
  const { data, isLoading, error } = useUsers()
  const createUserMutation = useCreateUser()
}
```

### Auth Service (`src/api/services/auth.ts`)

```typescript
import {
  useLogin,
  logout,
  getCurrentUser,
  getAccessToken,
  isAuthenticated,
} from '@/api/services'

function LoginPage() {
  const loginMutation = useLogin()

  const handleLogin = () => {
    loginMutation.mutate(
      { username: 'admin', password: 'admin' },
      {
        onSuccess: (data) => {
          console.log('Token:', data.access_token)
          // Token is automatically stored in localStorage
        },
      }
    )
  }

  // Check if authenticated
  if (isAuthenticated()) {
    const user = getCurrentUser()
    const token = getAccessToken()
  }

  // Logout
  const handleLogout = () => {
    logout()
  }
}
```

### Search Service (`src/api/services/search.ts`)

```typescript
import { useSearch } from '@/api/services'

function SearchPage() {
  const [query, setQuery] = useState('')
  const { data, isLoading } = useSearch(query)

  // Search is automatically triggered when query changes
  // Set enabled: false to disable automatic search
}
```

### Health Check Service (`src/api/services/health.ts`)

```typescript
import { useHealthCheck } from '@/api/services'

function HealthCheck() {
  const { data, isLoading } = useHealthCheck()

  if (data) {
    console.log('Status:', data.status) // 'healthy' or 'unhealthy'
    console.log('Version:', data.version)
  }
}
```

## React Query Features

### Automatic Caching

Data is automatically cached and reused across components:

```typescript
// First call - fetches from API
const { data } = useItems()

// Second call in another component - uses cache
const { data } = useItems()
```

### Automatic Refetching

Mutations automatically invalidate related queries:

```typescript
const createMutation = useCreateItem()

createMutation.mutate(newItem, {
  onSuccess: () => {
    // useItems() queries are automatically refetched
  },
})
```

### Loading and Error States

```typescript
const { data, isLoading, error, isPending, isError, isSuccess } = useItems()

if (isLoading) return <div>Loading...</div>
if (isError) return <div>Error: {error.message}</div>
if (isSuccess) return <div>{data.items.map(...)}</div>
```

### DevTools

React Query DevTools are enabled in development:

```typescript
// In main.tsx
<ReactQueryDevtools initialIsOpen={false} />
```

Press the React Query DevTools button in the bottom-right to:
- View all queries and their state
- Inspect cached data
- Manually trigger refetches
- View query timings

## Vite Proxy Configuration

In `vite.config.ts`, the proxy is configured to forward `/api/*` requests:

```typescript
server: {
  proxy: {
    '/api': {
      target: process.env.VITE_API_BASE_URL || 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

This allows:
- No CORS issues during development
- Same URL structure in dev and production
- Easy switching between mock and real backend

## MSW (Mock Service Worker)

### How It Works

MSW intercepts fetch requests at the network level and returns mock responses.

### Configuration

MSW is only enabled when:
1. `NODE_ENV === 'development'`
2. `VITE_API_MODE === 'mock'`

### Adding New Endpoints

Edit `src/mocks/handlers.ts`:

```typescript
export const handlers = [
  http.get('/api/new-endpoint', () => {
    return HttpResponse.json({ data: 'mock data' })
  }),
]
```

### Schemas

#### 방법 1: 수동 정의 (기존 방식)

All request/response schemas are defined in `src/mocks/schemas.ts` using Zod:

```typescript
export const NewItemSchema = z.object({
  id: PositiveIntSchema,
  name: z.string(),
  // ...
})

export type NewItem = z.infer<typeof NewItemSchema>
```

#### 방법 2: Prisma에서 자동 생성 (권장)

**실제 DB 없이도 Prisma 스키마 → Zod 자동 생성 가능:**

1. **Prisma 스키마 작성:**
   ```prisma
   // prisma/schema.prisma
   model Item {
     id          Int      @id @default(autoincrement())
     name        String
     description String
     price       Float
     category    String
     created_at  DateTime @default(now())
     updated_at  DateTime @updatedAt
   }
   ```

2. **Zod 스키마 자동 생성:**
   ```bash
   pnpm prisma generate
   ```
   - `src/lib/prisma-zod/Item.ts`에 자동 생성됨

3. **MSW에서 사용:**
   ```typescript
   // src/mocks/handlers.ts
   import { ItemSchema } from '@/lib/prisma-zod/Item'
   import type { z } from 'zod'
   
   type Item = z.infer<typeof ItemSchema>
   
   let items: Item[] = [...]
   
   http.get('/api/items', () => {
     const validated = z.array(ItemSchema).parse(items)
     return HttpResponse.json({ items: validated })
   })
   ```

**장점:**
- ✅ Prisma 스키마가 단일 소스 (Single Source of Truth)
- ✅ 실제 DB 없이도 타입 안전한 개발
- ✅ 나중에 실제 DB 연결 시 프론트엔드 코드 변경 불필요
- ✅ Prisma 모델 변경 시 Zod 스키마 자동 동기화

**상세 가이드:** [`BACKEND_ROADMAP.md`](./BACKEND_ROADMAP.md) 참고

## Example: Creating a New API Service

Let's create a service for managing comments.

### 1. Define Schema (`src/mocks/schemas.ts`)

```typescript
export const CommentSchema = z.object({
  id: PositiveIntSchema,
  text: z.string(),
  author: z.string(),
  created_at: DateTimeSchema,
})

export const CommentCreateSchema = z.object({
  text: z.string().min(1),
  author: z.string().min(1),
})

export type Comment = z.infer<typeof CommentSchema>
export type CommentCreate = z.infer<typeof CommentCreateSchema>
```

### 2. Add MSW Handler (`src/mocks/handlers.ts`)

```typescript
let comments: Comment[] = [
  {
    id: 1,
    text: 'First comment',
    author: 'User 1',
    created_at: new Date().toISOString(),
  },
]

export const handlers = [
  // ... existing handlers

  http.get('/api/comments', () => {
    return HttpResponse.json({ comments, total: comments.length })
  }),

  http.post('/api/comments', async ({ request }) => {
    const body = await request.json()
    const result = CommentCreateSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const newComment: Comment = {
      id: comments.length + 1,
      ...result.data,
      created_at: new Date().toISOString(),
    }

    comments.push(newComment)
    return HttpResponse.json(newComment, { status: 201 })
  }),
]
```

### 3. Create Service Module (`src/api/services/comments.ts`)

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { Comment, CommentCreate } from '@/mocks/schemas'

export const commentsKeys = {
  all: ['comments'] as const,
  lists: () => [...commentsKeys.all, 'list'] as const,
}

export const useComments = () => {
  return useQuery({
    queryKey: commentsKeys.lists(),
    queryFn: () => apiClient.get<{ comments: Comment[] }>('/api/comments'),
  })
}

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CommentCreate) =>
      apiClient.post<Comment>('/api/comments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.lists() })
    },
  })
}
```

### 4. Export in Index (`src/api/services/index.ts`)

```typescript
export * from './comments'
```

### 5. Use in Component

```typescript
import { useComments, useCreateComment } from '@/api/services'

function CommentsPage() {
  const { data, isLoading } = useComments()
  const createMutation = useCreateComment()

  const handleSubmit = (text: string, author: string) => {
    createMutation.mutate({ text, author })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {data?.comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.text}</p>
          <small>by {comment.author}</small>
        </div>
      ))}
    </div>
  )
}
```

## Testing the Setup

### 1. Start Development Server

```bash
pnpm dev
```

### 2. Visit Test Page

Navigate to `/msw-test` to see the interactive test page with:
- Health check
- Items CRUD operations
- Users list
- Login/authentication
- Search functionality

### 3. Open DevTools

- React Query DevTools: Bottom-right button
- Browser DevTools: Network tab to see intercepted requests

### 4. Switch to Real Backend

```bash
# Stop the dev server
# Update .env
VITE_API_MODE=real
VITE_API_BASE_URL=http://localhost:8000

# Start your backend server on port 8000
# Start the dev server again
pnpm dev
```

All API calls will now go to your real backend!

## Best Practices

### 1. Query Keys

Use factory functions for consistent query keys:

```typescript
export const itemsKeys = {
  all: ['items'] as const,
  lists: () => [...itemsKeys.all, 'list'] as const,
  list: (params) => [...itemsKeys.lists(), params] as const,
  details: () => [...itemsKeys.all, 'detail'] as const,
  detail: (id) => [...itemsKeys.details(), id] as const,
}
```

### 2. Error Handling

Use try-catch in mutations:

```typescript
const createMutation = useCreateItem()

createMutation.mutate(newItem, {
  onSuccess: (data) => {
    console.log('Success:', data)
  },
  onError: (error) => {
    console.error('Error:', error.message)
  },
})
```

### 3. Optimistic Updates

For better UX, update UI before server response:

```typescript
const deleteMutation = useDeleteItem()

deleteMutation.mutate(itemId, {
  onMutate: async (itemId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: itemsKeys.lists() })

    // Snapshot previous value
    const previousItems = queryClient.getQueryData(itemsKeys.lists())

    // Optimistically update
    queryClient.setQueryData(itemsKeys.lists(), (old) => ({
      ...old,
      items: old.items.filter((item) => item.id !== itemId),
    }))

    return { previousItems }
  },
  onError: (err, itemId, context) => {
    // Rollback on error
    queryClient.setQueryData(itemsKeys.lists(), context.previousItems)
  },
})
```

### 4. Type Safety

Always use TypeScript types from schemas:

```typescript
import type { Item, ItemCreate, ItemUpdate } from '@/mocks/schemas'

const createItem = (data: ItemCreate): Promise<Item> => {
  return apiClient.post('/api/items', data)
}
```

## Troubleshooting

### MSW Not Working

1. Check that `mockServiceWorker.js` exists in `public/`
2. Run `pnpm dlx msw init public --save` if missing
3. Verify `VITE_API_MODE=mock` in `.env`
4. Check browser console for MSW startup message

### CORS Errors with Real Backend

1. Ensure Vite proxy is configured correctly
2. Check `VITE_API_BASE_URL` points to correct backend
3. Verify backend has CORS enabled (if not using proxy)

### React Query Not Updating

1. Check that mutations are calling `invalidateQueries`
2. Verify query keys match between queries and mutations
3. Open React Query DevTools to inspect query state

### Type Errors

1. Ensure schemas are up to date in `src/mocks/schemas.ts`
2. Re-export types in service modules
3. Run `pnpm build` to check for TypeScript errors

## Production Deployment

### Frontend Only

If deploying frontend without backend:

```bash
# Build with mock mode
VITE_API_MODE=mock pnpm build
```

### With Backend

If deploying with real backend:

```bash
# Build with real mode
VITE_API_MODE=real VITE_API_BASE_URL=https://api.example.com pnpm build
```

### Environment Variables in CI/CD

Add to your CI/CD pipeline:

```yaml
env:
  VITE_API_MODE: real
  VITE_API_BASE_URL: ${{ secrets.API_URL }}
  VITE_ENABLE_DEVTOOLS: false
```

## Summary

This architecture provides:

✅ **Easy Backend Switching**: Change one environment variable
✅ **Type Safety**: Full TypeScript support with Zod schemas
✅ **Automatic Caching**: React Query handles caching automatically
✅ **Optimistic Updates**: UI updates before server response
✅ **DevTools**: Debug queries in real-time
✅ **Production Ready**: Easy to deploy with real backend

For more information:
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [MSW Docs](https://mswjs.io/)
- [Zod Docs](https://zod.dev/)
