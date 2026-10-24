import { useEffect } from 'react'
import { logger } from './logger'

/**
 * Keeps the screen on while `active` (a phone propped on the counter must not go dark between two
 * steps). The browser gives the lock up when the page is hidden, so it is asked for again when the
 * page is back. A browser without the API, or that refuses (a low battery), simply lets the screen sleep.
 */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return undefined

    let lock: WakeLockSentinel | undefined
    let released = false

    async function acquire(): Promise<void> {
      try {
        const granted = await navigator.wakeLock.request('screen')
        if (released) await granted.release()
        else lock = granted
      } catch {
        logger.debug('The screen was not kept awake')
      }
    }

    function reacquire(): void {
      if (document.visibilityState === 'visible') void acquire()
    }

    void acquire()
    document.addEventListener('visibilitychange', reacquire)
    return () => {
      released = true
      document.removeEventListener('visibilitychange', reacquire)
      void lock?.release()
    }
  }, [active])
}
