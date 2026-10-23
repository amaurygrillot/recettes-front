import { useEffect, useState } from 'react'

/**
 * Which of the sections of a page the reader is on: the first of them, in page order, that is in
 * the upper part of the screen. `select` says it at once when the reader picks one in an index,
 * before the scroll has got there. Without `IntersectionObserver` the first one stays active.
 * `ids` must be the same array from one render to the next.
 */
export function useActiveSection(ids: readonly string[]): {
  active: string | undefined
  select: (id: string) => void
} {
  const [active, setActive] = useState<string | undefined>(ids[0])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined

    const inView = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (isIntersecting) inView.add(target.id)
          else inView.delete(target.id)
        }
        const first = ids.find((id) => inView.has(id))
        if (first !== undefined) setActive(first)
      },
      // A section counts once its top has come into the upper part of the screen.
      { rootMargin: '-15% 0px -60% 0px' },
    )
    for (const id of ids) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    return () => {
      observer.disconnect()
    }
  }, [ids])

  return { active, select: setActive }
}
