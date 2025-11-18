/**
 * Zustand Test Page
 *
 * Interactive demonstration of all Zustand store features:
 * - API data management (users, posts)
 * - UI state (theme, sidebar, modals, notifications)
 * - Task management (CRUD operations, filtering, sorting)
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  useStore,
  useUsers,
  useTasks,
  useApiActions,
  useUiActions,
  useTaskActions,
  useTheme,
  useSidebar,
  useNotifications,
  useApiLoading,
  type Task,
  type User,
} from '@/stores'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/zustand-test')({
  component: ZustandTestPage,
})

function ZustandTestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <Header />
        <div className="grid gap-8 lg:grid-cols-2">
          <ApiSection />
          <UiSection />
        </div>
        <TaskSection />
        <NotificationDisplay />
        <ModalDemo />
      </div>
    </div>
  )
}

function Header() {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold text-foreground">
        Zustand State Management Test
      </h1>
      <p className="text-muted-foreground">
        Interactive demonstration of all store slices: API data, UI state, and task management.
      </p>
    </div>
  )
}

// ============================================================================
// API Section - Test API data management
// ============================================================================

function ApiSection() {
  const users = useUsers()
  const isLoading = useApiLoading()
  const { fetchUsers, addUser, removeUser, updateUser } = useApiActions()
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')

  const handleAddUser = () => {
    if (newUserName && newUserEmail) {
      addUser({
        name: newUserName,
        email: newUserEmail,
        role: 'user',
      })
      setNewUserName('')
      setNewUserEmail('')
    }
  }

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
        API Slice (Data Management)
      </h2>

      <div className="space-y-4">
        <button
          onClick={fetchUsers}
          disabled={isLoading}
          className={cn(
            "rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? 'Loading...' : 'Fetch Users'}
        </button>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Add New User</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Name"
              className="flex-1 rounded border border-input bg-background px-3 py-2 text-foreground"
            />
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="Email"
              className="flex-1 rounded border border-input bg-background px-3 py-2 text-foreground"
            />
            <button
              onClick={handleAddUser}
              className="rounded bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Users ({users.length})</h3>
          <div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-muted-foreground">No users. Click "Fetch Users" to load.</p>
            ) : (
              users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onRemove={removeUser}
                  onUpdate={updateUser}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function UserCard({
  user,
  onRemove,
  onUpdate,
}: {
  user: User
  onRemove: (id: number) => void
  onUpdate: (id: number, updates: Partial<User>) => void
}) {
  const roles: User['role'][] = ['admin', 'user', 'guest']

  return (
    <div className="flex items-center justify-between rounded border border-border bg-background p-3">
      <div>
        <p className="font-medium text-foreground">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
      <div className="flex gap-2">
        <select
          value={user.role}
          onChange={(e) => onUpdate(user.id, { role: e.target.value as User['role'] })}
          className="rounded border border-input bg-background px-2 py-1 text-sm text-foreground"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button
          onClick={() => onRemove(user.id)}
          className="rounded bg-destructive px-3 py-1 text-destructive-foreground hover:bg-destructive/90"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// UI Section - Test UI state management
// ============================================================================

function UiSection() {
  const theme = useTheme()
  const isSidebarOpen = useSidebar()
  const { toggleSidebar, setTheme, setLanguage, openModal, addNotification } = useUiActions()

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
        UI Slice (UI State)
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="mb-2 text-lg font-medium">Theme Control</h3>
          <div className="flex gap-2">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  "rounded px-4 py-2 capitalize transition-colors",
                  theme === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium">Sidebar Control</h3>
          <button
            onClick={toggleSidebar}
            className="rounded bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
          >
            Sidebar is: {isSidebarOpen ? 'Open' : 'Closed'}
          </button>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium">Language</h3>
          <div className="flex gap-2">
            {(['en', 'ko', 'ja'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className="rounded bg-secondary px-4 py-2 uppercase text-secondary-foreground hover:bg-secondary/90"
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium">Modal</h3>
          <button
            onClick={() => openModal('Test Modal', 'This is modal content from Zustand store!')}
            className="rounded bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
          >
            Open Modal
          </button>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium">Notifications</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => addNotification('Info notification', 'info')}
              className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            >
              Info
            </button>
            <button
              onClick={() => addNotification('Success notification', 'success')}
              className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
            >
              Success
            </button>
            <button
              onClick={() => addNotification('Warning notification', 'warning')}
              className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
            >
              Warning
            </button>
            <button
              onClick={() => addNotification('Error notification', 'error')}
              className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
            >
              Error
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// Task Section - Test task management
// ============================================================================

function TaskSection() {
  const tasks = useTasks()
  const filter = useStore(state => state.filter)
  const sortBy = useStore(state => state.sortBy)
  const { addTask, deleteTask, setTaskStatus, setFilter, setSortBy } = useTaskActions()

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium')

  const handleAddTask = () => {
    if (newTaskTitle) {
      addTask({
        title: newTaskTitle,
        description: 'Task created from Zustand test page',
        status: 'pending',
        priority: newTaskPriority,
      })
      setNewTaskTitle('')
    }
  }

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
        Task Slice (Task Management)
      </h2>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-medium">Filter</h3>
            <div className="flex gap-2">
              {(['all', 'pending', 'in_progress', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded px-3 py-1 capitalize transition-colors",
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="mb-2 text-lg font-medium">Sort By</h3>
            <div className="flex gap-2">
              {(['createdAt', 'dueDate', 'priority'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={cn(
                    "rounded px-3 py-1 capitalize transition-colors",
                    sortBy === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {s === 'createdAt' ? 'Created' : s === 'dueDate' ? 'Due Date' : 'Priority'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium">Add New Task</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title"
              className="flex-1 rounded border border-input bg-background px-3 py-2 text-foreground"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as Task['priority'])}
              className="rounded border border-input bg-background px-3 py-2 text-foreground"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              onClick={handleAddTask}
              className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Add Task
            </button>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium">Tasks ({tasks.length})</h3>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-muted-foreground">No tasks. Add one above!</p>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={deleteTask}
                  onStatusChange={setTaskStatus}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function TaskCard({
  task,
  onDelete,
  onStatusChange,
}: {
  task: Task
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: Task['status']) => void
}) {
  const statusColors = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  const priorityColors = {
    low: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    medium: 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
    high: 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200',
  }

  return (
    <div className="flex items-center justify-between rounded border border-border bg-background p-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground">{task.title}</p>
          <span className={cn("rounded px-2 py-0.5 text-xs font-medium", priorityColors[task.priority])}>
            {task.priority}
          </span>
        </div>
        {task.description && (
          <p className="text-sm text-muted-foreground">{task.description}</p>
        )}
      </div>
      <div className="flex gap-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
          className={cn("rounded px-2 py-1 text-xs font-medium", statusColors[task.status])}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={() => onDelete(task.id)}
          className="rounded bg-destructive px-3 py-1 text-destructive-foreground hover:bg-destructive/90"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// Notification Display - Shows notifications from UI store
// ============================================================================

function NotificationDisplay() {
  const notifications = useNotifications()
  const { removeNotification } = useUiActions()

  if (notifications.length === 0) return null

  const typeStyles = {
    info: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "flex items-center justify-between rounded-lg px-4 py-3 shadow-lg",
            typeStyles[notification.type]
          )}
        >
          <p className="mr-4">{notification.message}</p>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-white hover:opacity-80"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// Modal Component - Demonstrates modal from UI store
// ============================================================================

function ModalDemo() {
  const modal = useStore(state => state.modal)
  const { closeModal } = useUiActions()

  if (!modal.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-semibold text-card-foreground">{modal.title}</h2>
        <p className="mb-4 text-muted-foreground">{modal.content}</p>
        <button
          onClick={closeModal}
          className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Close
        </button>
      </div>
    </div>
  )
}
