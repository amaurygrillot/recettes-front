import { useEffect, useState } from 'react'

/** Becomes true once `delayMs` have passed since the component mounted; always true for a delay of 0. */
export function useHasElapsed(delayMs: number): boolean {
  const [elapsed, setElapsed] = useState(false)

  useEffect(() => {
    if (delayMs <= 0) return undefined
    const timer = setTimeout(() => {
      setElapsed(true)
    }, delayMs)
    return () => {
      clearTimeout(timer)
    }
  }, [delayMs])

  return delayMs <= 0 || elapsed
}
