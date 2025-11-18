/**
 * API Client
 *
 * This module provides a unified fetch wrapper for making API requests.
 * It automatically handles the API mode (mock vs real) based on configuration.
 */

import { getApiUrl } from './config'

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Generic API client options
 */
export interface ApiClientOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

/**
 * Build query string from params
 */
function buildQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return ''

  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

/**
 * Generic API fetch function
 */
async function apiFetch<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { params, ...fetchOptions } = options

  // Build full URL
  const queryString = buildQueryString(params)
  const url = getApiUrl(endpoint) + queryString

  // Set default headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })

    // Parse response body
    const data = await response.json().catch(() => ({}))

    // Handle error responses
    if (!response.ok) {
      throw new ApiError(
        data.detail || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        data,
      )
    }

    return data as T
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error
    }

    // Wrap network errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0,
      error,
    )
  }
}

/**
 * API Client
 */
export const apiClient = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, options?: ApiClientOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, body?: unknown, options?: ApiClientOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, body?: unknown, options?: ApiClientOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, body?: unknown, options?: ApiClientOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: ApiClientOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
}
