import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { bindPrivateData } from '../api/privateData'
import { sessionStore } from '../api/sessionStore'
import { SearchOverlayProvider } from './SearchOverlayProvider'
import { SessionExpiredDialog } from './SessionExpiredDialog'
import { ToastsProvider } from './ToastsProvider'

/**
 * What every page shares: the notifications any of them can show, the search that any of them can open
 * over itself, and the dialog that interrupts any of them when the session ends. It also keeps what is
 * private to a member out of the next one's sight (`bindPrivateData`).
 */
export function RootLayout() {
  const queryClient = useQueryClient()
  useEffect(() => bindPrivateData(queryClient, sessionStore), [queryClient])

  return (
    <ToastsProvider>
      <SearchOverlayProvider>
        <Outlet />
      </SearchOverlayProvider>
      <SessionExpiredDialog />
    </ToastsProvider>
  )
}
