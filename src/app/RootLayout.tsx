import { Outlet } from 'react-router'
import { SearchOverlayProvider } from './SearchOverlayProvider'
import { SessionExpiredDialog } from './SessionExpiredDialog'
import { ToastsProvider } from './ToastsProvider'

/**
 * What every page shares: the notifications any of them can show, the search that any of them can open
 * over itself, and the dialog that interrupts any of them when the session ends.
 */
export function RootLayout() {
  return (
    <ToastsProvider>
      <SearchOverlayProvider>
        <Outlet />
      </SearchOverlayProvider>
      <SessionExpiredDialog />
    </ToastsProvider>
  )
}
