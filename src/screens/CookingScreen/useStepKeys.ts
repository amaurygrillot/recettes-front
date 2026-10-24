import { useEffect, useEffectEvent } from 'react'

export interface StepKeys {
  /** While a dialog, a sheet or a photo is open the keys are theirs. */
  enabled: boolean
  onPrevious: () => void
  onNext: () => void
  onQuit: () => void
}

/**
 * The keys of a desktop: « ← » and « → » change step, « Échap » asks to quit. A key that something
 * else already used (a field, an open dialog closing on Escape) is left alone.
 */
export function useStepKeys({ enabled, onPrevious, onNext, onQuit }: StepKeys): void {
  const handle = useEffectEvent((event: KeyboardEvent) => {
    if (!enabled || event.defaultPrevented) return
    if (event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key === 'ArrowLeft') onPrevious()
    else if (event.key === 'ArrowRight') onNext()
    else if (event.key === 'Escape') onQuit()
  })

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      handle(event)
    }
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [])
}
