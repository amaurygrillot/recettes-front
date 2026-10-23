import type { ReactNode } from 'react'
import { strings } from '../../strings'

export interface AccountCardProps {
  /** The `id` of the section: the index scrolls to it, and its title is `<id>-title`. */
  id: string
  title: string
  /** Something was changed and not saved yet: the card says so under its title. */
  unsaved: boolean
  children: ReactNode
}

/**
 * One section of the account page: its own title, fields and button. Each card is saved on its
 * own, so what is changed in one never mixes with what is saved in another.
 */
export function AccountCard({ id, title, unsaved, children }: AccountCardProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="flex scroll-mt-6 flex-col gap-3.5 rounded-frame border-2 border-ink-900 bg-paper-50 px-4 pt-4.5 pb-5 shadow-card desktop:px-6 desktop:pt-5.5 desktop:pb-6"
    >
      <div className="flex flex-col items-start gap-2">
        <h2 id={`${id}-title`} className="font-title text-dialog-title text-ink-900">
          {title}
        </h2>
        {/* Always on the page, so that a screen reader announces it when it fills. */}
        <div role="status">
          {unsaved && (
            <span className="inline-flex min-h-8 items-center rounded-pill border-thin border-ink-900 bg-butter-100 px-3 text-detail font-bold text-ink-900">
              {strings.unsaved}
            </span>
          )}
        </div>
      </div>
      {children}
    </section>
  )
}
