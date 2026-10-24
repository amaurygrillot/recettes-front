import { useEffect, useState, type RefObject } from 'react'

/**
 * Whether there is more to read below what is shown in a scrolling element: its content is taller
 * than it and it is not at the end yet. For the fade at the foot of a long text that says « there
 * is more ». `content` is what changes the answer (the text that is shown).
 */
export function useCanScrollMore(ref: RefObject<HTMLElement | null>, content: unknown): boolean {
  const [more, setMore] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (element === null) return undefined

    const measure = () => {
      setMore(element.scrollHeight - element.scrollTop - element.clientHeight > 4)
    }
    measure()
    element.addEventListener('scroll', measure, { passive: true })
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => {
      element.removeEventListener('scroll', measure)
      observer.disconnect()
    }
  }, [ref, content])

  return more
}
