import { useEffect, useState } from 'react'

/**
 * A countdown in whole seconds: `start()` sets it to `seconds`, then it goes down to 0 and stays
 * there. Idle (0) until started. It counts the seconds the page lets it count: a tab asleep waits.
 */
export function useCountdown(seconds: number): { remaining: number; start: () => void } {
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (remaining <= 0) return undefined
    const tick = setTimeout(() => {
      setRemaining((current) => current - 1)
    }, 1000)
    return () => {
      clearTimeout(tick)
    }
  }, [remaining])

  return {
    remaining,
    start: () => {
      setRemaining(seconds)
    },
  }
}
