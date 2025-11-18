/**
 * API Slice - Manages data fetched from external APIs
 *
 * Purpose: Store and manage server-side data (users, posts, etc.)
 * Use cases: Caching API responses, managing remote data state
 */

import type { StateCreator } from 'zustand'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

export interface Post {
  id: number
  title: string
  content: string
  authorId: number
  createdAt: Date
}

export interface ApiSlice {
  // State
  users: User[]
  posts: Post[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchUsers: () => Promise<void>
  fetchPosts: () => Promise<void>
  addUser: (user: Omit<User, 'id'>) => void
  removeUser: (id: number) => void
  updateUser: (id: number, updates: Partial<User>) => void
  clearError: () => void
  reset: () => void
}

const initialState = {
  users: [],
  posts: [],
  isLoading: false,
  error: null,
}

export const createApiSlice: StateCreator<ApiSlice> = (set) => ({
  ...initialState,

  fetchUsers: async () => {
    set({ isLoading: true, error: null })
    try {
      // Simulated API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockUsers: User[] = [
        { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
        { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
        { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'user' },
      ]
      set({ users: mockUsers, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch users', isLoading: false })
    }
  },

  fetchPosts: async () => {
    set({ isLoading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      const mockPosts: Post[] = [
        { id: 1, title: 'Getting Started with Zustand', content: 'Zustand is amazing!', authorId: 1, createdAt: new Date() },
        { id: 2, title: 'React Best Practices', content: 'Keep components small...', authorId: 2, createdAt: new Date() },
      ]
      set({ posts: mockPosts, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch posts', isLoading: false })
    }
  },

  addUser: (userData) => {
    set((state) => ({
      users: [...state.users, { ...userData, id: Date.now() }]
    }))
  },

  removeUser: (id) => {
    set((state) => ({
      users: state.users.filter(user => user.id !== id)
    }))
  },

  updateUser: (id, updates) => {
    set((state) => ({
      users: state.users.map(user =>
        user.id === id ? { ...user, ...updates } : user
      )
    }))
  },

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
})
