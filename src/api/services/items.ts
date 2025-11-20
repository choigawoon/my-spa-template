/**
 * Items API Service
 *
 * This module provides React Query hooks for managing items.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type {
  Item,
  ItemCreate,
  ItemUpdate,
  ItemsListResponse,
} from '@/schemas'

/**
 * Query keys for items
 */
export const itemsKeys = {
  all: ['items'] as const,
  lists: () => [...itemsKeys.all, 'list'] as const,
  list: (params?: { skip?: number; limit?: number; category?: string }) =>
    [...itemsKeys.lists(), params] as const,
  details: () => [...itemsKeys.all, 'detail'] as const,
  detail: (id: number) => [...itemsKeys.details(), id] as const,
}

/**
 * Fetch items list
 */
export const useItems = (params?: {
  skip?: number
  limit?: number
  category?: string
}) => {
  return useQuery({
    queryKey: itemsKeys.list(params),
    queryFn: () =>
      apiClient.get<ItemsListResponse>('/api/items', { params }),
  })
}

/**
 * Fetch single item
 */
export const useItem = (id: number) => {
  return useQuery({
    queryKey: itemsKeys.detail(id),
    queryFn: () => apiClient.get<Item>(`/api/items/${id}`),
    enabled: !!id,
  })
}

/**
 * Create new item
 */
export const useCreateItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ItemCreate) =>
      apiClient.post<Item>('/api/items', data),
    onSuccess: () => {
      // Invalidate and refetch items list
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() })
    },
  })
}

/**
 * Update item
 */
export const useUpdateItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ItemUpdate }) =>
      apiClient.put<Item>(`/api/items/${id}`, data),
    onSuccess: (data) => {
      // Invalidate item detail and list
      queryClient.invalidateQueries({ queryKey: itemsKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() })
    },
  })
}

/**
 * Delete item
 */
export const useDeleteItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete<{ message: string }>(`/api/items/${id}`),
    onSuccess: () => {
      // Invalidate items list
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() })
    },
  })
}
