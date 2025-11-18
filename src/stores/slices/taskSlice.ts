/**
 * Task Slice - Manages application tasks and operations
 *
 * Purpose: Handle task management, loading states, and work items
 * Use cases: Todo lists, operation tracking, async job management
 */

import type { StateCreator } from 'zustand'

export interface Task {
  id: number
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  assignedTo?: string
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface TaskSlice {
  // State
  tasks: Task[]
  selectedTaskId: number | null
  filter: 'all' | 'pending' | 'in_progress' | 'completed'
  sortBy: 'createdAt' | 'dueDate' | 'priority'
  isLoading: boolean

  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: number, updates: Partial<Task>) => void
  deleteTask: (id: number) => void
  selectTask: (id: number | null) => void
  setFilter: (filter: TaskSlice['filter']) => void
  setSortBy: (sortBy: TaskSlice['sortBy']) => void
  setTaskStatus: (id: number, status: Task['status']) => void
  getFilteredTasks: () => Task[]
  getTaskById: (id: number) => Task | undefined
  reset: () => void
}

const initialState = {
  tasks: [],
  selectedTaskId: null,
  filter: 'all' as const,
  sortBy: 'createdAt' as const,
  isLoading: false,
}

export const createTaskSlice: StateCreator<TaskSlice> = (set, get) => ({
  ...initialState,

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    set((state) => ({
      tasks: [...state.tasks, newTask]
    }))
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    }))
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter(task => task.id !== id),
      selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId
    }))
  },

  selectTask: (id) => {
    set({ selectedTaskId: id })
  },

  setFilter: (filter) => {
    set({ filter })
  },

  setSortBy: (sortBy) => {
    set({ sortBy })
  },

  setTaskStatus: (id, status) => {
    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === id
          ? { ...task, status, updatedAt: new Date() }
          : task
      )
    }))
  },

  getFilteredTasks: () => {
    const { tasks, filter, sortBy } = get()

    // Filter tasks
    let filtered = tasks
    if (filter !== 'all') {
      filtered = tasks.filter(task => task.status === filter)
    }

    // Sort tasks
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        case 'dueDate':
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate.getTime() - b.dueDate.getTime()
        case 'createdAt':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })

    return sorted
  },

  getTaskById: (id) => {
    return get().tasks.find(task => task.id === id)
  },

  reset: () => set(initialState),
})
