import { useEffect, useRef, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useDebouncedCallback } from '../../lib/useDebouncedCallback'
import type { DraftState } from './components/DraftStatus/DraftStatus'
import { clearDraft, saveDraft } from './editorDraft'
import { sameValues, type EditorValues } from './editorModel'

/** The typing has to pause this long before the draft is written: it is the keystroke's business to be fast. */
const KEEP_AFTER_MS = 600

export interface DraftSavingOptions {
  form: UseFormReturn<EditorValues>
  /** Where the draft is kept (one per recipe being edited, one for the recipe being created). */
  storageKey: string
  /** What the form started from: values equal to it are not a draft, they are nothing to keep. */
  initial: EditorValues
  /** Off once the recipe is saved: a draft must not come back after it. */
  enabled: boolean
}

/**
 * Keeps what is being written as a draft on this device, a moment after each change, and says
 * how it went. A form back to what it started from has no draft. A draft still waiting when the
 * editor goes away (the person left, or the session ended) is kept at once, not lost.
 */
export function useDraftSaving({ form, storageKey, initial, enabled }: DraftSavingOptions): {
  state: DraftState
  /** Keeps the draft now, without waiting for the typing to pause. */
  keepNow: () => void
  /** The recipe is saved: forgets the draft, and what was still waiting to be kept. */
  discard: () => void
} {
  const [state, setState] = useState<DraftState>('idle')
  const waiting = useRef(false)

  function keep(): void {
    waiting.current = false
    const values = form.getValues()
    if (sameValues(values, initial)) {
      clearDraft(storageKey)
      setState('idle')
      return
    }
    setState(saveDraft(storageKey, values) ? 'saved' : 'failed')
  }

  const later = useDebouncedCallback(keep, KEEP_AFTER_MS)
  // The latest `keep` for the cleanup below, which runs once and must not keep an old one.
  const latestKeep = useRef(keep)
  useEffect(() => {
    latestKeep.current = keep
  })

  useEffect(() => {
    if (!enabled) return undefined
    const subscription = form.watch(() => {
      waiting.current = true
      setState('saving')
      later.schedule()
    })
    return () => {
      subscription.unsubscribe()
      later.cancel()
      if (waiting.current) latestKeep.current()
    }
    // `later` changes identity with every render; what it calls does not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, enabled])

  return {
    state,
    keepNow: () => {
      later.cancel()
      keep()
    },
    discard: () => {
      later.cancel()
      waiting.current = false
      clearDraft(storageKey)
      setState('idle')
    },
  }
}
