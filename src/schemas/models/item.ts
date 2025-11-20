/**
 * Item Model Schema
 *
 * This schema mirrors the Prisma Item model defined in prisma/schema.prisma
 * When prisma-zod-generator is available, this file can be auto-generated
 */

import { z } from 'zod'

// =============================================================================
// Base Schema (shared fields)
// =============================================================================

export const ItemBaseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
})

// =============================================================================
// Full Model Schema (DB entity)
// =============================================================================

export const ItemSchema = ItemBaseSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// =============================================================================
// Type Inference
// =============================================================================

export type ItemBase = z.infer<typeof ItemBaseSchema>
export type Item = z.infer<typeof ItemSchema>
