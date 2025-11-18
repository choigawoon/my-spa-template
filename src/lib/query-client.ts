/**
 * React Query Configuration
 *
 * This file sets up the QueryClient with default options for the entire app.
 */

import { QueryClient, type DefaultOptions } from '@tanstack/react-query'

/**
 * Default query options
 */
const queryConfig: DefaultOptions = {
  queries: {
    // Refetch on window focus (can be disabled for development)
    refetchOnWindowFocus: false,

    // Retry failed requests
    retry: 1,

    // Stale time (how long data is considered fresh)
    staleTime: 5 * 60 * 1000, // 5 minutes

    // Cache time (how long unused data stays in cache)
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  },
  mutations: {
    // Retry failed mutations
    retry: 0,
  },
}

/**
 * Create and export query client
 */
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
})
