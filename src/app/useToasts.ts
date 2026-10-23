import { createContext, use } from 'react'

/** A failure that can be tried again: the cause, and what trying again does. */
export interface FailureNotice {
  message: string
  detail?: string | undefined
  retry?: (() => void) | undefined
}

export interface Toasts {
  /** « Profil mis à jour »: gone after a few seconds. */
  success: (message: string) => void
  /** « Enregistrement impossible. »: stays until closed or retried. */
  failure: (notice: FailureNotice) => void
}

export interface Notice {
  id: number
  tone: 'success' | 'error'
  message: string
  detail?: string | undefined
  retry?: (() => void) | undefined
}

export const ToastsContext = createContext<Toasts | null>(null)

/** Asks for notifications from the nearest `ToastsProvider`. */
export function useToasts(): Toasts {
  const toasts = use(ToastsContext)
  if (toasts === null) throw new Error('useToasts needs a ToastsProvider above it')
  return toasts
}
