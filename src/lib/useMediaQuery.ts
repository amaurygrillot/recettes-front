import { useCallback, useSyncExternalStore } from 'react'

const hasMatchMedia = () => typeof window.matchMedia === 'function'

/**
 * Whether the screen matches a media query, kept up to date as it is resized or turned. For the
 * few places where two layouts are two different components rather than two sets of classes.
 * Without `matchMedia` (a test environment that has none) nothing matches.
 */
export function useMediaQuery(query: string): boolean {
  // `useSyncExternalStore` subscribes again whenever `subscribe` changes: it has to be stable.
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!hasMatchMedia()) return () => undefined
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => {
        list.removeEventListener('change', onChange)
      }
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => hasMatchMedia() && window.matchMedia(query).matches,
    () => false,
  )
}
