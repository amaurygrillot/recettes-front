import type { ReactNode } from 'react'
import { classNames } from '../../lib/classNames'
import { STATE_FRAMES, type StateSize } from '../EmptyState/stateSize'
import { Icon } from '../Icon/Icon'

export interface ErrorStateProps {
  /** What happened, in a few words: « Impossible de charger les recettes ». */
  title: string
  /** One message per cause, and the next step. */
  description: string
  /** The way out: a Button « Réessayer », optionally a quiet « Retour à l'accueil ». */
  children?: ReactNode
  /** `regular` fills a page; `compact` is a block among others (a feed's), with a smaller badge and tighter padding. */
  size?: StateSize
  /** `1` when the block is the whole page's message; `2` otherwise. */
  headingLevel?: 1 | 2
}

const BADGES: Record<StateSize, string> = { regular: 'size-20', compact: 'size-16' }
const ICON_SIZES: Record<StateSize, number> = { regular: 40, compact: 32 }

/** A whole block that failed to load. Announced at once to assistive technology. */
export function ErrorState({
  title,
  description,
  children,
  size = 'regular',
  headingLevel = 2,
}: ErrorStateProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  return (
    <div
      role="alert"
      className={classNames(
        'flex flex-col items-center rounded-xl border-2 border-ink-900 bg-paper-50 text-center shadow-card',
        STATE_FRAMES[size],
      )}
    >
      <div
        className={classNames(
          'grid place-items-center rounded-full border-3 border-brick bg-brick-bg text-brick',
          BADGES[size],
        )}
      >
        <Icon name="warning" size={ICON_SIZES[size]} strokeWidth={2.4} />
      </div>
      <Heading className="font-title text-dialog-title text-ink-900">{title}</Heading>
      <p className="text-body text-ink-800">{description}</p>
      {children ? <div className="flex w-full flex-col gap-3">{children}</div> : null}
    </div>
  )
}
