import { useState } from 'react'
import type { Draft } from './editorDraft'
import type { EditorValues } from './editorModel'

export interface DraftOfferActions {
  /** « Reprendre »: the form takes the draft's values. */
  onResume: (values: EditorValues) => void
  /** « Effacer le brouillon », confirmed: the draft is forgotten and the form starts again. */
  onStartOver: () => void
}

/**
 * The question asked when a draft of this recipe waits on the device: take it up, or start over (which
 * asks again, as it is the one thing of the editor that cannot be undone). It is answered once.
 */
export function useDraftOffer(
  offered: Draft | undefined,
  { onResume, onStartOver }: DraftOfferActions,
) {
  const [offer, setOffer] = useState(offered)
  const [confirming, setConfirming] = useState(false)

  return {
    /** The draft to offer, until one of the answers is given. */
    offer,
    /** « Effacer le brouillon ? » is on the screen. */
    confirming,
    resume: () => {
      if (offer === undefined) return
      onResume(offer.values)
      setOffer(undefined)
    },
    askToStartOver: () => {
      setConfirming(true)
    },
    keep: () => {
      setConfirming(false)
    },
    startOver: () => {
      onStartOver()
      setConfirming(false)
      setOffer(undefined)
    },
  }
}
