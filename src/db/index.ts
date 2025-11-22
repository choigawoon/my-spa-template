/**
 * Database Layer Entry Point
 *
 * This module provides a unified entry point for database operations,
 * abstracting the difference between mock (browser) and real (backend) databases.
 *
 * ## Storage Architecture
 *
 * ### Mock Mode (VITE_API_MODE=mock)
 * - Uses IndexedDB via Dexie.js in the browser
 * - Data persists across page reloads
 * - MSW handlers use this for realistic mock API behavior
 * - Location: src/db/mock/
 *
 * ### Real Mode (VITE_API_MODE=real)
 * - Connects to actual backend API
 * - Backend manages its own database (PostgreSQL, MySQL, etc.)
 * - This module's exports are NOT used in real mode
 * - Data schemas in src/schemas/ define the API contract
 *
 * ## Usage
 *
 * ```typescript
 * // Import database utilities (only used in mock mode)
 * import { db, initializeDatabase, resetDatabase } from '@/db'
 *
 * // Query mock database
 * const items = await db.items.toArray()
 *
 * // Reset to seed data
 * await resetDatabase()
 * ```
 *
 * ## Important Notes
 *
 * - These exports are ONLY used by MSW handlers in mock mode
 * - When using real backend, API services fetch from actual endpoints
 * - The src/schemas/ folder defines shared types for both modes
 */

// =============================================================================
// Re-export from Mock Database
// =============================================================================

// Database instance and lifecycle functions
export {
  db,
  MockAppDatabase,
  initializeDatabase,
  clearDatabase,
  resetDatabase,
} from './mock'

// Entity types
export type { ItemEntity, UserEntity } from './mock'

// For backwards compatibility, also export the class as AppDatabase
export { MockAppDatabase as AppDatabase } from './mock'
