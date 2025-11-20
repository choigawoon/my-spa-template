/**
 * Zustand Test Page
 *
 * Interactive demonstration of all Zustand store features:
 * - API data management (users, posts)
 * - UI state (theme, sidebar, modals, notifications)
 * - Task management (CRUD operations, filtering, sorting)
 * - Work propagation (no props drilling, direct state subscription)
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useUsers,
  useTasks,
  useApiActions,
  useUiActions,
  useTaskActions,
  useTheme,
  useSidebar,
  useNotifications,
  useApiLoading,
  useCurrentWork,
  useWorkHistory,
  useWorkLogs,
  useIsWorkInProgress,
  useWorkflowActions,
  useTaskFilter,
  useSortBy,
  useModal,
  type Task,
  type User,
  type WorkLog,
} from '@/stores'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

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
        <WorkPropagationSection />
        <NotificationDisplay />
        <ModalDemo />
      </div>
    </div>
  )
}

function Header() {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold text-foreground">
        {t('pages.zustandTest.title')}
      </h1>
      <p className="text-muted-foreground">
        {t('pages.zustandTest.description')}
      </p>
    </div>
  )
}

// ============================================================================
// API Section - Test API data management
// ============================================================================

function ApiSection() {
  const { t } = useTranslation()
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
    <Card>
      <CardHeader>
        <CardTitle>{t('pages.zustandTest.apiSection.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={fetchUsers}
          disabled={isLoading}
        >
          {isLoading ? t('pages.zustandTest.apiSection.loading') : t('pages.zustandTest.apiSection.fetchUsers')}
        </Button>

        <div className="space-y-2">
          <Label className="text-lg font-medium">{t('pages.zustandTest.apiSection.addNewUser')}</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder={t('pages.zustandTest.apiSection.namePlaceholder')}
              className="flex-1"
            />
            <Input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder={t('pages.zustandTest.apiSection.emailPlaceholder')}
              className="flex-1"
            />
            <Button
              onClick={handleAddUser}
              variant="secondary"
            >
              {t('pages.zustandTest.apiSection.add')}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-medium">{t('pages.zustandTest.apiSection.usersCount', { count: users.length })}</Label>
          <div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-muted-foreground">{t('pages.zustandTest.apiSection.noUsers')}</p>
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
      </CardContent>
    </Card>
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
  const { t } = useTranslation()
  const roles: User['role'][] = ['admin', 'user', 'guest']

  return (
    <div className="flex items-center justify-between rounded-lg border bg-background p-3">
      <div>
        <p className="font-medium text-foreground">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
      <div className="flex gap-2">
        <Select
          value={user.role}
          onValueChange={(value) => onUpdate(user.id, { role: value as User['role'] })}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => onRemove(user.id)}
          variant="destructive"
          size="sm"
        >
          {t('pages.zustandTest.apiSection.remove')}
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// UI Section - Test UI state management
// ============================================================================

function UiSection() {
  const { t } = useTranslation()
  const theme = useTheme()
  const isSidebarOpen = useSidebar()
  const { toggleSidebar, setTheme, setLanguage, openModal, addNotification } = useUiActions()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('pages.zustandTest.uiSection.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="mb-2 block text-lg font-medium">{t('pages.zustandTest.uiSection.themeControl')}</Label>
          <div className="flex gap-2">
            {(['light', 'dark', 'system'] as const).map((themeOption) => (
              <Button
                key={themeOption}
                onClick={() => setTheme(themeOption)}
                variant={theme === themeOption ? "default" : "secondary"}
                className="capitalize"
              >
                {t(`theme.${themeOption}`)}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block text-lg font-medium">{t('pages.zustandTest.uiSection.sidebarControl')}</Label>
          <Button
            onClick={toggleSidebar}
            variant="secondary"
          >
            {t('pages.zustandTest.uiSection.sidebarIs', { state: isSidebarOpen ? t('pages.zustandTest.uiSection.open') : t('pages.zustandTest.uiSection.closed') })}
          </Button>
        </div>

        <div>
          <Label className="mb-2 block text-lg font-medium">{t('pages.zustandTest.uiSection.language')}</Label>
          <div className="flex gap-2">
            {(['en', 'ko', 'ja'] as const).map((lang) => (
              <Button
                key={lang}
                onClick={() => setLanguage(lang)}
                variant="secondary"
                className="uppercase"
              >
                {lang}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block text-lg font-medium">{t('pages.zustandTest.uiSection.modal')}</Label>
          <Button
            onClick={() => openModal(t('pages.zustandTest.uiSection.modalTitle'), t('pages.zustandTest.uiSection.modalContent'))}
            variant="secondary"
          >
            {t('pages.zustandTest.uiSection.openModal')}
          </Button>
        </div>

        <div>
          <Label className="mb-2 block text-lg font-medium">{t('pages.zustandTest.uiSection.notifications')}</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => addNotification(t('pages.zustandTest.uiSection.infoNotification'), 'info')}
              variant="outline"
              className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
            >
              {t('pages.zustandTest.uiSection.info')}
            </Button>
            <Button
              onClick={() => addNotification(t('pages.zustandTest.uiSection.successNotification'), 'success')}
              variant="outline"
              className="bg-green-500 text-white hover:bg-green-600 hover:text-white"
            >
              {t('pages.zustandTest.uiSection.success')}
            </Button>
            <Button
              onClick={() => addNotification(t('pages.zustandTest.uiSection.warningNotification'), 'warning')}
              variant="outline"
              className="bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white"
            >
              {t('pages.zustandTest.uiSection.warning')}
            </Button>
            <Button
              onClick={() => addNotification(t('pages.zustandTest.uiSection.errorNotification'), 'error')}
              variant="outline"
              className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
            >
              {t('pages.zustandTest.uiSection.error')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Task Section - Test task management
// ============================================================================

function TaskSection() {
  const { t } = useTranslation()
  const tasks = useTasks()
  const filter = useTaskFilter()
  const sortBy = useSortBy()
  const { addTask, deleteTask, setTaskStatus, setFilter, setSortBy } = useTaskActions()

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium')

  const handleAddTask = () => {
    if (newTaskTitle) {
      addTask({
        title: newTaskTitle,
        description: t('pages.zustandTest.taskSection.taskDescription'),
        status: 'pending',
        priority: newTaskPriority,
      })
      setNewTaskTitle('')
    }
  }

  const filterLabels: Record<string, string> = {
    all: t('pages.zustandTest.taskSection.all'),
    pending: t('pages.zustandTest.taskSection.pending'),
    in_progress: t('pages.zustandTest.taskSection.inProgress'),
    completed: t('pages.zustandTest.taskSection.completed'),
  }

  const sortLabels: Record<string, string> = {
    createdAt: t('pages.zustandTest.taskSection.created'),
    dueDate: t('pages.zustandTest.taskSection.dueDate'),
    priority: t('pages.zustandTest.taskSection.priority'),
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('pages.zustandTest.taskSection.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <Label className="mb-2 block text-lg font-medium">{t('pages.zustandTest.taskSection.filter')}</Label>
            <div className="flex gap-2">
              {(['all', 'pending', 'in_progress', 'completed'] as const).map((f) => (
                <Button
                  key={f}
                  onClick={() => setFilter(f)}
                  variant={filter === f ? "default" : "secondary"}
                  size="sm"
                >
                  {filterLabels[f]}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <Label className="mb-2 block text-lg font-medium">{t('pages.zustandTest.taskSection.sortBy')}</Label>
            <div className="flex gap-2">
              {(['createdAt', 'dueDate', 'priority'] as const).map((s) => (
                <Button
                  key={s}
                  onClick={() => setSortBy(s)}
                  variant={sortBy === s ? "default" : "secondary"}
                  size="sm"
                >
                  {sortLabels[s]}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label className="mb-2 block text-lg font-medium">{t('pages.zustandTest.taskSection.addNewTask')}</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder={t('pages.zustandTest.taskSection.taskTitlePlaceholder')}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <Select
              value={newTaskPriority}
              onValueChange={(value) => setNewTaskPriority(value as Task['priority'])}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t('pages.zustandTest.taskSection.low')}</SelectItem>
                <SelectItem value="medium">{t('pages.zustandTest.taskSection.medium')}</SelectItem>
                <SelectItem value="high">{t('pages.zustandTest.taskSection.high')}</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddTask}>
              {t('pages.zustandTest.taskSection.addTask')}
            </Button>
          </div>
        </div>

        <div>
          <Label className="mb-2 block text-lg font-medium">{t('pages.zustandTest.taskSection.tasksCount', { count: tasks.length })}</Label>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-muted-foreground">{t('pages.zustandTest.taskSection.noTasks')}</p>
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
      </CardContent>
    </Card>
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
  const { t } = useTranslation()

  const priorityVariants: Record<Task['priority'], 'secondary' | 'warning' | 'destructive'> = {
    low: 'secondary',
    medium: 'warning',
    high: 'destructive',
  }

  return (
    <div className="flex items-center justify-between rounded-lg border bg-background p-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground">{task.title}</p>
          <Badge variant={priorityVariants[task.priority]}>
            {task.priority}
          </Badge>
        </div>
        {task.description && (
          <p className="text-sm text-muted-foreground">{task.description}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Select
          value={task.status}
          onValueChange={(value) => onStatusChange(task.id, value as Task['status'])}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">{t('pages.zustandTest.taskSection.pending')}</SelectItem>
            <SelectItem value="in_progress">{t('pages.zustandTest.taskSection.inProgress')}</SelectItem>
            <SelectItem value="completed">{t('pages.zustandTest.taskSection.completed')}</SelectItem>
            <SelectItem value="cancelled">{t('pages.zustandTest.taskSection.cancelled')}</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => onDelete(task.id)}
          variant="destructive"
          size="sm"
        >
          {t('common.delete')}
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// Work Propagation Section - Demonstrates no props drilling
// ============================================================================

function WorkPropagationSection() {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('pages.zustandTest.workSection.title')}</CardTitle>
        <CardDescription>
          {t('pages.zustandTest.workSection.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <WorkflowControls />
        <div className="grid gap-4 lg:grid-cols-2">
          <ComponentLevel1 />
          <WorkflowLogs />
        </div>
        <WorkHistoryDisplay />
      </CardContent>
    </Card>
  )
}

function WorkflowControls() {
  const { t } = useTranslation()
  const isWorkInProgress = useIsWorkInProgress()
  const { simulateWork, cancelWork, clearHistory, clearLogs } = useWorkflowActions()
  const [workName, setWorkName] = useState('')

  const handleSimulateWork = () => {
    if (workName.trim()) {
      simulateWork(workName, 3000)
      setWorkName('')
    }
  }

  return (
    <div className="rounded-lg border bg-background p-4">
      <h3 className="mb-3 text-lg font-semibold text-foreground">
        {t('pages.zustandTest.workSection.level0.title')}
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">
        {t('pages.zustandTest.workSection.level0.subscribesTo')} <code className="rounded bg-muted px-1 py-0.5">isWorkInProgress</code>,{' '}
        <code className="rounded bg-muted px-1 py-0.5">workflowActions</code>
      </p>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="text"
            value={workName}
            onChange={(e) => setWorkName(e.target.value)}
            placeholder={t('pages.zustandTest.workSection.level0.workNamePlaceholder')}
            disabled={isWorkInProgress}
            onKeyDown={(e) => e.key === 'Enter' && handleSimulateWork()}
          />
          <Button
            onClick={handleSimulateWork}
            disabled={isWorkInProgress || !workName.trim()}
          >
            {isWorkInProgress ? t('pages.zustandTest.workSection.level0.working') : t('pages.zustandTest.workSection.level0.simulateWork')}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={cancelWork}
            disabled={!isWorkInProgress}
            variant="destructive"
            size="sm"
          >
            {t('pages.zustandTest.workSection.level0.cancelWork')}
          </Button>
          <Button
            onClick={clearHistory}
            variant="secondary"
            size="sm"
          >
            {t('pages.zustandTest.workSection.level0.clearHistory')}
          </Button>
          <Button
            onClick={clearLogs}
            variant="secondary"
            size="sm"
          >
            {t('pages.zustandTest.workSection.level0.clearLogs')}
          </Button>
        </div>
      </div>
    </div>
  )
}

function ComponentLevel1() {
  const { t } = useTranslation()
  const currentWork = useCurrentWork()

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-blue-500/30 bg-blue-500/5 p-4">
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {t('pages.zustandTest.workSection.level1.title')}
        </h3>
        <p className="mb-3 text-xs text-muted-foreground">
          {t('pages.zustandTest.workSection.level1.subscribesTo')} <code className="rounded bg-muted px-1 py-0.5">currentWork</code>
          <br />
          {t('pages.zustandTest.workSection.level1.propsReceived')} <code className="rounded bg-muted px-1 py-0.5">{t('pages.zustandTest.workSection.level1.none')}</code>
        </p>

        {currentWork ? (
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-foreground">{currentWork.name}</p>
              <p className="text-xs text-muted-foreground">{t('pages.zustandTest.workSection.level1.status')} {currentWork.status}</p>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span>{t('pages.zustandTest.workSection.level1.progress')}</span>
                <span>{currentWork.progress}%</span>
              </div>
              <Progress value={currentWork.progress} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('pages.zustandTest.workSection.level1.noWorkInProgress')}</p>
        )}
      </div>

      <ComponentLevel2 />
    </div>
  )
}

function ComponentLevel2() {
  const { t } = useTranslation()
  const allLogs = useWorkLogs()
  const recentLogs = allLogs.slice(0, 3)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-green-500/30 bg-green-500/5 p-4">
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {t('pages.zustandTest.workSection.level2.title')}
        </h3>
        <p className="mb-3 text-xs text-muted-foreground">
          {t('pages.zustandTest.workSection.level2.subscribesTo')} <code className="rounded bg-muted px-1 py-0.5">workLogs</code>
          <br />
          {t('pages.zustandTest.workSection.level2.propsReceived')} <code className="rounded bg-muted px-1 py-0.5">{t('pages.zustandTest.workSection.level2.none')}</code>
        </p>

        {recentLogs.length > 0 ? (
          <div className="space-y-1">
            {recentLogs.map((log) => (
              <LogEntry key={log.id} log={log} compact />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('pages.zustandTest.workSection.level2.noLogs')}</p>
        )}
      </div>

      <ComponentLevel3 />
    </div>
  )
}

function ComponentLevel3() {
  const { t } = useTranslation()
  const workHistory = useWorkHistory()

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-purple-500/30 bg-purple-500/5 p-4">
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {t('pages.zustandTest.workSection.level3.title')}
        </h3>
        <p className="mb-3 text-xs text-muted-foreground">
          {t('pages.zustandTest.workSection.level3.subscribesTo')} <code className="rounded bg-muted px-1 py-0.5">workHistory</code>
          <br />
          {t('pages.zustandTest.workSection.level3.propsReceived')} <code className="rounded bg-muted px-1 py-0.5">{t('pages.zustandTest.workSection.level3.none')}</code>
        </p>

        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">{workHistory.length}</div>
          <div className="text-sm text-muted-foreground">{t('pages.zustandTest.workSection.level3.completedWorks')}</div>
        </div>
      </div>

      <ComponentLevel4 />
    </div>
  )
}

function ComponentLevel4() {
  const { t } = useTranslation()
  const isWorkInProgress = useIsWorkInProgress()

  return (
    <div className="rounded-lg border-2 border-orange-500/30 bg-orange-500/5 p-4">
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        {t('pages.zustandTest.workSection.level4.title')}
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">
        {t('pages.zustandTest.workSection.level4.subscribesTo')} <code className="rounded bg-muted px-1 py-0.5">isWorkInProgress</code>
        <br />
        {t('pages.zustandTest.workSection.level4.propsReceived')} <code className="rounded bg-muted px-1 py-0.5">{t('pages.zustandTest.workSection.level4.none')}</code>
      </p>

      <div className="flex items-center justify-center gap-2 rounded bg-background p-3">
        <div
          className={cn(
            "h-3 w-3 rounded-full transition-colors",
            isWorkInProgress ? "animate-pulse bg-green-500" : "bg-gray-400"
          )}
        />
        <span className="text-sm font-medium">
          {isWorkInProgress ? t('pages.zustandTest.workSection.level4.systemActive') : t('pages.zustandTest.workSection.level4.systemIdle')}
        </span>
      </div>
    </div>
  )
}

function WorkflowLogs() {
  const { t } = useTranslation()
  const logs = useWorkLogs()

  return (
    <div className="rounded-lg border bg-background p-4">
      <h3 className="mb-3 text-lg font-semibold text-foreground">
        {t('pages.zustandTest.workSection.liveLogs', { count: logs.length })}
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">
        {t('pages.zustandTest.workSection.level2.subscribesTo')} <code className="rounded bg-muted px-1 py-0.5">workLogs</code>
      </p>

      <div className="max-h-64 space-y-1 overflow-y-auto">
        {logs.length > 0 ? (
          logs.map((log) => <LogEntry key={log.id} log={log} />)
        ) : (
          <p className="text-center text-sm text-muted-foreground">{t('pages.zustandTest.workSection.noLogsYet')}</p>
        )}
      </div>
    </div>
  )
}

function WorkHistoryDisplay() {
  const { t } = useTranslation()
  const history = useWorkHistory()

  if (history.length === 0) return null

  return (
    <div className="rounded-lg border bg-background p-4">
      <h3 className="mb-3 text-lg font-semibold text-foreground">
        {t('pages.zustandTest.workSection.workHistory', { count: history.length })}
      </h3>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {history.map((work) => (
          <div
            key={work.id}
            className={cn(
              "rounded border p-3",
              work.status === 'completed' && "border-green-500/50 bg-green-500/10",
              work.status === 'error' && "border-red-500/50 bg-red-500/10"
            )}
          >
            <p className="mb-1 text-sm font-medium text-foreground">{work.name}</p>
            <div className="text-xs text-muted-foreground">
              <p>{t('pages.zustandTest.workSection.level1.status')} {work.status}</p>
              {work.error && <p className="text-red-500">{t('common.error')}: {work.error}</p>}
              {work.startTime && work.endTime && (
                <p>{t('pages.zustandTest.workSection.duration', { time: ((work.endTime - work.startTime) / 1000).toFixed(2) })}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LogEntry({ log, compact = false }: { log: WorkLog; compact?: boolean }) {
  const levelVariants: Record<WorkLog['level'], 'info' | 'success' | 'warning' | 'destructive'> = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'destructive',
  }

  const time = new Date(log.timestamp).toLocaleTimeString()

  return (
    <div className={cn("rounded bg-muted p-2", compact && "p-1.5")}>
      <div className="flex items-start gap-2">
        <Badge variant={levelVariants[log.level]} className="text-[10px]">
          {log.level.toUpperCase()}
        </Badge>
        <span className={cn("flex-1 text-xs text-foreground", compact && "text-[10px]")}>
          {log.message}
        </span>
        {!compact && <span className="text-[10px] text-muted-foreground">{time}</span>}
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
          <Button
            onClick={() => removeNotification(notification.id)}
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// Modal Component - Demonstrates modal from UI store
// ============================================================================

function ModalDemo() {
  const modal = useModal()
  const { closeModal } = useUiActions()

  return (
    <Dialog open={modal.isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modal.title}</DialogTitle>
          <DialogDescription>{modal.content}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={closeModal}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
