import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { initializeDatabase } from '@/db'

// Setup MSW browser worker
export const worker = setupWorker(...handlers)

// Start worker function
export async function startMockServiceWorker() {
  try {
    // Initialize IndexedDB with seed data before starting MSW
    await initializeDatabase()

    await worker.start({
      onUnhandledRequest: 'bypass', // Bypass unhandled requests
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    })
    console.log('🔶 MSW: Mock Service Worker is running with IndexedDB')
  } catch (error) {
    console.error('MSW: Failed to start Mock Service Worker', error)
  }
}
