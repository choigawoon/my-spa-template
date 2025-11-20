import { useEffect } from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useTranslation } from 'react-i18next'

import Header from '../components/Header'
import { PWAPrompt } from '../components/PWAPrompt'
import { useTheme, useLanguage } from '../stores'

function RootComponent() {
  const theme = useTheme()
  const language = useLanguage()
  const { i18n } = useTranslation()

  // Apply theme to DOM when it changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [theme])

  // Sync Zustand language state with i18n
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language)
      document.documentElement.lang = language
    }
  }, [language, i18n])

  return (
    <>
      <Header />
      <Outlet />
      <PWAPrompt />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
