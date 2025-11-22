import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Share2, Eye, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/api/client'
import type { ContentEntity } from '@/db'
import { saveDraft, getDraft, deleteDraft } from '@/db'

export const Route = createFileRoute('/db-test')({
  component: DbTestPage,
})

interface Content extends ContentEntity {
  id: number
}

interface ContentsResponse {
  contents: Content[]
  total: number
}

function DbTestPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  // Fetch contents list
  const { data, isLoading, error } = useQuery({
    queryKey: ['contents'],
    queryFn: () => apiClient.get<ContentsResponse>('/api/contents'),
  })

  // Create content mutation
  const createMutation = useMutation({
    mutationFn: (newContent: { title: string; content: string; author: string }) =>
      apiClient.post<Content>('/api/contents', newContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] })
      setTitle('')
      setContent('')
      setAuthor('')
      // Clear draft after successful save
      deleteDraft(0).catch(() => {})
    },
  })

  // Delete content mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/api/contents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] })
    },
  })

  // Auto-save draft to FrontendDB
  const handleContentChange = async (value: string) => {
    setContent(value)
    if (title || value || author) {
      await saveDraft('content', { title, content: value, author })
    }
  }

  // Load draft on mount
  const loadDraft = async () => {
    const draft = await getDraft('content')
    if (draft) {
      const data = draft.content as { title?: string; content?: string; author?: string }
      if (data.title) setTitle(data.title)
      if (data.content) setContent(data.content)
      if (data.author) setAuthor(data.author)
    }
  }

  // Load draft on component mount
  useState(() => {
    loadDraft()
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !author.trim()) return
    createMutation.mutate({ title, content, author })
  }

  const copyShareUrl = (item: Content) => {
    const url = `${window.location.origin}/db-test/${item.id}`
    navigator.clipboard.writeText(url)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{t('pages.dbTest.title')}</h1>
      <p className="text-gray-600 mb-8">{t('pages.dbTest.description')}</p>

      {/* Create Content Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={20} />
            {t('pages.dbTest.createContent')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">{t('pages.dbTest.titleLabel')}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('pages.dbTest.titlePlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="content">{t('pages.dbTest.contentLabel')}</Label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={t('pages.dbTest.contentPlaceholder')}
                className="w-full min-h-[100px] px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <Label htmlFor="author">{t('pages.dbTest.authorLabel')}</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={t('pages.dbTest.authorPlaceholder')}
              />
            </div>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? t('common.saving') : t('pages.dbTest.saveAndShare')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contents List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('pages.dbTest.sharedContents')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>{t('common.loading')}</p>}
          {error && <p className="text-red-500">{t('common.error')}</p>}
          {data?.contents.length === 0 && (
            <p className="text-gray-500">{t('pages.dbTest.noContents')}</p>
          )}
          <div className="space-y-4">
            {data?.contents.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-500">
                      {t('pages.dbTest.by')} {item.author}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Eye size={12} />
                      {item.view_count}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-600 mb-3 line-clamp-2">{item.content}</p>
                <div className="flex flex-wrap gap-2">
                  <Link to="/db-test/$id" params={{ id: item.id.toString() }}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <ExternalLink size={14} />
                      {t('pages.dbTest.view')}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyShareUrl(item)}
                    className="flex items-center gap-1"
                  >
                    <Share2 size={14} />
                    {copiedId === item.id ? t('pages.dbTest.copied') : t('pages.dbTest.share')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                    {t('pages.dbTest.delete')}
                  </Button>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  ID: {item.id}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
