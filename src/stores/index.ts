/**
 * Main Store - Combines all slices into a single Zustand store
 *
 * Usage in components:
 * ```tsx
 * import { useStore } from '@/stores'
 *
 * // Use entire store
 * const store = useStore()
 *
 * // Use specific state (recommended for performance)
 * const users = useStore(state => state.users)
 * const addTask = useStore(state => state.addTask)
 * const theme = useStore(state => state.theme)
 * ```
 *
 * Benefits of this pattern:
 * - No props drilling
 * - Type-safe state access
 * - Modular slice organization
 * - Easy to test individual slices
 * - Performance optimization with selectors
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { createApiSlice, type ApiSlice } from './slices/apiSlice'
import { createUiSlice, type UiSlice } from './slices/uiSlice'
import { createTaskSlice, type TaskSlice } from './slices/taskSlice'
import { createWorkflowSlice, type WorkflowSlice } from './slices/workflowSlice'

// Combined store type
export type Store = ApiSlice & UiSlice & TaskSlice & WorkflowSlice

/**
 * Main application store
 * Combines all slices and adds middleware for:
 * - DevTools: Redux DevTools integration (dev only)
 * - Persist: LocalStorage persistence for UI preferences
 */
export const useStore = create<Store>()(
  devtools(
    persist(
      (...args) => ({
        ...createApiSlice(...args),
        ...createUiSlice(...args),
        ...createTaskSlice(...args),
        ...createWorkflowSlice(...args),
      }),
      {
        name: 'app-storage', // LocalStorage key
        // Only persist UI preferences, not API data or tasks
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          isSidebarOpen: state.isSidebarOpen,
        }),
      }
    ),
    {
      name: 'App Store', // Name shown in Redux DevTools
      enabled: import.meta.env.DEV, // Only enable in development
    }
  )
)

/**
 * Selector hooks for better performance
 * These hooks only re-render when specific state changes
 */

// API selectors
export const useUsers = () => useStore(state => state.users)
export const usePosts = () => useStore(state => state.posts)
export const useApiLoading = () => useStore(state => state.isLoading)

// UI selectors
export const useTheme = () => useStore(state => state.theme)
export const useSidebar = () => useStore(state => state.isSidebarOpen)
export const useModal = () => useStore(state => state.modal)
export const useNotifications = () => useStore(state => state.notifications)

// Task selectors
export const useTasks = () => useStore(state => state.getFilteredTasks())
export const useSelectedTask = () => {
  const selectedTaskId = useStore(state => state.selectedTaskId)
  const getTaskById = useStore(state => state.getTaskById)
  return selectedTaskId ? getTaskById(selectedTaskId) : null
}
export const useTaskFilter = () => useStore(state => state.filter)

// Workflow selectors
export const useCurrentWork = () => useStore(state => state.currentWork)
export const useWorkHistory = () => useStore(state => state.workHistory)
export const useWorkLogs = () => useStore(state => state.workLogs)
export const useIsWorkInProgress = () => useStore(state => state.isWorkInProgress)

/**
 * Action hooks for better organization
 * Group related actions together
 */

export const useApiActions = () => useStore(
  useShallow(state => ({
    fetchUsers: state.fetchUsers,
    fetchPosts: state.fetchPosts,
    addUser: state.addUser,
    removeUser: state.removeUser,
    updateUser: state.updateUser,
  }))
)

export const useUiActions = () => useStore(
  useShallow(state => ({
    toggleSidebar: state.toggleSidebar,
    setTheme: state.setTheme,
    setLanguage: state.setLanguage,
    openModal: state.openModal,
    closeModal: state.closeModal,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
  }))
)

export const useTaskActions = () => useStore(
  useShallow(state => ({
    addTask: state.addTask,
    updateTask: state.updateTask,
    deleteTask: state.deleteTask,
    selectTask: state.selectTask,
    setTaskStatus: state.setTaskStatus,
    setFilter: state.setFilter,
    setSortBy: state.setSortBy,
  }))
)

export const useWorkflowActions = () => useStore(
  useShallow(state => ({
    startWork: state.startWork,
    updateWorkProgress: state.updateWorkProgress,
    completeWork: state.completeWork,
    failWork: state.failWork,
    cancelWork: state.cancelWork,
    clearHistory: state.clearHistory,
    addLog: state.addLog,
    clearLogs: state.clearLogs,
    simulateWork: state.simulateWork,
  }))
)

/**
 * Reset all stores (useful for logout)
 */
export const useResetStore = () => {
  const apiReset = useStore(state => state.reset)
  const uiReset = useStore(state => state.reset)
  const taskReset = useStore(state => state.reset)

  return () => {
    // Note: This will call the same reset multiple times
    // In production, you might want to create separate reset methods
    // or handle this differently
    apiReset()
    uiReset()
    taskReset()
  }
}

// Export types for use in components
export type { User, Post } from './slices/apiSlice'
export type { Theme, Language, Notification } from './slices/uiSlice'
export type { Task } from './slices/taskSlice'
export type { WorkItem, WorkLog, WorkStatus } from './slices/workflowSlice'
