import { Outlet } from 'react-router'
import { SessionExpiredDialog } from './SessionExpiredDialog'
import { ToastsProvider } from './ToastsProvider'

/**
 * What every page shares: the notifications any of them can show, and the dialog that interrupts
 * any of them when the session ends.
 */
export function RootLayout() {
  return (
    <ToastsProvider>
      <Outlet />
      <SessionExpiredDialog />
    </ToastsProvider>
  )
}
