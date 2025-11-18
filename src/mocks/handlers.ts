import { http, HttpResponse } from 'msw'
import { ZodError } from 'zod'
import {
  ItemSchema,
  ItemCreateSchema,
  ItemUpdateSchema,
  ItemsListResponseSchema,
  UserSchema,
  UserCreateSchema,
  UsersListResponseSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  HealthCheckSchema,
  SearchResponseSchema,
  HTTPErrorSchema,
  type Item,
  type User,
  type ItemCreate,
  type ItemUpdate,
  type UserCreate,
  type LoginRequest,
  type HealthCheck,
  type HTTPValidationError,
} from './schemas'

// Re-export types for convenience
export type { Item, User } from './schemas'

// Mock data storage
let items: Item[] = [
  {
    id: 1,
    name: '노트북',
    description: '고성능 노트북',
    price: 1500000,
    category: '전자제품',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: '마우스',
    description: '무선 마우스',
    price: 30000,
    category: '전자제품',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    name: '키보드',
    description: '기계식 키보드',
    price: 150000,
    category: '전자제품',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
]

let users: User[] = [
  {
    id: 1,
    email: 'user1@example.com',
    username: 'user1',
    full_name: '홍길동',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    email: 'user2@example.com',
    username: 'user2',
    full_name: '김철수',
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
  },
]

// Helper to generate IDs
let nextItemId = items.length + 1
let nextUserId = users.length + 1

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format Zod validation error to FastAPI-style validation error
 */
function formatValidationError(error: ZodError): HTTPValidationError {
  return {
    detail: error.errors.map((err) => ({
      loc: ['body', ...err.path.map(String)],
      msg: err.message,
      type: err.code,
    })),
  }
}

/**
 * Create validation error response (422 Unprocessable Entity)
 */
function validationErrorResponse(error: ZodError) {
  return HttpResponse.json(formatValidationError(error), { status: 422 })
}

/**
 * Create HTTP error response
 */
function httpErrorResponse(detail: string, status: number) {
  return HttpResponse.json({ detail }, { status })
}

// MSW Request Handlers (FastAPI-style)
export const handlers = [
  // Health Check
  http.get('/api/health', () => {
    const response: HealthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    }
    // Validate response with Zod
    const validated = HealthCheckSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Items - List all items
  http.get('/api/items', ({ request }) => {
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '100')
    const category = url.searchParams.get('category')

    let filteredItems = items
    if (category) {
      filteredItems = items.filter((item) => item.category === category)
    }

    const paginatedItems = filteredItems.slice(skip, skip + limit)

    const response = {
      items: paginatedItems,
      total: filteredItems.length,
      skip,
      limit,
    }

    // Validate response with Zod
    const validated = ItemsListResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Items - Get single item
  http.get('/api/items/:id', ({ params }) => {
    const { id } = params
    const item = items.find((item) => item.id === Number(id))

    if (!item) {
      return httpErrorResponse('Item not found', 404)
    }

    // Validate response with Zod
    const validated = ItemSchema.parse(item)
    return HttpResponse.json(validated)
  }),

  // Items - Create new item
  http.post('/api/items', async ({ request }) => {
    const body = await request.json()

    // Validate request body with Zod (FastAPI-style)
    const result = ItemCreateSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data

    const newItem: Item = {
      id: nextItemId++,
      ...validatedData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    items.push(newItem)

    // Validate response with Zod
    const validated = ItemSchema.parse(newItem)
    return HttpResponse.json(validated, { status: 201 })
  }),

  // Items - Update item
  http.put('/api/items/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json()

    // Validate request body with Zod
    const result = ItemUpdateSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data
    const itemIndex = items.findIndex((item) => item.id === Number(id))

    if (itemIndex === -1) {
      return httpErrorResponse('Item not found', 404)
    }

    items[itemIndex] = {
      ...items[itemIndex],
      ...validatedData,
      id: items[itemIndex].id, // ID는 변경 불가
      created_at: items[itemIndex].created_at, // 생성일 유지
      updated_at: new Date().toISOString(),
    }

    // Validate response with Zod
    const validated = ItemSchema.parse(items[itemIndex])
    return HttpResponse.json(validated)
  }),

  // Items - Delete item
  http.delete('/api/items/:id', ({ params }) => {
    const { id } = params
    const itemIndex = items.findIndex((item) => item.id === Number(id))

    if (itemIndex === -1) {
      return httpErrorResponse('Item not found', 404)
    }

    items.splice(itemIndex, 1)

    return HttpResponse.json({ message: 'Item deleted successfully' })
  }),

  // Users - List all users
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '100')

    const paginatedUsers = users.slice(skip, skip + limit)

    const response = {
      users: paginatedUsers,
      total: users.length,
      skip,
      limit,
    }

    // Validate response with Zod
    const validated = UsersListResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Users - Get single user
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params
    const user = users.find((user) => user.id === Number(id))

    if (!user) {
      return httpErrorResponse('User not found', 404)
    }

    // Validate response with Zod
    const validated = UserSchema.parse(user)
    return HttpResponse.json(validated)
  }),

  // Users - Create new user
  http.post('/api/users', async ({ request }) => {
    const body = await request.json()

    // Validate request body with Zod
    const result = UserCreateSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data

    const newUser: User = {
      id: nextUserId++,
      ...validatedData,
      created_at: new Date().toISOString(),
    }

    users.push(newUser)

    // Validate response with Zod
    const validated = UserSchema.parse(newUser)
    return HttpResponse.json(validated, { status: 201 })
  }),

  // Auth - Login (FastAPI-style)
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json()

    // Validate request body with Zod
    const result = LoginRequestSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data

    // Mock authentication logic
    if (
      validatedData.username === 'admin' &&
      validatedData.password === 'admin'
    ) {
      const response = {
        access_token: 'mock-jwt-token-12345',
        token_type: 'bearer' as const,
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          full_name: '관리자',
        },
      }

      // Validate response with Zod
      const validated = LoginResponseSchema.parse(response)
      return HttpResponse.json(validated)
    }

    return httpErrorResponse('Incorrect username or password', 401)
  }),

  // Search endpoint (FastAPI-style)
  http.get('/api/search', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q') || ''

    const results = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    )

    const response = {
      query,
      results,
      total: results.length,
    }

    // Validate response with Zod
    const validated = SearchResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),
]
