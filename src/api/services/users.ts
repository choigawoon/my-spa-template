/**
 * Users API Service
 *
 * This module provides React Query hooks for managing users.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { User, UserCreate, UsersListResponse } from '@/schemas'

/**
 * Query keys for users
 */
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (params?: { skip?: number; limit?: number }) =>
    [...usersKeys.lists(), params] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: number) => [...usersKeys.details(), id] as const,
}

/**
 * Fetch users list
 */
export const useUsers = (params?: { skip?: number; limit?: number }) => {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () =>
      apiClient.get<UsersListResponse>('/api/users', { params }),
  })
}

/**
 * Fetch single user
 */
export const useUser = (id: number) => {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => apiClient.get<User>(`/api/users/${id}`),
    enabled: !!id,
  })
}

/**
 * Create new user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UserCreate) =>
      apiClient.post<User>('/api/users', data),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
    },
  })
}
