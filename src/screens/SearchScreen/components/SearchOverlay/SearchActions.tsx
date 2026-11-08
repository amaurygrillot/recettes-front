import { Button } from '../../../../components/Button/Button'
import { strings } from '../../strings'

export interface SearchActionsProps {
  /** There is a word or a filter: « Rechercher » is enabled. */
  searchable: boolean
  onReset: () => void
  onSearch: () => void
  /** The two buttons share the width of the sheet (a phone), else each has its own (the desktop panel). */
  stretch: boolean
}

/** The two buttons that answer the search overlay: start over without closing, or search. */
export function SearchActions({ searchable, onReset, onSearch, stretch }: SearchActionsProps) {
  const reset = (
    <Button variant="secondary" fullWidth={stretch} onClick={onReset}>
      {strings.filters.reset}
    </Button>
  )
  const search = (
    <Button fullWidth={stretch} disabled={!searchable} onClick={onSearch}>
      {strings.overlay.search}
    </Button>
  )

  if (!stretch) {
    return (
      <>
        {reset}
        {search}
      </>
    )
  }
  // Side by side while both labels fit (they need 331 px), one under the other when they do not, so that
  // no label is ever cut: « Rechercher », the answer, stays at the bottom, under the thumb.
  return (
    <div className="flex w-full flex-wrap gap-3">
      <div className="min-w-fit flex-1">{reset}</div>
      <div className="min-w-fit flex-1">{search}</div>
    </div>
  )
}
