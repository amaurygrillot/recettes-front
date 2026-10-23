import type { RecipeFeed } from '../../../../app/useRecipeFeed'
import type { SortKey } from '../../../../app/searchCriteria'
import { Spinner } from '../../../../components/Spinner/Spinner'
import { strings } from '../../strings'
import { SortControl } from '../SortControl/SortControl'

export interface ResultsBarProps {
  feed: RecipeFeed
  sort: SortKey
  onSortChange: (sort: SortKey) => void
  sortAsList: boolean
}

/** What the count line says: how many recipes, or that the answer is on its way. Nothing when it failed. */
function Count({ feed }: { feed: RecipeFeed }) {
  if (feed.status === 'failed') return null
  if (feed.status === 'loading' || feed.updating) {
    return (
      <span className="inline-flex items-center gap-2.5 text-body text-ink-800">
        <Spinner size={20} />
        {strings.results.searching}
      </span>
    )
  }
  const count = feed.status === 'ready' ? feed.total : 0
  return <span className="text-body font-bold text-ink-900">{strings.results.count(count)}</span>
}

/** « 134 recettes » and the sort: the line that stays under the field while the list changes. */
export function ResultsBar({ feed, sort, onSortChange, sortAsList }: ResultsBarProps) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-2.5">
      <p role="status" aria-live="polite">
        <Count feed={feed} />
      </p>
      <SortControl value={sort} onChange={onSortChange} asList={sortAsList} />
    </div>
  )
}
