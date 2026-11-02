import { useEffect, useState, type RefObject } from 'react'

/**
 * Whether there is more to read past what is shown in a scrolling element: its content is taller (or, for a
 * `horizontal` one, wider) than it and it is not at the end yet. For the fade at the foot of a long text, or at
 * the edge of a row of tools, that says « there is more ». `content` is what changes the answer (the text that is shown).
 */
export function useCanScrollMore(
  ref: RefObject<HTMLElement | null>,
  content: unknown,
  axis: 'vertical' | 'horizontal' = 'vertical',
): boolean {
  const [more, setMore] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (element === null) return undefined

    const measure = () => {
      const left =
        axis === 'vertical'
          ? element.scrollHeight - element.scrollTop - element.clientHeight
          : element.scrollWidth - element.scrollLeft - element.clientWidth
      setMore(left > 4)
    }
    measure()
    element.addEventListener('scroll', measure, { passive: true })
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => {
      element.removeEventListener('scroll', measure)
      observer.disconnect()
    }
  }, [ref, content, axis])

  return more
}
