import { usePWA } from '@/hooks/usePWA'
import { Download, RefreshCw, WifiOff, X } from 'lucide-react'

export function PWAPrompt() {
  const {
    canInstall,
    installPrompt,
    needRefresh,
    offlineReady,
    updateServiceWorker,
    closeUpdatePrompt,
    isOnline,
  } = usePWA()

  return (
    <>
      {/* Install Prompt */}
      {canInstall && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground">Install App</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Install MermaidChart for a better experience
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={installPrompt}
                  className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={closeUpdatePrompt}
                  className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-md hover:bg-secondary/80 transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Available */}
      {needRefresh && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground">Update Available</h3>
              <p className="text-xs text-muted-foreground mt-1">
                A new version is available. Refresh to update.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={updateServiceWorker}
                  className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 transition-colors"
                >
                  Refresh
                </button>
                <button
                  onClick={closeUpdatePrompt}
                  className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-md hover:bg-secondary/80 transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
            <button
              onClick={closeUpdatePrompt}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Offline Ready */}
      {offlineReady && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground">Ready to work offline</h3>
              <p className="text-xs text-muted-foreground mt-1">
                App has been cached and can work offline.
              </p>
            </div>
            <button
              onClick={closeUpdatePrompt}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-950 text-center py-2 px-4 text-sm font-medium z-50 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>You are offline. Some features may be unavailable.</span>
        </div>
      )}
    </>
  )
}
