import type { ReactNode } from 'react'

export interface FeedGridProps {
  /** `li` elements: the cards, or the placeholders that stand in for them. */
  children: ReactNode
}

/** One column of cards on a phone, two on a tablet, four on a desktop (270 px each in 1152). */
export function FeedGrid({ children }: FeedGridProps) {
  return (
    <ul className="grid gap-5 tablet:grid-cols-2 tablet:gap-6 desktop:grid-cols-4">{children}</ul>
  )
}
