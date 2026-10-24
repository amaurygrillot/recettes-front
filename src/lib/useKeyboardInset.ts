import { useEffect, useState } from 'react'

/**
 * How many pixels of the bottom of the page a phone's on-screen keyboard covers, while `active`
 * (the keyboard is only there while something is being typed). It lets a bar sit just above the
 * keyboard and follow it. Where the browser has no `visualViewport` the answer is always 0.
 */
export function useKeyboardInset(active: boolean): number {
  const [inset, setInset] = useState(0)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!active || !viewport) return undefined

    function update(): void {
      if (viewport)
        setInset(Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop)))
    }
    update()
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
      setInset(0)
    }
  }, [active])

  return inset
}
