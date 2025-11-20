/**
 * User API Schemas
 *
 * Request/Response schemas for User API endpoints.
 * Uses snake_case to match FastAPI backend conventions.
 */

import { z } from 'zod'

// =============================================================================
// Request Schemas
// =============================================================================

/**
 * User creation request (POST /api/users)
 */
export const UserCreateSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  full_name: z.string().min(1, 'Full name is required'),
  is_active: z.boolean().default(true),
})

// =============================================================================
// Response Schemas
// =============================================================================

/**
 * Single user response
 */
export const UserResponseSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  username: z.string(),
  full_name: z.string(),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
})

/**
 * Users list response with pagination
 */
export const UsersListResponseSchema = z.object({
  users: z.array(UserResponseSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
})

// =============================================================================
// Type Inference
// =============================================================================

export type UserCreate = z.infer<typeof UserCreateSchema>
export type UserResponse = z.infer<typeof UserResponseSchema>
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>

// Legacy alias for backward compatibility
export const UserSchema = UserResponseSchema
export type User = UserResponse
