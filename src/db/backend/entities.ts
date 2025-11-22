/**
 * Mock Database Entity Types
 *
 * These types define the structure of data stored in IndexedDB (browser-side mock database).
 * Used only when VITE_API_MODE=mock for frontend development and testing.
 *
 * Note: When using a real backend (VITE_API_MODE=real), these entities are not used.
 * The API response schemas in src/schemas/ define the data contract instead.
 */

// =============================================================================
// Database Entity Types (stored in IndexedDB)
// =============================================================================

/**
 * Item entity stored in IndexedDB
 * Mirrors the backend database Item model
 */
export interface ItemEntity {
  id?: number
  name: string
  description: string
  price: number
  category: string
  created_at: string
  updated_at: string
}

/**
 * User entity stored in IndexedDB
 * Mirrors the backend database User model
 */
export interface UserEntity {
  id?: number
  email: string
  username: string
  full_name: string
  is_active: boolean
  created_at: string
}

/**
 * Shared content entity stored in IndexedDB
 * For testing content sharing with id/alias
 */
export interface ContentEntity {
  id?: number
  alias: string // URL-friendly unique identifier
  title: string
  content: string
  author: string
  is_public: boolean
  view_count: number
  created_at: string
  updated_at: string
}
