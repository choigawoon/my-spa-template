/**
 * Auth API Service
 *
 * This module provides React Query hooks for authentication.
 */

import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { LoginRequest, LoginResponse } from '@/schemas'

/**
 * Query keys for auth
 */
export const authKeys = {
  all: ['auth'] as const,
  login: () => [...authKeys.all, 'login'] as const,
}

/**
 * Login mutation
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) =>
      apiClient.post<LoginResponse>('/api/auth/login', credentials),
    onSuccess: (data) => {
      // Store token in localStorage or secure storage
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
    },
  })
}

/**
 * Logout function (client-side only)
 */
export const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
}

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

/**
 * Get access token from localStorage
 */
export const getAccessToken = () => {
  return localStorage.getItem('access_token')
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAccessToken()
}
