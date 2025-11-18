import { z } from 'zod'

// ============================================================================
// Base Schemas
// ============================================================================

/**
 * ISO 8601 datetime string schema
 */
export const DateTimeSchema = z.string().datetime()

/**
 * Positive integer schema (for IDs)
 */
export const PositiveIntSchema = z.number().int().positive()

// ============================================================================
// Item Schemas (FastAPI-style)
// ============================================================================

/**
 * Base Item schema (shared fields)
 */
export const ItemBaseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
})

/**
 * Item creation schema (request body for POST /api/items)
 */
export const ItemCreateSchema = ItemBaseSchema

/**
 * Item update schema (request body for PUT /api/items/:id)
 */
export const ItemUpdateSchema = ItemBaseSchema.partial()

/**
 * Item response schema (includes timestamps and ID)
 */
export const ItemSchema = ItemBaseSchema.extend({
  id: PositiveIntSchema,
  created_at: DateTimeSchema,
  updated_at: DateTimeSchema,
})

/**
 * Items list response schema (with pagination)
 */
export const ItemsListResponseSchema = z.object({
  items: z.array(ItemSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
})

// ============================================================================
// User Schemas (FastAPI-style)
// ============================================================================

/**
 * Base User schema
 */
export const UserBaseSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  full_name: z.string().min(1, 'Full name is required'),
})

/**
 * User creation schema (request body for POST /api/users)
 */
export const UserCreateSchema = UserBaseSchema.extend({
  is_active: z.boolean().default(true),
})

/**
 * User response schema
 */
export const UserSchema = UserBaseSchema.extend({
  id: PositiveIntSchema,
  is_active: z.boolean(),
  created_at: DateTimeSchema,
})

/**
 * Users list response schema
 */
export const UsersListResponseSchema = z.object({
  users: z.array(UserSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
})

// ============================================================================
// Auth Schemas (FastAPI-style)
// ============================================================================

/**
 * Login request schema
 */
export const LoginRequestSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

/**
 * User info in login response
 */
export const UserInfoSchema = z.object({
  id: PositiveIntSchema,
  username: z.string(),
  email: z.string().email(),
  full_name: z.string(),
})

/**
 * Login response schema (JWT token)
 */
export const LoginResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal('bearer'),
  user: UserInfoSchema,
})

// ============================================================================
// Health Check Schema
// ============================================================================

/**
 * Health check response schema
 */
export const HealthCheckSchema = z.object({
  status: z.enum(['healthy', 'unhealthy']),
  timestamp: DateTimeSchema,
  version: z.string(),
})

// ============================================================================
// Search Schema
// ============================================================================

/**
 * Search response schema
 */
export const SearchResponseSchema = z.object({
  query: z.string(),
  results: z.array(ItemSchema),
  total: z.number().int().nonnegative(),
})

// ============================================================================
// Error Schemas (FastAPI-style)
// ============================================================================

/**
 * HTTP error detail schema
 */
export const HTTPErrorSchema = z.object({
  detail: z.string(),
})

/**
 * Validation error detail schema
 */
export const ValidationErrorSchema = z.object({
  loc: z.array(z.union([z.string(), z.number()])),
  msg: z.string(),
  type: z.string(),
})

/**
 * HTTP validation error schema (422 Unprocessable Entity)
 */
export const HTTPValidationErrorSchema = z.object({
  detail: z.array(ValidationErrorSchema),
})

// ============================================================================
// Query Parameters Schemas
// ============================================================================

/**
 * Pagination query parameters
 */
export const PaginationParamsSchema = z.object({
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().positive().max(100).default(100),
})

/**
 * Items filter query parameters
 */
export const ItemsFilterParamsSchema = PaginationParamsSchema.extend({
  category: z.string().optional(),
})

/**
 * Search query parameters
 */
export const SearchParamsSchema = z.object({
  q: z.string().min(1, 'Query is required'),
})

// ============================================================================
// Type Inference (TypeScript types from Zod schemas)
// ============================================================================

// Item types
export type ItemBase = z.infer<typeof ItemBaseSchema>
export type ItemCreate = z.infer<typeof ItemCreateSchema>
export type ItemUpdate = z.infer<typeof ItemUpdateSchema>
export type Item = z.infer<typeof ItemSchema>
export type ItemsListResponse = z.infer<typeof ItemsListResponseSchema>

// User types
export type UserBase = z.infer<typeof UserBaseSchema>
export type UserCreate = z.infer<typeof UserCreateSchema>
export type User = z.infer<typeof UserSchema>
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>

// Auth types
export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type UserInfo = z.infer<typeof UserInfoSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>

// Health check type
export type HealthCheck = z.infer<typeof HealthCheckSchema>

// Search type
export type SearchResponse = z.infer<typeof SearchResponseSchema>

// Error types
export type HTTPError = z.infer<typeof HTTPErrorSchema>
export type ValidationError = z.infer<typeof ValidationErrorSchema>
export type HTTPValidationError = z.infer<typeof HTTPValidationErrorSchema>

// Query params types
export type PaginationParams = z.infer<typeof PaginationParamsSchema>
export type ItemsFilterParams = z.infer<typeof ItemsFilterParamsSchema>
export type SearchParams = z.infer<typeof SearchParamsSchema>
