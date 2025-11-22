import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Home, Menu, Database, Server, Share2 } from 'lucide-react'
import LanguageSelector from './LanguageSelector'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useSidebar, useUiActions } from '@/stores'

export default function Header() {
  const { t } = useTranslation()
  const isSidebarOpen = useSidebar()
  const { setSidebarOpen } = useUiActions()

  return (
    <header className="p-4 flex items-center justify-between bg-gray-800 text-white shadow-lg">
      <div className="flex items-center">
        <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-700"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-gray-900 text-white border-gray-700 p-0">
            <SheetHeader className="p-4 border-b border-gray-700">
              <SheetTitle className="text-xl font-bold text-white">{t('nav.home')}</SheetTitle>
            </SheetHeader>

            <nav className="flex-1 p-4 overflow-y-auto">
              <Link
                to="/"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
                }}
              >
                <Home size={20} />
                <span className="font-medium">{t('nav.home')}</span>
              </Link>

              {/* Demo Links Start */}
              <Link
                to="/zustand-test"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
                }}
              >
                <Database size={20} />
                <span className="font-medium">{t('nav.zustandTest')}</span>
              </Link>

              <Link
                to="/msw-test"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
                }}
              >
                <Server size={20} />
                <span className="font-medium">{t('nav.mswTest')}</span>
              </Link>

              <Link
                to="/db-test"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
                }}
              >
                <Share2 size={20} />
                <span className="font-medium">{t('nav.dbTest')}</span>
              </Link>
              {/* Demo Links End */}
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="ml-4 text-xl font-semibold">
          <Link to="/">
            <img
              src="/tanstack-word-logo-white.svg"
              alt="TanStack Logo"
              className="h-10"
            />
          </Link>
        </h1>
      </div>
      <LanguageSelector className="text-gray-800" />
    </header>
  )
}
