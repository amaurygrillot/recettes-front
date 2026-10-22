import type { ReactNode } from 'react'

export interface EmptyStateProps {
  /** A BowlIllustration, or a Logo for the main empty states. */
  illustration: ReactNode
  /** The finding, in one or two lines: « Ton carnet est vide ». */
  title: string
  /** Why, and what to do: two sentences at most. */
  description: string
  /** The action, as a 64 px Button: primary when the page has no other action, else secondary. */
  children?: ReactNode
}

/** A page is never left mute: illustration, title, text and one action. */
export function EmptyState({ illustration, title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3.5 rounded-xl border-2 border-dashed border-ink-500 bg-paper-50 px-6 py-7 text-center">
      {illustration}
      <h2 className="font-title text-state-title text-ink-900">{title}</h2>
      <p className="text-body text-ink-800">{description}</p>
      {children ? <div className="mt-auto flex w-full flex-col gap-3">{children}</div> : null}
    </div>
  )
}
