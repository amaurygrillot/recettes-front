import { useEffect, useState } from 'react'

/**
 * Whether the reader has scrolled past an element: it is out of the screen and above it. Not
 * while it is still waiting below the fold. Without `IntersectionObserver` it is never past.
 *
 * Put the returned `ref` on the element: it is a callback ref, so an element that appears later
 * than the component (or is replaced) is observed all the same.
 */
export function useScrolledPast(): { past: boolean; ref: (element: Element | null) => void } {
  const [element, setElement] = useState<Element | null>(null)
  const [past, setPast] = useState(false)

  useEffect(() => {
    if (element === null || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setPast(!entry.isIntersecting && entry.boundingClientRect.bottom < 0)
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [element])

  return { past, ref: setElement }
}
