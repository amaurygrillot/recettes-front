import { createContext, use } from 'react'

/** A failure that can be tried again: the cause, and what trying again does. */
export interface FailureNotice {
  message: string
  detail?: string | undefined
  retry?: (() => void) | undefined
}

/** A word in a notification that does something: « Annuler » after a removal. */
export interface NoticeAction {
  label: string
  run: () => void
}

export interface Toasts {
  /** « Profil mis à jour »: gone after a few seconds, with an action when it can be taken back. */
  success: (message: string, action?: NoticeAction) => void
  /** « Enregistrement impossible. »: stays until closed or retried. */
  failure: (notice: FailureNotice) => void
}

export interface Notice {
  id: number
  tone: 'success' | 'error'
  message: string
  detail?: string | undefined
  action?: NoticeAction | undefined
}

export const ToastsContext = createContext<Toasts | null>(null)

/** Asks for notifications from the nearest `ToastsProvider`. */
export function useToasts(): Toasts {
  const toasts = use(ToastsContext)
  if (toasts === null) throw new Error('useToasts needs a ToastsProvider above it')
  return toasts
}
