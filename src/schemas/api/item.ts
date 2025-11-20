/**
 * Item API Schemas
 *
 * Request/Response schemas for Item API endpoints.
 * Uses snake_case to match FastAPI backend conventions.
 */

import { z } from 'zod'

// =============================================================================
// Request Schemas
// =============================================================================

/**
 * Item creation request (POST /api/items)
 */
export const ItemCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
})

/**
 * Item update request (PUT /api/items/:id)
 */
export const ItemUpdateSchema = ItemCreateSchema.partial()

// =============================================================================
// Response Schemas
// =============================================================================

/**
 * Single item response
 */
export const ItemResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

/**
 * Items list response with pagination
 */
export const ItemsListResponseSchema = z.object({
  items: z.array(ItemResponseSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
})

// =============================================================================
// Type Inference
// =============================================================================

export type ItemCreate = z.infer<typeof ItemCreateSchema>
export type ItemUpdate = z.infer<typeof ItemUpdateSchema>
export type ItemResponse = z.infer<typeof ItemResponseSchema>
export type ItemsListResponse = z.infer<typeof ItemsListResponseSchema>

// Legacy alias for backward compatibility
export const ItemSchema = ItemResponseSchema
export type Item = ItemResponse
