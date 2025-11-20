/**
 * Schema Re-exports
 *
 * This file maintains backward compatibility with existing imports.
 * All schemas are now organized in src/schemas/ directory.
 *
 * New imports should use:
 *   import { ... } from '@/schemas'
 *   import { ... } from '@/schemas/api'
 *   import { ... } from '@/schemas/models'
 *
 * @deprecated Import from '@/schemas' instead
 */

// Re-export all schemas from the new location
export * from '@/schemas'
