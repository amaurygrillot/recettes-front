import { FeedGrid } from '../FeedGrid/FeedGrid'
import { RecipeCardSkeleton } from './RecipeCardSkeleton'

// Two cards fill a phone's screen; a tablet's two columns and a desktop's four need more to look
// like the feed they stand for. The extra ones are not drawn where they would only add scrolling.
const PLACEHOLDERS = [
  { id: 'first', className: '' },
  { id: 'second', className: '' },
  { id: 'third', className: 'hidden tablet:block' },
  { id: 'fourth', className: 'hidden tablet:block' },
] as const

export interface RecipeCardSkeletonsProps {
  /** As for the grid of the cards they stand in for. */
  desktopColumns?: 3 | 4
}

/** The placeholders of a feed that has not arrived (or of the next page). Hidden from assistive technology. */
export function RecipeCardSkeletons({ desktopColumns = 4 }: RecipeCardSkeletonsProps) {
  return (
    <FeedGrid desktopColumns={desktopColumns}>
      {PLACEHOLDERS.map(({ id, className }) => (
        <li key={id} className={className}>
          <RecipeCardSkeleton />
        </li>
      ))}
    </FeedGrid>
  )
}
