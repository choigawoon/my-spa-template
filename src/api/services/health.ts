/**
 * Health Check API Service
 *
 * This module provides React Query hooks for health check.
 */

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { HealthCheck } from '@/schemas'

/**
 * Query keys for health
 */
export const healthKeys = {
  all: ['health'] as const,
  check: () => [...healthKeys.all, 'check'] as const,
}

/**
 * Health check
 */
export const useHealthCheck = () => {
  return useQuery({
    queryKey: healthKeys.check(),
    queryFn: () => apiClient.get<HealthCheck>('/api/health'),
    // Health check should be fresh frequently
    staleTime: 30 * 1000, // 30 seconds
  })
}
