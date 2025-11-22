/**
 * Frontend Database Entity Types
 *
 * These types define the structure of data stored in the frontend-only IndexedDB.
 * This data persists in the browser even in production (VITE_API_MODE=real).
 *
 * Use cases:
 * - User preferences and settings
 * - Offline drafts and temporary data
 * - Local cache for performance
 * - PWA offline storage
 */

// =============================================================================
// Frontend Database Entity Types
// =============================================================================

/**
 * User settings stored locally in the browser
 * Persists across sessions and in production
 */
export interface SettingsEntity {
  id?: number
  key: string
  value: string | number | boolean | object
  updated_at: string
}

/**
 * Draft content saved locally before syncing to backend
 * Useful for offline editing and auto-save
 */
export interface DraftEntity {
  id?: number
  type: string // e.g., 'item', 'document', 'form'
  reference_id?: number // ID of the related backend entity (if editing)
  content: object
  created_at: string
  updated_at: string
}

/**
 * Local cache entries for performance optimization
 * Can be cleared without data loss
 */
export interface CacheEntity {
  id?: number
  key: string
  data: object
  expires_at: string
  created_at: string
}

/**
 * Recent items viewed by the user
 * For quick access and history
 */
export interface RecentItemEntity {
  id?: number
  item_type: string // e.g., 'item', 'user', 'document'
  item_id: number
  viewed_at: string
}
