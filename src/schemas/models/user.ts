/**
 * User Model Schema
 *
 * This schema mirrors the Prisma User model defined in prisma/schema.prisma
 * When prisma-zod-generator is available, this file can be auto-generated
 */

import { z } from 'zod'

// =============================================================================
// Base Schema (shared fields)
// =============================================================================

export const UserBaseSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  fullName: z.string().min(1, 'Full name is required'),
})

// =============================================================================
// Full Model Schema (DB entity)
// =============================================================================

export const UserSchema = UserBaseSchema.extend({
  id: z.number().int().positive(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
})

// =============================================================================
// Type Inference
// =============================================================================

export type UserBase = z.infer<typeof UserBaseSchema>
export type User = z.infer<typeof UserSchema>
