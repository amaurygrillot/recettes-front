import { useEffect, useRef } from 'react'

/**
 * A function that runs `callback` once the calls to it have stopped for `delayMs`, with the
 * arguments of the last one. A pending call is dropped when the component goes away. With a delay
 * of 0 the callback runs at once, in the same call.
 */
export function useDebouncedCallback<Arguments extends unknown[]>(
  callback: (...args: Arguments) => void,
  delayMs: number,
): { schedule: (...args: Arguments) => void; cancel: () => void } {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  // The timer must call what the latest render passed, not what the render that scheduled it did.
  const latest = useRef(callback)

  useEffect(() => {
    latest.current = callback
  })
  useEffect(
    () => () => {
      clearTimeout(timer.current)
    },
    [],
  )

  const cancel = () => {
    clearTimeout(timer.current)
  }

  return {
    schedule: (...args) => {
      cancel()
      if (delayMs <= 0) {
        latest.current(...args)
        return
      }
      timer.current = setTimeout(() => {
        latest.current(...args)
      }, delayMs)
    },
    cancel,
  }
}
