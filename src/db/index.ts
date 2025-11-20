/**
 * IndexedDB Database Configuration
 *
 * Uses Dexie.js for IndexedDB wrapper.
 * This provides a mock database for frontend development.
 */

import Dexie, { type EntityTable } from 'dexie'

// =============================================================================
// Database Entity Types (stored in IndexedDB)
// =============================================================================

export interface ItemEntity {
  id?: number
  name: string
  description: string
  price: number
  category: string
  created_at: string
  updated_at: string
}

export interface UserEntity {
  id?: number
  email: string
  username: string
  full_name: string
  is_active: boolean
  created_at: string
}

// =============================================================================
// Database Class
// =============================================================================

export class AppDatabase extends Dexie {
  items!: EntityTable<ItemEntity, 'id'>
  users!: EntityTable<UserEntity, 'id'>

  constructor() {
    super('MermaidChartCloneDB')

    this.version(1).stores({
      items: '++id, name, category, created_at',
      users: '++id, email, username, created_at',
    })
  }
}

// =============================================================================
// Database Instance
// =============================================================================

export const db = new AppDatabase()

// =============================================================================
// Seed Data
// =============================================================================

const initialItems: Omit<ItemEntity, 'id'>[] = [
  {
    name: '노트북',
    description: '고성능 노트북',
    price: 1500000,
    category: '전자제품',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    name: '마우스',
    description: '무선 마우스',
    price: 30000,
    category: '전자제품',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    name: '키보드',
    description: '기계식 키보드',
    price: 150000,
    category: '전자제품',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
]

const initialUsers: Omit<UserEntity, 'id'>[] = [
  {
    email: 'user1@example.com',
    username: 'user1',
    full_name: '홍길동',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    email: 'user2@example.com',
    username: 'user2',
    full_name: '김철수',
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
  },
]

// =============================================================================
// Database Initialization
// =============================================================================

/**
 * Initialize the database with seed data if empty
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Check if items table is empty
    const itemCount = await db.items.count()
    if (itemCount === 0) {
      await db.items.bulkAdd(initialItems)
      console.log('[IndexedDB] Seeded items table with initial data')
    }

    // Check if users table is empty
    const userCount = await db.users.count()
    if (userCount === 0) {
      await db.users.bulkAdd(initialUsers)
      console.log('[IndexedDB] Seeded users table with initial data')
    }

    console.log('[IndexedDB] Database initialized successfully')
  } catch (error) {
    console.error('[IndexedDB] Failed to initialize database:', error)
    throw error
  }
}

/**
 * Clear all data from the database
 */
export async function clearDatabase(): Promise<void> {
  await db.items.clear()
  await db.users.clear()
  console.log('[IndexedDB] Database cleared')
}

/**
 * Reset database to initial state
 */
export async function resetDatabase(): Promise<void> {
  await clearDatabase()
  await initializeDatabase()
  console.log('[IndexedDB] Database reset to initial state')
}
