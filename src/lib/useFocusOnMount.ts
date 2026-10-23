import { useEffect, useRef, type RefObject } from 'react'

/**
 * Puts the focus on an element when it appears: a screen that replaces a form (a confirmation, a
 * result) starts from its title, instead of leaving the focus on a control that is gone. The
 * element needs `tabIndex={-1}` to take the focus.
 */
export function useFocusOnMount<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return ref
}
