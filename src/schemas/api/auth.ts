/**
 * Auth API Schemas
 *
 * Request/Response schemas for authentication endpoints.
 */

import { z } from 'zod'

// =============================================================================
// Request Schemas
// =============================================================================

/**
 * Login request (POST /api/auth/login)
 */
export const LoginRequestSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

// =============================================================================
// Response Schemas
// =============================================================================

/**
 * User info in login response
 */
export const UserInfoSchema = z.object({
  id: z.number().int().positive(),
  username: z.string(),
  email: z.string().email(),
  full_name: z.string(),
})

/**
 * Login response with JWT token
 */
export const LoginResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal('bearer'),
  user: UserInfoSchema,
})

// =============================================================================
// Type Inference
// =============================================================================

export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type UserInfo = z.infer<typeof UserInfoSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
