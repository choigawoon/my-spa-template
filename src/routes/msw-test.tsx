import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type {
  Item,
  User,
  ItemsListResponse,
  UsersListResponse,
} from '@/mocks/schemas'

export const Route = createFileRoute('/msw-test')({
  component: MswTestPage,
})

interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
  loading: boolean
}

function MswTestPage() {
  // Health check state
  const [healthResponse, setHealthResponse] = useState<ApiResponse>({
    data: null,
    error: null,
    loading: false,
  })

  // Items state
  const [itemsResponse, setItemsResponse] =
    useState<ApiResponse<ItemsListResponse>>({
      data: null,
      error: null,
      loading: false,
    })

  const [singleItemResponse, setSingleItemResponse] = useState<
    ApiResponse<Item>
  >({
    data: null,
    error: null,
    loading: false,
  })

  // Users state
  const [usersResponse, setUsersResponse] =
    useState<ApiResponse<UsersListResponse>>({
      data: null,
      error: null,
      loading: false,
    })

  // Create item state
  const [newItemName, setNewItemName] = useState('')
  const [newItemDescription, setNewItemDescription] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [createItemResponse, setCreateItemResponse] = useState<ApiResponse>({
    data: null,
    error: null,
    loading: false,
  })

  // Login state
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin')
  const [loginResponse, setLoginResponse] = useState<ApiResponse>({
    data: null,
    error: null,
    loading: false,
  })

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResponse, setSearchResponse] = useState<ApiResponse>({
    data: null,
    error: null,
    loading: false,
  })

  // API call handlers
  const checkHealth = async () => {
    setHealthResponse({ data: null, error: null, loading: true })
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealthResponse({ data, error: null, loading: false })
    } catch (error) {
      setHealthResponse({
        data: null,
        error: (error as Error).message,
        loading: false,
      })
    }
  }

  const fetchItems = async () => {
    setItemsResponse({ data: null, error: null, loading: true })
    try {
      const response = await fetch('/api/items')
      const data = await response.json()
      setItemsResponse({ data, error: null, loading: false })
    } catch (error) {
      setItemsResponse({
        data: null,
        error: (error as Error).message,
        loading: false,
      })
    }
  }

  const fetchSingleItem = async (id: number) => {
    setSingleItemResponse({ data: null, error: null, loading: true })
    try {
      const response = await fetch(`/api/items/${id}`)
      if (!response.ok) {
        throw new Error('Item not found')
      }
      const data = await response.json()
      setSingleItemResponse({ data, error: null, loading: false })
    } catch (error) {
      setSingleItemResponse({
        data: null,
        error: (error as Error).message,
        loading: false,
      })
    }
  }

  const fetchUsers = async () => {
    setUsersResponse({ data: null, error: null, loading: true })
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsersResponse({ data, error: null, loading: false })
    } catch (error) {
      setUsersResponse({
        data: null,
        error: (error as Error).message,
        loading: false,
      })
    }
  }

  const createItem = async () => {
    if (!newItemName || !newItemDescription || !newItemPrice) {
      setCreateItemResponse({
        data: null,
        error: 'All fields are required',
        loading: false,
      })
      return
    }

    setCreateItemResponse({ data: null, error: null, loading: true })
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newItemName,
          description: newItemDescription,
          price: Number(newItemPrice),
          category: '전자제품',
        }),
      })
      const data = await response.json()
      setCreateItemResponse({ data, error: null, loading: false })
      // Reset form
      setNewItemName('')
      setNewItemDescription('')
      setNewItemPrice('')
      // Refresh items list
      fetchItems()
    } catch (error) {
      setCreateItemResponse({
        data: null,
        error: (error as Error).message,
        loading: false,
      })
    }
  }

  const deleteItem = async (id: number) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      console.log('Item deleted:', data)
      // Refresh items list
      fetchItems()
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  const login = async () => {
    setLoginResponse({ data: null, error: null, loading: true })
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (!response.ok) {
        setLoginResponse({ data: null, error: data.detail, loading: false })
      } else {
        setLoginResponse({ data, error: null, loading: false })
      }
    } catch (error) {
      setLoginResponse({
        data: null,
        error: (error as Error).message,
        loading: false,
      })
    }
  }

  const search = async () => {
    if (!searchQuery) {
      return
    }
    setSearchResponse({ data: null, error: null, loading: true })
    try {
      const response = await fetch(`/api/search?q=${searchQuery}`)
      const data = await response.json()
      setSearchResponse({ data, error: null, loading: false })
    } catch (error) {
      setSearchResponse({
        data: null,
        error: (error as Error).message,
        loading: false,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            MSW (Mock Service Worker) 테스트
          </h1>
          <p className="mt-2 text-muted-foreground">
            FastAPI 스타일의 모킹된 백엔드 API를 테스트해보세요
          </p>
        </div>

        {/* Health Check Section */}
        <section className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            1. Health Check
          </h2>
          <button
            onClick={checkHealth}
            disabled={healthResponse.loading}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {healthResponse.loading ? 'Loading...' : 'Check Health'}
          </button>
          {healthResponse.data && (
            <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-4 text-sm">
              {JSON.stringify(healthResponse.data, null, 2)}
            </pre>
          )}
          {healthResponse.error && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              Error: {healthResponse.error}
            </div>
          )}
        </section>

        {/* Items List Section */}
        <section className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            2. Items List (GET /api/items)
          </h2>
          <button
            onClick={fetchItems}
            disabled={itemsResponse.loading}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {itemsResponse.loading ? 'Loading...' : 'Fetch Items'}
          </button>
          {itemsResponse.data && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-muted-foreground">
                Total: {itemsResponse.data.total} items
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {itemsResponse.data.items.map((item) => (
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
                        onClick={() => fetchSingleItem(item.id)}
                        className="rounded bg-secondary px-3 py-1 text-sm text-secondary-foreground hover:bg-secondary/90"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="rounded bg-destructive px-3 py-1 text-sm text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {itemsResponse.error && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              Error: {itemsResponse.error}
            </div>
          )}
        </section>

        {/* Single Item Section */}
        {singleItemResponse.data && (
          <section className="mb-8 rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
              Item Details
            </h2>
            <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
              {JSON.stringify(singleItemResponse.data, null, 2)}
            </pre>
          </section>
        )}

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
              onClick={createItem}
              disabled={createItemResponse.loading}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {createItemResponse.loading ? 'Creating...' : 'Create Item'}
            </button>
          </div>
          {createItemResponse.data && (
            <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-4 text-sm">
              {JSON.stringify(createItemResponse.data, null, 2)}
            </pre>
          )}
          {createItemResponse.error && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              Error: {createItemResponse.error}
            </div>
          )}
        </section>

        {/* Users Section */}
        <section className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            4. Users List (GET /api/users)
          </h2>
          <button
            onClick={fetchUsers}
            disabled={usersResponse.loading}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {usersResponse.loading ? 'Loading...' : 'Fetch Users'}
          </button>
          {usersResponse.data && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-muted-foreground">
                Total: {usersResponse.data.total} users
              </p>
              <div className="space-y-2">
                {usersResponse.data.users.map((user) => (
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
                        className={`rounded-full px-3 py-1 text-xs ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {usersResponse.error && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              Error: {usersResponse.error}
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
              onClick={login}
              disabled={loginResponse.loading}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loginResponse.loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="text-sm text-muted-foreground">
              Hint: username=admin, password=admin
            </p>
          </div>
          {loginResponse.data && (
            <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-4 text-sm">
              {JSON.stringify(loginResponse.data, null, 2)}
            </pre>
          )}
          {loginResponse.error && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              Error: {loginResponse.error}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2"
              placeholder="Search items..."
            />
            <button
              onClick={search}
              disabled={searchResponse.loading}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {searchResponse.loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {searchResponse.data && (
            <div className="mt-4">
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                {JSON.stringify(searchResponse.data, null, 2)}
              </pre>
            </div>
          )}
          {searchResponse.error && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              Error: {searchResponse.error}
            </div>
          )}
        </section>

        {/* API Documentation */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            📚 Available API Endpoints
          </h2>
          <div className="space-y-2 text-sm">
            <div className="rounded-md bg-muted p-3">
              <span className="font-mono font-semibold text-green-600">
                GET
              </span>{' '}
              <span className="font-mono">/api/health</span> - Health check
            </div>
            <div className="rounded-md bg-muted p-3">
              <span className="font-mono font-semibold text-green-600">
                GET
              </span>{' '}
              <span className="font-mono">/api/items</span> - List all items
            </div>
            <div className="rounded-md bg-muted p-3">
              <span className="font-mono font-semibold text-green-600">
                GET
              </span>{' '}
              <span className="font-mono">/api/items/:id</span> - Get single
              item
            </div>
            <div className="rounded-md bg-muted p-3">
              <span className="font-mono font-semibold text-blue-600">
                POST
              </span>{' '}
              <span className="font-mono">/api/items</span> - Create new item
            </div>
            <div className="rounded-md bg-muted p-3">
              <span className="font-mono font-semibold text-yellow-600">
                PUT
              </span>{' '}
              <span className="font-mono">/api/items/:id</span> - Update item
            </div>
            <div className="rounded-md bg-muted p-3">
              <span className="font-mono font-semibold text-red-600">
                DELETE
              </span>{' '}
              <span className="font-mono">/api/items/:id</span> - Delete item
            </div>
            <div className="rounded-md bg-muted p-3">
              <span className="font-mono font-semibold text-green-600">
                GET
              </span>{' '}
              <span className="font-mono">/api/users</span> - List all users
            </div>
            <div className="rounded-md bg-muted p-3">
              <span className="font-mono font-semibold text-blue-600">
                POST
              </span>{' '}
              <span className="font-mono">/api/auth/login</span> - Login
            </div>
            <div className="rounded-md bg-muted p-3">
              <span className="font-mono font-semibold text-green-600">
                GET
              </span>{' '}
              <span className="font-mono">/api/search?q=query</span> - Search
              items
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
