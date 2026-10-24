import { useEffect } from 'react'
import { useBlocker } from 'react-router'

/**
 * Stops a page from being left by accident while `active`: any way out inside the app (the cross,
 * the browser's back, a link) is held and `blocked` says so, until the person decides (`stay` or
 * `leave`); closing the tab or reloading gets the browser's own question. Leaving to another
 * place of the same page (a hash) is not leaving.
 */
export function useLeaveGuard(active: boolean): {
  blocked: boolean
  stay: () => void
  leave: () => void
} {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      active &&
      (currentLocation.pathname !== nextLocation.pathname ||
        currentLocation.search !== nextLocation.search),
  )

  useEffect(() => {
    if (!active) return undefined
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => {
      window.removeEventListener('beforeunload', warn)
    }
  }, [active])

  return {
    blocked: blocker.state === 'blocked',
    stay: () => {
      if (blocker.state === 'blocked') blocker.reset()
    },
    leave: () => {
      if (blocker.state === 'blocked') blocker.proceed()
    },
  }
}
