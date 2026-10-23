import type { ReactNode } from 'react'
import { classNames } from '../../lib/classNames'

export type CardPillTone = 'category' | 'tag' | 'overflow'

export interface CardPillProps {
  tone: CardPillTone
  children: ReactNode
}

// The card's pills are smaller than a Tag (32 and 30 px against 36) to leave the title its room.
const TONES: Record<CardPillTone, string> = {
  category: 'h-8 border-ink-900 bg-butter-200 px-3 font-bold text-ink-900',
  tag: 'h-7.5 border-ink-500 bg-paper-50 px-2.75 text-ink-800',
  overflow: 'h-7.5 border-dashed border-ink-500 bg-paper-200 px-2.75 font-bold text-ink-900',
}

/** A read-only label on a recipe card. Like a Tag it is not a control: no hover, no focus. */
export function CardPill({ tone, children }: CardPillProps) {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-pill border-thin text-detail whitespace-nowrap',
        TONES[tone],
      )}
    >
      {children}
    </span>
  )
}
