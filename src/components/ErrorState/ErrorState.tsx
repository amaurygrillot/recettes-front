import type { ReactNode } from 'react'
import { Icon } from '../Icon/Icon'

export interface ErrorStateProps {
  /** What happened, in a few words: « Impossible de charger les recettes ». */
  title: string
  /** One message per cause, and the next step. */
  description: string
  /** The way out: a Button « Réessayer », optionally a quiet « Retour à l'accueil ». */
  children?: ReactNode
}

/** A whole block that failed to load. Announced at once to assistive technology. */
export function ErrorState({ title, description, children }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3.5 rounded-xl border-2 border-ink-900 bg-paper-50 px-6 py-7 text-center shadow-card"
    >
      <div className="grid size-20 place-items-center rounded-full border-3 border-brick bg-brick-bg text-brick">
        <Icon name="warning" size={40} strokeWidth={2.4} />
      </div>
      <h2 className="font-title text-dialog-title text-ink-900">{title}</h2>
      <p className="text-body text-ink-800">{description}</p>
      {children ? <div className="flex w-full flex-col gap-3">{children}</div> : null}
    </div>
  )
}
