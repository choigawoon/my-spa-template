/**
 * Frontend Database (Browser IndexedDB)
 *
 * This database stores frontend-only data that persists in the browser.
 * It is used in BOTH mock and production modes.
 *
 * Data stored here:
 * - settings - User preferences (theme, language, etc.)
 * - drafts - Unsaved work, offline edits
 * - cache - Performance optimization cache
 * - recentItems - Recently viewed items
 *
 * Unlike BackendMockDB, this data:
 * - Stays in the browser in production
 * - Is NOT replaced by backend API
 * - Is user-specific and local
 */

import Dexie, { type EntityTable } from 'dexie'
import type {
  SettingsEntity,
  DraftEntity,
  CacheEntity,
  RecentItemEntity,
} from './entities'

// Re-export entity types
export type {
  SettingsEntity,
  DraftEntity,
  CacheEntity,
  RecentItemEntity,
} from './entities'

// =============================================================================
// Frontend Database Class
// =============================================================================

/**
 * Dexie database class for frontend-only data
 * Database name: 'FrontendDB'
 *
 * This data persists in browser even in production
 */
export class FrontendDatabase extends Dexie {
  settings!: EntityTable<SettingsEntity, 'id'>
  drafts!: EntityTable<DraftEntity, 'id'>
  cache!: EntityTable<CacheEntity, 'id'>
  recentItems!: EntityTable<RecentItemEntity, 'id'>

  constructor() {
    super('FrontendDB')

    this.version(1).stores({
      settings: '++id, key, updated_at',
      drafts: '++id, type, reference_id, updated_at',
      cache: '++id, key, expires_at',
      recentItems: '++id, item_type, item_id, viewed_at',
    })
  }
}

// =============================================================================
// Database Instance
// =============================================================================

/**
 * Singleton instance of the frontend database
 * Used by components and state management
 */
export const frontendDb = new FrontendDatabase()

// =============================================================================
// Settings Helper Functions
// =============================================================================

/**
 * Get a setting value by key
 */
export async function getSetting<T = unknown>(key: string): Promise<T | undefined> {
  const setting = await frontendDb.settings.where('key').equals(key).first()
  return setting?.value as T | undefined
}

/**
 * Set a setting value
 */
export async function setSetting(key: string, value: unknown): Promise<void> {
  const existing = await frontendDb.settings.where('key').equals(key).first()
  const now = new Date().toISOString()

  if (existing) {
    await frontendDb.settings.update(existing.id!, {
      value,
      updated_at: now,
    })
  } else {
    await frontendDb.settings.add({
      key,
      value,
      updated_at: now,
    })
  }
}

/**
 * Delete a setting
 */
export async function deleteSetting(key: string): Promise<void> {
  await frontendDb.settings.where('key').equals(key).delete()
}

// =============================================================================
// Draft Helper Functions
// =============================================================================

/**
 * Save a draft
 */
export async function saveDraft(
  type: string,
  content: object,
  referenceId?: number
): Promise<number> {
  const now = new Date().toISOString()

  // Check if draft exists for this reference
  if (referenceId) {
    const existing = await frontendDb.drafts
      .where({ type, reference_id: referenceId })
      .first()

    if (existing) {
      await frontendDb.drafts.update(existing.id!, {
        content,
        updated_at: now,
      })
      return existing.id!
    }
  }

  // Create new draft
  return await frontendDb.drafts.add({
    type,
    reference_id: referenceId,
    content,
    created_at: now,
    updated_at: now,
  })
}

/**
 * Get a draft by type and reference ID
 */
export async function getDraft(
  type: string,
  referenceId?: number
): Promise<DraftEntity | undefined> {
  if (referenceId) {
    return await frontendDb.drafts
      .where({ type, reference_id: referenceId })
      .first()
  }
  return await frontendDb.drafts.where('type').equals(type).first()
}

/**
 * Delete a draft
 */
export async function deleteDraft(id: number): Promise<void> {
  await frontendDb.drafts.delete(id)
}

/**
 * Get all drafts of a type
 */
export async function getDraftsByType(type: string): Promise<DraftEntity[]> {
  return await frontendDb.drafts.where('type').equals(type).toArray()
}

// =============================================================================
// Cache Helper Functions
// =============================================================================

/**
 * Get cached data by key (returns undefined if expired)
 */
export async function getCache<T = unknown>(key: string): Promise<T | undefined> {
  const entry = await frontendDb.cache.where('key').equals(key).first()

  if (!entry) return undefined

  // Check if expired
  if (new Date(entry.expires_at) < new Date()) {
    await frontendDb.cache.delete(entry.id!)
    return undefined
  }

  return entry.data as T
}

/**
 * Set cache with expiration (default 1 hour)
 */
export async function setCache(
  key: string,
  data: object,
  ttlMs: number = 60 * 60 * 1000
): Promise<void> {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + ttlMs).toISOString()

  const existing = await frontendDb.cache.where('key').equals(key).first()

  if (existing) {
    await frontendDb.cache.update(existing.id!, {
      data,
      expires_at: expiresAt,
      created_at: now.toISOString(),
    })
  } else {
    await frontendDb.cache.add({
      key,
      data,
      expires_at: expiresAt,
      created_at: now.toISOString(),
    })
  }
}

/**
 * Clear all expired cache entries
 */
export async function clearExpiredCache(): Promise<void> {
  const now = new Date().toISOString()
  await frontendDb.cache.where('expires_at').below(now).delete()
}

/**
 * Clear all cache
 */
export async function clearAllCache(): Promise<void> {
  await frontendDb.cache.clear()
}

// =============================================================================
// Recent Items Helper Functions
// =============================================================================

/**
 * Add to recent items (keeps last 50 per type)
 */
export async function addRecentItem(
  itemType: string,
  itemId: number
): Promise<void> {
  const now = new Date().toISOString()

  // Remove if already exists
  await frontendDb.recentItems
    .where({ item_type: itemType, item_id: itemId })
    .delete()

  // Add new entry
  await frontendDb.recentItems.add({
    item_type: itemType,
    item_id: itemId,
    viewed_at: now,
  })

  // Keep only last 50 per type
  const items = await frontendDb.recentItems
    .where('item_type')
    .equals(itemType)
    .reverse()
    .sortBy('viewed_at')

  if (items.length > 50) {
    const toDelete = items.slice(50).map((item) => item.id!)
    await frontendDb.recentItems.bulkDelete(toDelete)
  }
}

/**
 * Get recent items by type
 */
export async function getRecentItems(
  itemType: string,
  limit: number = 10
): Promise<RecentItemEntity[]> {
  return await frontendDb.recentItems
    .where('item_type')
    .equals(itemType)
    .reverse()
    .sortBy('viewed_at')
    .then((items) => items.slice(0, limit))
}

/**
 * Clear recent items
 */
export async function clearRecentItems(itemType?: string): Promise<void> {
  if (itemType) {
    await frontendDb.recentItems.where('item_type').equals(itemType).delete()
  } else {
    await frontendDb.recentItems.clear()
  }
}

// =============================================================================
// Database Lifecycle Functions
// =============================================================================

/**
 * Initialize frontend database (clear expired cache on startup)
 */
export async function initializeFrontendDb(): Promise<void> {
  await clearExpiredCache()
  console.log('[FrontendDB] Frontend database initialized')
}

/**
 * Clear all frontend database data
 */
export async function clearFrontendDb(): Promise<void> {
  await frontendDb.settings.clear()
  await frontendDb.drafts.clear()
  await frontendDb.cache.clear()
  await frontendDb.recentItems.clear()
  console.log('[FrontendDB] All frontend data cleared')
}
