import type { ReactNode } from 'react'
import { classNames } from '../../lib/classNames'
import { STATE_FRAMES, type StateSize } from './stateSize'

export interface EmptyStateProps {
  /** A BowlIllustration, or a Logo for the main empty states. */
  illustration: ReactNode
  /** The finding, in one or two lines: « Ton carnet est vide ». */
  title: string
  /** Why, and what to do: two sentences at most. */
  description: string
  /** The action, as a 64 px Button: primary when the page has no other action, else secondary. */
  children?: ReactNode
  /** `regular` fills a page; `compact` is a block among others (a feed's), with tighter padding and title. */
  size?: StateSize
  /** `1` when the block is the whole page's message (a recipe that does not exist); `2` otherwise. */
  headingLevel?: 1 | 2
}

const TITLES: Record<StateSize, string> = {
  regular: 'text-state-title',
  compact: 'text-dialog-title',
}

/** A page is never left mute: illustration, title, text and one action. */
export function EmptyState({
  illustration,
  title,
  description,
  children,
  size = 'regular',
  headingLevel = 2,
}: EmptyStateProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  return (
    <div
      className={classNames(
        'flex flex-col items-center rounded-xl border-2 border-dashed border-ink-500 bg-paper-50 text-center',
        STATE_FRAMES[size],
      )}
    >
      {illustration}
      <Heading className={classNames('font-title text-ink-900', TITLES[size])}>{title}</Heading>
      <p className="text-body text-ink-800">{description}</p>
      {children ? <div className="mt-auto flex w-full flex-col gap-3">{children}</div> : null}
    </div>
  )
}
