import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export const Route = createFileRoute('/msw-test')({
  component: MswTestPage,
})

function MswTestPage() {
  const { t } = useTranslation()

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
      alert(t('pages.mswTest.createItem.allFieldsRequired'))
      return
    }

    const itemData: ItemCreate = {
      name: newItemName,
      description: newItemDescription,
      price: Number(newItemPrice),
      category: 'Electronics',
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
            {t('pages.mswTest.title')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t('pages.mswTest.description')}
          </p>
          <p className="mt-1 text-sm text-primary">
            {t('pages.mswTest.devToolsHint')}
          </p>
        </div>

        {/* Health Check Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('pages.mswTest.healthCheck.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => refetchHealth()}
              disabled={healthLoading}
            >
              {healthLoading ? t('pages.mswTest.healthCheck.loading') : t('pages.mswTest.healthCheck.button')}
            </Button>
            {healthData && (
              <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-4 text-sm">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            )}
            {healthError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  {t('common.error')}: {healthError.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Items List Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('pages.mswTest.itemsList.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => refetchItems()}
              disabled={itemsLoading}
            >
              {itemsLoading ? t('pages.mswTest.itemsList.loading') : t('pages.mswTest.itemsList.fetchButton')}
            </Button>
            {itemsData && itemsData.items && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-muted-foreground">
                  {t('pages.mswTest.itemsList.total', { count: itemsData.total })}
                </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {itemsData.items.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <p className="mt-2 font-bold">
                          ₩{item.price.toLocaleString()}
                        </p>
                        <div className="mt-4 flex gap-2">
                          <Button
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={deleteItemMutation.isPending}
                            variant="destructive"
                            size="sm"
                          >
                            {deleteItemMutation.isPending ? t('pages.mswTest.itemsList.deleting') : t('pages.mswTest.itemsList.delete')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {itemsError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  {t('common.error')}: {itemsError.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Create Item Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('pages.mswTest.createItem.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1 block">{t('pages.mswTest.createItem.nameLabel')}</Label>
              <Input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={t('pages.mswTest.createItem.namePlaceholder')}
              />
            </div>
            <div>
              <Label className="mb-1 block">
                {t('pages.mswTest.createItem.descriptionLabel')}
              </Label>
              <Input
                type="text"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder={t('pages.mswTest.createItem.descriptionPlaceholder')}
              />
            </div>
            <div>
              <Label className="mb-1 block">{t('pages.mswTest.createItem.priceLabel')}</Label>
              <Input
                type="number"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder={t('pages.mswTest.createItem.pricePlaceholder')}
              />
            </div>
            <Button
              onClick={handleCreateItem}
              disabled={createItemMutation.isPending}
            >
              {createItemMutation.isPending ? t('pages.mswTest.createItem.creating') : t('pages.mswTest.createItem.button')}
            </Button>
            {createItemMutation.isSuccess && createItemMutation.data && (
              <Alert variant="success" className="mt-4">
                <AlertDescription>
                  {t('pages.mswTest.createItem.success')}
                  <pre className="mt-2 text-xs">
                    {JSON.stringify(createItemMutation.data, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            )}
            {createItemMutation.isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  {t('common.error')}: {createItemMutation.error.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Users Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('pages.mswTest.usersList.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => refetchUsers()}
              disabled={usersLoading}
            >
              {usersLoading ? t('pages.mswTest.usersList.loading') : t('pages.mswTest.usersList.fetchButton')}
            </Button>
            {usersData && usersData.users && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-muted-foreground">
                  {t('pages.mswTest.usersList.total', { count: usersData.total })}
                </p>
                <div className="space-y-2">
                  {usersData.users.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{user.full_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              @{user.username} • {user.email}
                            </p>
                          </div>
                          <Badge variant={user.is_active ? 'success' : 'destructive'}>
                            {user.is_active ? t('pages.mswTest.usersList.active') : t('pages.mswTest.usersList.inactive')}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {usersError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  {t('common.error')}: {usersError.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Login Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('pages.mswTest.login.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1 block">
                {t('pages.mswTest.login.usernameLabel')}
              </Label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
              />
            </div>
            <div>
              <Label className="mb-1 block">
                {t('pages.mswTest.login.passwordLabel')}
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin"
              />
            </div>
            <Button
              onClick={handleLogin}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? t('pages.mswTest.login.loggingIn') : t('pages.mswTest.login.button')}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t('pages.mswTest.login.hint')}
            </p>
            {loginMutation.isSuccess && loginMutation.data && (
              <Alert variant="success" className="mt-4">
                <AlertDescription>
                  {t('pages.mswTest.login.success')}
                  <pre className="mt-2 overflow-x-auto text-xs">
                    {JSON.stringify(loginMutation.data, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            )}
            {loginMutation.isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  {t('common.error')}: {loginMutation.error.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('pages.mswTest.search.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
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
                placeholder={t('pages.mswTest.search.placeholder')}
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={searchLoading}
              >
                {searchLoading ? t('pages.mswTest.search.searching') : t('pages.mswTest.search.button')}
              </Button>
            </div>
            {searchData && searchData.results && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-muted-foreground">
                  {t('pages.mswTest.search.results', { count: searchData.total, query: searchData.query })}
                </p>
                <div className="space-y-2">
                  {searchData.results.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-3">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <p className="mt-1 font-bold">
                          ₩{item.price.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {searchError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  {t('common.error')}: {searchError.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>{t('pages.mswTest.benefits.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-md bg-muted p-3">
              {t('pages.mswTest.benefits.caching')}
            </div>
            <div className="rounded-md bg-muted p-3">
              {t('pages.mswTest.benefits.refresh')}
            </div>
            <div className="rounded-md bg-muted p-3">
              {t('pages.mswTest.benefits.states')}
            </div>
            <div className="rounded-md bg-muted p-3">
              {t('pages.mswTest.benefits.devtools')}
            </div>
            <div className="rounded-md bg-muted p-3">
              {t('pages.mswTest.benefits.switching')}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
