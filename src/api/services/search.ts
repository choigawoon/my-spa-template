/**
 * Search API Service
 *
 * This module provides React Query hooks for search functionality.
 */

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { SearchResponse } from '@/schemas'

/**
 * Query keys for search
 */
export const searchKeys = {
  all: ['search'] as const,
  query: (q: string) => [...searchKeys.all, q] as const,
}

/**
 * Search items
 */
export const useSearch = (query: string) => {
  return useQuery({
    queryKey: searchKeys.query(query),
    queryFn: () =>
      apiClient.get<SearchResponse>('/api/search', {
        params: { q: query },
      }),
    enabled: query.length > 0,
  })
}
