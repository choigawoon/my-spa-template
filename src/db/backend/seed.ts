/**
 * Mock Database Seed Data
 *
 * Initial data for the browser-side IndexedDB mock database.
 * Used only when VITE_API_MODE=mock for frontend development and testing.
 *
 * When using a real backend, seed data is managed by the backend system
 * (e.g., Prisma seed scripts, database migrations).
 */

import type { ItemEntity, UserEntity, ContentEntity } from './entities'

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

// =============================================================================
// Seed Data for Contents
// =============================================================================

export const initialContents: Omit<ContentEntity, 'id'>[] = [
  {
    alias: 'welcome-demo',
    title: '환영합니다!',
    content: '이것은 공유 가능한 콘텐츠 데모입니다. URL을 통해 이 콘텐츠에 접근할 수 있습니다.',
    author: '관리자',
    is_public: true,
    view_count: 42,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    alias: 'hello-world',
    title: 'Hello World',
    content: 'This is a sample shared content. You can access it via /db-test/hello-world or /db-test/2',
    author: 'Demo User',
    is_public: true,
    view_count: 15,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
]
