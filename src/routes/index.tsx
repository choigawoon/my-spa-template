import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import logo from '../logo.svg'
import { LanguageSelector } from '@/components/LanguageSelector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { t } = useTranslation()

  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <img
          src={logo}
          className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <h1 className="text-4xl font-bold mb-4">{t('pages.home.title')}</h1>
        <p className="mb-4 max-w-md">
          {t('pages.home.description')}
        </p>

        {/* i18n Demo Section */}
        <Card className="mt-8 max-w-lg bg-gray-700/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-xl text-white">{t('language.select')}</CardTitle>
          </CardHeader>
          <CardContent>
            <LanguageSelector variant="buttons" className="justify-center" />

            <div className="mt-6 text-left text-sm space-y-2 text-gray-200">
              <p><strong>{t('common.loading')}</strong></p>
              <p><strong>{t('common.save')}</strong> / <strong>{t('common.cancel')}</strong></p>
              <p><strong>{t('form.name')}:</strong> {t('form.required')}</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex gap-4">
          <Button variant="link" asChild className="text-[#61dafb]">
            <a
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </Button>
          <Button variant="link" asChild className="text-[#61dafb]">
            <a
              href="https://tanstack.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn TanStack
            </a>
          </Button>
        </div>
      </header>
    </div>
  )
}
