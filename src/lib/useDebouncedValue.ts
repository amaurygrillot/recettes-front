import { useEffect, useState } from 'react'

/**
 * `value`, once it has stopped changing for `delayMs`: what a search asks the server with while
 * the person is still typing. The first value is there at once.
 */
export function useDebouncedValue<Value>(value: Value, delayMs: number): Value {
  const [settled, setSettled] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSettled(value)
    }, delayMs)
    return () => {
      clearTimeout(timer)
    }
  }, [value, delayMs])

  return settled
}
