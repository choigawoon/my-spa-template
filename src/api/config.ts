/**
 * API Configuration
 *
 * This file contains the API configuration based on environment variables.
 * It determines whether to use MSW (Mock Service Worker) or a real backend.
 */

export const API_CONFIG = {
  /**
   * API mode: 'mock' uses MSW, 'real' uses actual backend
   */
  mode: (import.meta.env.VITE_API_MODE || 'mock') as 'mock' | 'real',

  /**
   * Base URL for the API
   * - In 'mock' mode: uses relative URLs (/api/*)
   * - In 'real' mode: uses VITE_API_BASE_URL
   */
  baseURL:
    import.meta.env.VITE_API_MODE === 'real'
      ? import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
      : '',

  /**
   * Enable React Query DevTools
   */
  enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
} as const

/**
 * Check if MSW is enabled
 */
export const isMockMode = () => API_CONFIG.mode === 'mock'

/**
 * Get full API URL
 */
export const getApiUrl = (path: string) => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  // In mock mode, use relative URLs
  if (isMockMode()) {
    return normalizedPath
  }

  // In real mode, use base URL + path
  return `${API_CONFIG.baseURL}${normalizedPath}`
}
