/**
 * Workflow Slice - Work Propagation Management
 *
 * Demonstrates state propagation across component hierarchy without props drilling.
 * Components at any depth can subscribe to workflow state changes directly through Zustand.
 *
 * Key Features:
 * - Work status tracking (idle, running, completed, error)
 * - Progress tracking with percentage
 * - Work history and logs
 * - State change notifications
 * - No Context API or event bus needed - pure Zustand
 */

import type { StateCreator } from 'zustand'

export type WorkStatus = 'idle' | 'running' | 'completed' | 'error'

export interface WorkItem {
  id: string
  name: string
  status: WorkStatus
  progress: number // 0-100
  startTime?: number
  endTime?: number
  error?: string
}

export interface WorkLog {
  id: string
  timestamp: number
  message: string
  level: 'info' | 'success' | 'warning' | 'error'
  workItemId?: string
}

export interface WorkflowSlice {
  // State
  currentWork: WorkItem | null
  workHistory: WorkItem[]
  workLogs: WorkLog[]
  isWorkInProgress: boolean

  // Actions
  startWork: (name: string) => void
  updateWorkProgress: (progress: number) => void
  completeWork: () => void
  failWork: (error: string) => void
  cancelWork: () => void
  clearHistory: () => void
  addLog: (message: string, level?: WorkLog['level'], workItemId?: string) => void
  clearLogs: () => void

  // Simulated async work
  simulateWork: (name: string, durationMs?: number) => Promise<void>
}

let workIdCounter = 0
let logIdCounter = 0

export const createWorkflowSlice: StateCreator<WorkflowSlice> = (set, get) => ({
  // Initial state
  currentWork: null,
  workHistory: [],
  workLogs: [],
  isWorkInProgress: false,

  // Start a new work item
  startWork: (name: string) => {
    const workItem: WorkItem = {
      id: `work-${++workIdCounter}`,
      name,
      status: 'running',
      progress: 0,
      startTime: Date.now(),
    }

    set({
      currentWork: workItem,
      isWorkInProgress: true,
    })

    get().addLog(`Started: ${name}`, 'info', workItem.id)
  },

  // Update progress of current work
  updateWorkProgress: (progress: number) => {
    const { currentWork } = get()
    if (!currentWork) return

    set({
      currentWork: {
        ...currentWork,
        progress: Math.min(100, Math.max(0, progress)),
      },
    })

    if (progress % 25 === 0) {
      get().addLog(`Progress: ${progress}%`, 'info', currentWork.id)
    }
  },

  // Complete current work
  completeWork: () => {
    const { currentWork, workHistory } = get()
    if (!currentWork) return

    const completedWork: WorkItem = {
      ...currentWork,
      status: 'completed',
      progress: 100,
      endTime: Date.now(),
    }

    set({
      currentWork: null,
      isWorkInProgress: false,
      workHistory: [completedWork, ...workHistory],
    })

    get().addLog(`Completed: ${completedWork.name}`, 'success', completedWork.id)
  },

  // Fail current work
  failWork: (error: string) => {
    const { currentWork, workHistory } = get()
    if (!currentWork) return

    const failedWork: WorkItem = {
      ...currentWork,
      status: 'error',
      endTime: Date.now(),
      error,
    }

    set({
      currentWork: null,
      isWorkInProgress: false,
      workHistory: [failedWork, ...workHistory],
    })

    get().addLog(`Failed: ${failedWork.name} - ${error}`, 'error', failedWork.id)
  },

  // Cancel current work
  cancelWork: () => {
    const { currentWork } = get()
    if (!currentWork) return

    set({
      currentWork: null,
      isWorkInProgress: false,
    })

    get().addLog(`Cancelled: ${currentWork.name}`, 'warning', currentWork.id)
  },

  // Clear work history
  clearHistory: () => {
    set({ workHistory: [] })
    get().addLog('Work history cleared', 'info')
  },

  // Add a log entry
  addLog: (message: string, level: WorkLog['level'] = 'info', workItemId?: string) => {
    const { workLogs } = get()

    const log: WorkLog = {
      id: `log-${++logIdCounter}`,
      timestamp: Date.now(),
      message,
      level,
      workItemId,
    }

    set({
      workLogs: [log, ...workLogs].slice(0, 50), // Keep last 50 logs
    })
  },

  // Clear all logs
  clearLogs: () => {
    set({ workLogs: [] })
  },

  // Simulate async work with progress updates
  simulateWork: async (name: string, durationMs: number = 3000) => {
    const { startWork, updateWorkProgress, completeWork, failWork } = get()

    // Start work
    startWork(name)

    // Simulate progress
    const steps = 10
    const stepDuration = durationMs / steps

    try {
      for (let i = 1; i <= steps; i++) {
        await new Promise((resolve) => setTimeout(resolve, stepDuration))
        updateWorkProgress((i / steps) * 100)

        // Simulate random failure (10% chance)
        if (Math.random() < 0.1) {
          throw new Error('Random simulated failure')
        }
      }

      // Complete work
      completeWork()
    } catch (error) {
      failWork(error instanceof Error ? error.message : 'Unknown error')
    }
  },
})
