/**
 * Schema Index
 *
 * Main entry point for all schemas.
 * Re-exports API schemas for use in application code.
 *
 * Structure:
 * - src/schemas/models/ - DB model schemas (mirrors Prisma)
 * - src/schemas/api/    - API request/response schemas
 *
 * Import examples:
 *   import { ItemSchema, UserSchema } from '@/schemas'
 *   import { ItemCreateSchema, LoginRequestSchema } from '@/schemas/api'
 *   import { Item as ItemModel } from '@/schemas/models'
 */

// Re-export all API schemas (primary use case)
export * from './api'

// Backward compatibility aliases
// These match the original src/mocks/schemas.ts exports

import { ItemCreateSchema } from './api/item'

// ItemBaseSchema was used in original schemas.ts
export const ItemBaseSchema = ItemCreateSchema
export type ItemBase = import('./api/item').ItemCreate

// UserBaseSchema needs full_name in snake_case for API compatibility
import { z } from 'zod'
export const UserBaseSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  full_name: z.string().min(1, 'Full name is required'),
})
export type UserBase = z.infer<typeof UserBaseSchema>
