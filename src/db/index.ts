/**
 * Database Layer Entry Point
 *
 * This module provides two separate IndexedDB databases:
 *
 * ## 1. Backend Mock Database (BackendMockDB)
 * - Location: src/db/backend/
 * - Purpose: Mock backend API data during development
 * - Used by: MSW handlers
 * - In production: NOT used (replaced by real backend API)
 *
 * ## 2. Frontend Database (FrontendDB)
 * - Location: src/db/frontend/
 * - Purpose: Store frontend-only data
 * - Used by: Components, state management, PWA
 * - In production: STILL used (persists in browser)
 *
 * ## Storage Architecture
 *
 * ```
 * IndexedDB
 * ├── BackendMockDB          # Mock mode only
 * │   ├── items              → Backend PostgreSQL
 * │   └── users              → Backend PostgreSQL
 * │
 * └── FrontendDB             # Always used
 *     ├── settings           # User preferences
 *     ├── drafts             # Unsaved work
 *     ├── cache              # Performance cache
 *     └── recentItems        # View history
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * // Backend mock data (only in mock mode)
 * import { backendDb, initializeBackendDb } from '@/db'
 *
 * // Frontend local data (always available)
 * import { frontendDb, getSetting, setSetting } from '@/db'
 * ```
 */

// =============================================================================
// Backend Mock Database Exports (for MSW handlers)
// =============================================================================

export {
  // Database instance
  backendDb,
  db, // Legacy alias
  BackendMockDatabase,

  // Lifecycle functions
  initializeBackendDb,
  clearBackendDb,
  resetBackendDb,

  // Legacy aliases
  initializeDatabase,
  clearDatabase,
  resetDatabase,
} from './backend'

// Entity types
export type { ItemEntity, UserEntity, ContentEntity } from './backend'

// =============================================================================
// Frontend Database Exports (for components & state)
// =============================================================================

export {
  // Database instance
  frontendDb,
  FrontendDatabase,

  // Settings helpers
  getSetting,
  setSetting,
  deleteSetting,

  // Draft helpers
  saveDraft,
  getDraft,
  deleteDraft,
  getDraftsByType,

  // Cache helpers
  getCache,
  setCache,
  clearExpiredCache,
  clearAllCache,

  // Recent items helpers
  addRecentItem,
  getRecentItems,
  clearRecentItems,

  // Lifecycle functions
  initializeFrontendDb,
  clearFrontendDb,
} from './frontend'

// Entity types
export type {
  SettingsEntity,
  DraftEntity,
  CacheEntity,
  RecentItemEntity,
} from './frontend'
