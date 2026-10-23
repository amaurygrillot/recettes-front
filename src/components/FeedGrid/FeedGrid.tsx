import type { ReactNode } from 'react'

export interface FeedGridProps {
  /** `li` elements: the cards, or the placeholders that stand in for them. */
  children: ReactNode
  /** Columns from 1024 px: 4 for a list of its own, 3 beside the filters' column. */
  desktopColumns?: 3 | 4
}

const DESKTOP_COLUMNS = { 3: 'desktop:grid-cols-3', 4: 'desktop:grid-cols-4' }

/** One column of cards on a phone, two on a tablet, four on a desktop (270 px each in 1152). */
export function FeedGrid({ children, desktopColumns = 4 }: FeedGridProps) {
  return (
    <ul className={`grid gap-5 tablet:grid-cols-2 tablet:gap-6 ${DESKTOP_COLUMNS[desktopColumns]}`}>
      {children}
    </ul>
  )
}
