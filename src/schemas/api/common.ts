/**
 * Common API Schemas
 *
 * Shared schemas for errors, pagination, health check, and search.
 */

import { z } from 'zod'
import { ItemResponseSchema } from './item'

// =============================================================================
// Base Schemas
// =============================================================================

/**
 * ISO 8601 datetime string
 */
export const DateTimeSchema = z.string().datetime()

/**
 * Positive integer (for IDs)
 */
export const PositiveIntSchema = z.number().int().positive()

// =============================================================================
// Error Schemas
// =============================================================================

/**
 * HTTP error detail
 */
export const HTTPErrorSchema = z.object({
  detail: z.string(),
})

/**
 * Validation error detail (single field)
 */
export const ValidationErrorSchema = z.object({
  loc: z.array(z.union([z.string(), z.number()])),
  msg: z.string(),
  type: z.string(),
})

/**
 * HTTP validation error (422 Unprocessable Entity)
 */
export const HTTPValidationErrorSchema = z.object({
  detail: z.array(ValidationErrorSchema),
})

// =============================================================================
// Query Parameter Schemas
// =============================================================================

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

// =============================================================================
// Health Check Schema
// =============================================================================

/**
 * Health check response
 */
export const HealthCheckSchema = z.object({
  status: z.enum(['healthy', 'unhealthy']),
  timestamp: DateTimeSchema,
  version: z.string(),
})

// =============================================================================
// Search Schema
// =============================================================================

/**
 * Search response
 */
export const SearchResponseSchema = z.object({
  query: z.string(),
  results: z.array(ItemResponseSchema),
  total: z.number().int().nonnegative(),
})

// =============================================================================
// Type Inference
// =============================================================================

export type HTTPError = z.infer<typeof HTTPErrorSchema>
export type ValidationError = z.infer<typeof ValidationErrorSchema>
export type HTTPValidationError = z.infer<typeof HTTPValidationErrorSchema>

export type PaginationParams = z.infer<typeof PaginationParamsSchema>
export type ItemsFilterParams = z.infer<typeof ItemsFilterParamsSchema>
export type SearchParams = z.infer<typeof SearchParamsSchema>

export type HealthCheck = z.infer<typeof HealthCheckSchema>
export type SearchResponse = z.infer<typeof SearchResponseSchema>
