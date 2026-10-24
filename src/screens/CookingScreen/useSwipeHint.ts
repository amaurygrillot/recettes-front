import { useEffect, useState } from 'react'

const KEY = 'recettes.cooking-hint'
/** The hint stays long enough to be read once, and no longer. */
const VISIBLE_FOR_MS = 6000

function alreadySeen(): boolean {
  try {
    return window.localStorage.getItem(KEY) !== null
  } catch {
    // Without storage the hint cannot be remembered: it is not shown at all rather than every time.
    return true
  }
}

function remember(): void {
  try {
    window.localStorage.setItem(KEY, '1')
  } catch {
    // Nothing to do: it is simply shown again next time.
  }
}

/**
 * « Glisse pour changer d'étape »: told once, the first time on this device, then never again. It goes
 * away by itself after a few seconds, or as soon as the cook changes step, which shows they know.
 */
export function useSwipeHint(): { visible: boolean; dismiss: () => void } {
  const [visible, setVisible] = useState(() => !alreadySeen())

  function dismiss(): void {
    if (!visible) return
    remember()
    setVisible(false)
  }

  useEffect(() => {
    if (!visible) return undefined
    const timer = setTimeout(() => {
      remember()
      setVisible(false)
    }, VISIBLE_FOR_MS)
    return () => {
      clearTimeout(timer)
    }
  }, [visible])

  return { visible, dismiss }
}
