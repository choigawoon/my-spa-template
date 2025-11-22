import { createFileRoute, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Eye, Calendar, User, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/api/client'
import type { ContentEntity } from '@/db'
import { addRecentItem } from '@/db'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/db-test/$id')({
  component: SharedContentPage,
})

interface Content extends ContentEntity {
  id: number
}

function SharedContentPage() {
  const { t } = useTranslation()
  const { id } = Route.useParams()
  const [copied, setCopied] = useState(false)

  // Fetch content by ID
  const { data, isLoading, error } = useQuery({
    queryKey: ['content', id],
    queryFn: () => apiClient.get<Content>(`/api/contents/${id}`),
  })

  // Add to recent items when content is loaded
  useEffect(() => {
    if (data?.id) {
      addRecentItem('content', data.id)
    }
  }, [data?.id])

  const copyShareUrl = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <p className="text-center">{t('common.loading')}</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500 mb-4">{t('pages.dbTest.contentNotFound')}</p>
            <div className="text-center">
              <Link to="/db-test">
                <Button variant="outline">
                  <ArrowLeft size={16} className="mr-2" />
                  {t('pages.dbTest.backToList')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-4">
        <Link to="/db-test">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            {t('pages.dbTest.backToList')}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">{data.title}</CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Eye size={12} />
              {data.view_count}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <User size={14} />
              {data.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(data.created_at).toLocaleDateString()}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none mb-6">
            <p className="whitespace-pre-wrap">{data.content}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex flex-wrap gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={copyShareUrl}
                className="flex items-center gap-1"
              >
                <Share2 size={14} />
                {copied ? t('pages.dbTest.copied') : t('pages.dbTest.shareUrl')}
              </Button>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              <p>ID: {data.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
