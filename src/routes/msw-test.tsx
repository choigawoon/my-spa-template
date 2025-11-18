import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  useHealthCheck,
  useItems,
  useCreateItem,
  useDeleteItem,
  useUsers,
  useLogin,
  useSearch,
} from '@/api/services'
import type { ItemCreate } from '@/mocks/schemas'

export const Route = createFileRoute('/msw-test')({
  component: MswTestPage,
})

function MswTestPage() {
  // Health check
  const { data: healthData, isLoading: healthLoading, error: healthError, refetch: refetchHealth } = useHealthCheck()

  // Items
  const { data: itemsData, isLoading: itemsLoading, error: itemsError, refetch: refetchItems } = useItems()
  const createItemMutation = useCreateItem()
  const deleteItemMutation = useDeleteItem()

  // Users
  const { data: usersData, isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useUsers()

  // Create item form state
  const [newItemName, setNewItemName] = useState('')
  const [newItemDescription, setNewItemDescription] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')

  // Login state
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin')
  const loginMutation = useLogin()

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchEnabled, setSearchEnabled] = useState(false)
  const { data: searchData, isLoading: searchLoading, error: searchError } = useSearch(
    searchEnabled ? searchQuery : ''
  )

  // Create item handler
  const handleCreateItem = () => {
    if (!newItemName || !newItemDescription || !newItemPrice) {
      alert('All fields are required')
      return
    }

    const itemData: ItemCreate = {
      name: newItemName,
      description: newItemDescription,
      price: Number(newItemPrice),
      category: '전자제품',
    }

    createItemMutation.mutate(itemData, {
      onSuccess: () => {
        // Reset form
        setNewItemName('')
        setNewItemDescription('')
        setNewItemPrice('')
      },
    })
  }

  // Delete item handler
  const handleDeleteItem = (id: number) => {
    deleteItemMutation.mutate(id)
  }

  // Login handler
  const handleLogin = () => {
    loginMutation.mutate({ username, password })
  }

  // Search handler
  const handleSearch = () => {
    if (searchQuery) {
      setSearchEnabled(true)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            MSW + TanStack Query 테스트
          </h1>
          <p className="mt-2 text-muted-foreground">
            FastAPI 스타일의 모킹된 백엔드 API를 TanStack Query로 테스트해보세요
          </p>
          <p className="mt-1 text-sm text-primary">
            ✨ React Query DevTools를 열어서 캐싱과 상태를 확인해보세요!
          </p>
        </div>

        {/* Health Check Section */}
        <section className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            1. Health Check
          </h2>
          <button
            onClick={() => refetchHealth()}
            disabled={healthLoading}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {healthLoading ? 'Loading...' : 'Check Health'}
          </button>
          {healthData && (
            <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-4 text-sm">
              {JSON.stringify(healthData, null, 2)}
            </pre>
          )}
          {healthError && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              Error: {healthError.message}
            </div>
          )}
        </section>

        {/* Items List Section */}
        <section className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            2. Items List (GET /api/items)
          </h2>
          <button
            onClick={() => refetchItems()}
            disabled={itemsLoading}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {itemsLoading ? 'Loading...' : 'Fetch Items'}
          </button>
          {itemsData && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-muted-foreground">
                Total: {itemsData.total} items (캐시된 데이터)
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {itemsData.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-border bg-background p-4"
                  >
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-2 font-bold">
                      ₩{item.price.toLocaleString()}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={deleteItemMutation.isPending}
                        className="rounded bg-destructive px-3 py-1 text-sm text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                      >
                        {deleteItemMutation.isPending ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {itemsError && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              Error: {itemsError.message}
            </div>
          )}
        </section>

        {/* Create Item Section */}
        <section className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            3. Create Item (POST /api/items)
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="상품명"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>
              <input
                type="text"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="상품 설명"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Price</label>
              <input
                type="number"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="가격"
              />
            </div>
            <button
              onClick={handleCreateItem}
              disabled={createItemMutation.isPending}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {createItemMutation.isPending ? 'Creating...' : 'Create Item'}
            </button>
          </div>
          {createItemMutation.isSuccess && createItemMutation.data && (
            <div className="mt-4 rounded-md bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-300">
              ✓ Item created successfully! (자동으로 리스트가 새로고침됩니다)
              <pre className="mt-2 text-xs">
                {JSON.stringify(createItemMutation.data, null, 2)}
              </pre>
            </div>
          )}
          {createItemMutation.isError && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              Error: {createItemMutation.error.message}
            </div>
          )}
        </section>

        {/* Users Section */}
        <section className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            4. Users List (GET /api/users)
          </h2>
          <button
            onClick={() => refetchUsers()}
            disabled={usersLoading}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {usersLoading ? 'Loading...' : 'Fetch Users'}
          </button>
          {usersData && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-muted-foreground">
                Total: {usersData.total} users
              </p>
              <div className="space-y-2">
                {usersData.users.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-md border border-border bg-background p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{user.full_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          @{user.username} • {user.email}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${user.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'}`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {usersError && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              Error: {usersError.message}
            </div>
          )}
        </section>

        {/* Login Section */}
        <section className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            5. Login (POST /api/auth/login)
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="admin"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loginMutation.isPending}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </button>
            <p className="text-sm text-muted-foreground">
              Hint: username=admin, password=admin
            </p>
          </div>
          {loginMutation.isSuccess && loginMutation.data && (
            <div className="mt-4 rounded-md bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-300">
              ✓ Login successful! Token stored in localStorage
              <pre className="mt-2 overflow-x-auto text-xs">
                {JSON.stringify(loginMutation.data, null, 2)}
              </pre>
            </div>
          )}
          {loginMutation.isError && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              Error: {loginMutation.error.message}
            </div>
          )}
        </section>

        {/* Search Section */}
        <section className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            6. Search (GET /api/search?q=query)
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSearchEnabled(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2"
              placeholder="Search items..."
            />
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {searchData && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-muted-foreground">
                Found {searchData.total} results for "{searchData.query}"
              </p>
              <div className="space-y-2">
                {searchData.results.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-border bg-background p-3"
                  >
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-1 font-bold">
                      ₩{item.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {searchError && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              Error: {searchError.message}
            </div>
          )}
        </section>

        {/* API Documentation */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            📚 TanStack Query 장점
          </h2>
          <div className="space-y-3 text-sm">
            <div className="rounded-md bg-muted p-3">
              <strong>✅ 자동 캐싱:</strong> 데이터가 자동으로 캐시되어 불필요한 API 호출을 줄입니다
            </div>
            <div className="rounded-md bg-muted p-3">
              <strong>✅ 자동 새로고침:</strong> Mutation 후 관련 쿼리가 자동으로 무효화됩니다
            </div>
            <div className="rounded-md bg-muted p-3">
              <strong>✅ 로딩/에러 상태:</strong> isLoading, isError, isPending이 자동 관리됩니다
            </div>
            <div className="rounded-md bg-muted p-3">
              <strong>✅ DevTools:</strong> React Query DevTools로 상태를 실시간 확인할 수 있습니다
            </div>
            <div className="rounded-md bg-muted p-3">
              <strong>✅ 백엔드 전환:</strong> .env 파일의 VITE_API_MODE를 'real'로 변경하면 실제 백엔드로 전환됩니다
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
