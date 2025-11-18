/**
 * UI Slice - Manages local UI state
 *
 * Purpose: Handle client-side UI state (modals, sidebars, themes, etc.)
 * Use cases: Toggle visibility, manage UI preferences, control layout
 */

import type { StateCreator } from 'zustand'

export type Theme = 'light' | 'dark' | 'system'
export type Language = 'en' | 'ko' | 'ja'

export interface Modal {
  isOpen: boolean
  title?: string
  content?: string
}

export interface UiSlice {
  // State
  isSidebarOpen: boolean
  theme: Theme
  language: Language
  modal: Modal
  notifications: Notification[]

  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (isOpen: boolean) => void
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  openModal: (title: string, content: string) => void
  closeModal: () => void
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
  removeNotification: (id: number) => void
  clearNotifications: () => void
  reset: () => void
}

export interface Notification {
  id: number
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
}

const initialState = {
  isSidebarOpen: true,
  theme: 'system' as Theme,
  language: 'en' as Language,
  modal: { isOpen: false },
  notifications: [],
}

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  ...initialState,

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }))
  },

  setSidebarOpen: (isOpen) => {
    set({ isSidebarOpen: isOpen })
  },

  setTheme: (theme) => {
    set({ theme })
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  },

  setLanguage: (language) => {
    set({ language })
    // You can integrate with i18n here
    document.documentElement.lang = language
  },

  openModal: (title, content) => {
    set({ modal: { isOpen: true, title, content } })
  },

  closeModal: () => {
    set({ modal: { isOpen: false } })
  },

  addNotification: (message, type = 'info') => {
    const notification: Notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
    }
    set((state) => ({
      notifications: [...state.notifications, notification]
    }))

    // Auto-remove after 5 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== notification.id)
      }))
    }, 5000)
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  },

  clearNotifications: () => {
    set({ notifications: [] })
  },

  reset: () => set(initialState),
})
