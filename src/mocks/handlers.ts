import { http, HttpResponse } from 'msw'
import { type ZodError } from 'zod'
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
  type Item,
  type User,
  type HealthCheck,
  type HTTPValidationError,
} from '@/schemas'
import { db } from '@/db'

// Re-export types for convenience
export type { Item, User } from '@/schemas'

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format Zod validation error to FastAPI-style validation error
 */
function formatValidationError(error: ZodError): HTTPValidationError {
  return {
    detail: error.issues.map((err) => ({
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

// MSW Request Handlers (FastAPI-style with IndexedDB)
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
  http.get('/api/items', async ({ request }) => {
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '100')
    const category = url.searchParams.get('category')

    let items = await db.items.toArray()

    if (category) {
      items = items.filter((item) => item.category === category)
    }

    const total = items.length
    const paginatedItems = items.slice(skip, skip + limit)

    // Map to response format with required id
    const responseItems: Item[] = paginatedItems.map((item) => ({
      id: item.id!,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }))

    const response = {
      items: responseItems,
      total,
      skip,
      limit,
    }

    // Validate response with Zod
    const validated = ItemsListResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Items - Get single item
  http.get('/api/items/:id', async ({ params }) => {
    const { id } = params
    const item = await db.items.get(Number(id))

    if (!item) {
      return httpErrorResponse('Item not found', 404)
    }

    const responseItem: Item = {
      id: item.id!,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }

    // Validate response with Zod
    const validated = ItemSchema.parse(responseItem)
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
    const now = new Date().toISOString()

    // Add to IndexedDB
    const id = (await db.items.add({
      ...validatedData,
      created_at: now,
      updated_at: now,
    })) as number

    const newItem: Item = {
      id,
      ...validatedData,
      created_at: now,
      updated_at: now,
    }

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
    const itemId = Number(id)
    const existingItem = await db.items.get(itemId)

    if (!existingItem) {
      return httpErrorResponse('Item not found', 404)
    }

    const updatedItem = {
      ...existingItem,
      ...validatedData,
      updated_at: new Date().toISOString(),
    }

    // Update in IndexedDB
    await db.items.put(updatedItem)

    const responseItem: Item = {
      id: updatedItem.id!,
      name: updatedItem.name,
      description: updatedItem.description,
      price: updatedItem.price,
      category: updatedItem.category,
      created_at: updatedItem.created_at,
      updated_at: updatedItem.updated_at,
    }

    // Validate response with Zod
    const validated = ItemSchema.parse(responseItem)
    return HttpResponse.json(validated)
  }),

  // Items - Delete item
  http.delete('/api/items/:id', async ({ params }) => {
    const { id } = params
    const itemId = Number(id)
    const existingItem = await db.items.get(itemId)

    if (!existingItem) {
      return httpErrorResponse('Item not found', 404)
    }

    await db.items.delete(itemId)

    return HttpResponse.json({ message: 'Item deleted successfully' })
  }),

  // Users - List all users
  http.get('/api/users', async ({ request }) => {
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '100')

    const users = await db.users.toArray()
    const total = users.length
    const paginatedUsers = users.slice(skip, skip + limit)

    // Map to response format
    const responseUsers: User[] = paginatedUsers.map((user) => ({
      id: user.id!,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      is_active: user.is_active,
      created_at: user.created_at,
    }))

    const response = {
      users: responseUsers,
      total,
      skip,
      limit,
    }

    // Validate response with Zod
    const validated = UsersListResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Users - Get single user
  http.get('/api/users/:id', async ({ params }) => {
    const { id } = params
    const user = await db.users.get(Number(id))

    if (!user) {
      return httpErrorResponse('User not found', 404)
    }

    const responseUser: User = {
      id: user.id!,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      is_active: user.is_active,
      created_at: user.created_at,
    }

    // Validate response with Zod
    const validated = UserSchema.parse(responseUser)
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
    const now = new Date().toISOString()

    // Add to IndexedDB
    const id = (await db.users.add({
      email: validatedData.email,
      username: validatedData.username,
      full_name: validatedData.full_name,
      is_active: validatedData.is_active,
      created_at: now,
    })) as number

    const newUser: User = {
      id,
      email: validatedData.email,
      username: validatedData.username,
      full_name: validatedData.full_name,
      is_active: validatedData.is_active,
      created_at: now,
    }

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
  http.get('/api/search', async ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q') || ''

    const items = await db.items.toArray()
    const results = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    )

    // Map to response format
    const responseResults: Item[] = results.map((item) => ({
      id: item.id!,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }))

    const response = {
      query,
      results: responseResults,
      total: responseResults.length,
    }

    // Validate response with Zod
    const validated = SearchResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),
]
