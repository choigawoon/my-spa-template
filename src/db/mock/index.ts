/**
 * Mock Database (Browser IndexedDB)
 *
 * This module provides a browser-side mock database using Dexie.js (IndexedDB wrapper).
 * It is ONLY used when VITE_API_MODE=mock for frontend development and testing.
 *
 * Purpose:
 * - Enable full-stack mock development without a backend server
 * - Persist mock data across page reloads (unlike in-memory mocks)
 * - Test CRUD operations with realistic database behavior
 *
 * When to use:
 * - Local development with MSW (Mock Service Worker)
 * - Frontend testing without backend dependencies
 * - Prototyping new features before backend implementation
 *
 * When NOT used:
 * - Production environment (VITE_API_MODE=real)
 * - When connecting to actual backend API
 *
 * Architecture:
 * - Browser App → MSW handlers → Mock DB (IndexedDB)
 * - Browser App → Real API → Backend DB (PostgreSQL/etc)
 */

import Dexie, { type EntityTable } from 'dexie'
import type { ItemEntity, UserEntity } from './entities'
import { initialItems, initialUsers } from './seed'

// Re-export entity types for convenience
export type { ItemEntity, UserEntity } from './entities'

// =============================================================================
// Database Class
// =============================================================================

/**
 * Dexie database class for the mock database
 * Database name: 'MockAppDB' (prefixed with 'Mock' to clarify its purpose)
 */
export class MockAppDatabase extends Dexie {
  items!: EntityTable<ItemEntity, 'id'>
  users!: EntityTable<UserEntity, 'id'>

  constructor() {
    // Database name clearly indicates it's for mock/development use
    super('MockAppDB')

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
 * Singleton instance of the mock database
 * Only instantiated when imported (typically in mock mode only)
 */
export const db = new MockAppDatabase()

// =============================================================================
// Database Lifecycle Functions
// =============================================================================

/**
 * Initialize the mock database with seed data if empty
 * Called when MSW starts in mock mode
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Check if items table is empty
    const itemCount = await db.items.count()
    if (itemCount === 0) {
      await db.items.bulkAdd(initialItems)
      console.log('[MockDB] Seeded items table with initial data')
    }

    // Check if users table is empty
    const userCount = await db.users.count()
    if (userCount === 0) {
      await db.users.bulkAdd(initialUsers)
      console.log('[MockDB] Seeded users table with initial data')
    }

    console.log('[MockDB] Mock database initialized successfully')
  } catch (error) {
    console.error('[MockDB] Failed to initialize mock database:', error)
    throw error
  }
}

/**
 * Clear all data from the mock database
 * Useful for test cleanup or resetting state
 */
export async function clearDatabase(): Promise<void> {
  await db.items.clear()
  await db.users.clear()
  console.log('[MockDB] Database cleared')
}

/**
 * Reset mock database to initial seed state
 * Clears all data and re-seeds with initial data
 */
export async function resetDatabase(): Promise<void> {
  await clearDatabase()
  await initializeDatabase()
  console.log('[MockDB] Database reset to initial state')
}
