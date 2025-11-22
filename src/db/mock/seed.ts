/**
 * Mock Database Seed Data
 *
 * Initial data for the browser-side IndexedDB mock database.
 * Used only when VITE_API_MODE=mock for frontend development and testing.
 *
 * When using a real backend, seed data is managed by the backend system
 * (e.g., Prisma seed scripts, database migrations).
 */

import type { ItemEntity, UserEntity } from './entities'

// =============================================================================
// Seed Data for Items
// =============================================================================

export const initialItems: Omit<ItemEntity, 'id'>[] = [
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

// =============================================================================
// Seed Data for Users
// =============================================================================

export const initialUsers: Omit<UserEntity, 'id'>[] = [
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
