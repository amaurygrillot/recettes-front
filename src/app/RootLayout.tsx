import { Outlet } from 'react-router'
import { SessionExpiredDialog } from './SessionExpiredDialog'

/** What every page shares: the dialog that interrupts any of them when the session ends. */
export function RootLayout() {
  return (
    <>
      <Outlet />
      <SessionExpiredDialog />
    </>
  )
}
