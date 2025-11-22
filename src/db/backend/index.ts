/**
 * Backend Mock Database (Browser IndexedDB)
 *
 * This database mocks backend API data during development.
 * It is ONLY used when VITE_API_MODE=mock.
 *
 * In production (VITE_API_MODE=real):
 * - This database is NOT used
 * - Data comes from actual backend API (PostgreSQL/MySQL/etc)
 *
 * Data stored here:
 * - items, users - will be replaced by real backend data
 *
 * Used by:
 * - MSW handlers for API mocking
 */

import Dexie, { type EntityTable } from 'dexie'
import type { ItemEntity, UserEntity } from './entities'
import { initialItems, initialUsers } from './seed'

// Re-export entity types for convenience
export type { ItemEntity, UserEntity } from './entities'

// =============================================================================
// Backend Mock Database Class
// =============================================================================

/**
 * Dexie database class for backend mock data
 * Database name: 'BackendMockDB'
 *
 * This data will be replaced by real backend when VITE_API_MODE=real
 */
export class BackendMockDatabase extends Dexie {
  items!: EntityTable<ItemEntity, 'id'>
  users!: EntityTable<UserEntity, 'id'>

  constructor() {
    super('BackendMockDB')

    this.version(1).stores({
      items: '++id, name, category, created_at',
      users: '++id, email, username, created_at',
    })
  }
}

// =============================================================================
// Database Instance
// =============================================================================

/**
 * Singleton instance of the backend mock database
 * Only used by MSW handlers in mock mode
 */
export const backendDb = new BackendMockDatabase()

// Legacy alias for backwards compatibility
export const db = backendDb

// =============================================================================
// Database Lifecycle Functions
// =============================================================================

/**
 * Initialize the backend mock database with seed data if empty
 * Called when MSW starts in mock mode
 */
export async function initializeBackendDb(): Promise<void> {
  try {
    // Check if items table is empty
    const itemCount = await backendDb.items.count()
    if (itemCount === 0) {
      await backendDb.items.bulkAdd(initialItems)
      console.log('[BackendDB] Seeded items table with initial data')
    }

    // Check if users table is empty
    const userCount = await backendDb.users.count()
    if (userCount === 0) {
      await backendDb.users.bulkAdd(initialUsers)
      console.log('[BackendDB] Seeded users table with initial data')
    }

    console.log('[BackendDB] Backend mock database initialized successfully')
  } catch (error) {
    console.error('[BackendDB] Failed to initialize backend mock database:', error)
    throw error
  }
}

/**
 * Clear all data from the backend mock database
 */
export async function clearBackendDb(): Promise<void> {
  await backendDb.items.clear()
  await backendDb.users.clear()
  console.log('[BackendDB] Database cleared')
}

/**
 * Reset backend mock database to initial seed state
 */
export async function resetBackendDb(): Promise<void> {
  await clearBackendDb()
  await initializeBackendDb()
  console.log('[BackendDB] Database reset to initial state')
}

// Legacy aliases for backwards compatibility
export const initializeDatabase = initializeBackendDb
export const clearDatabase = clearBackendDb
export const resetDatabase = resetBackendDb
