import { Button } from '../../../../components/Button/Button'
import { strings } from '../../strings'

export interface SearchActionsProps {
  /** There is a word or a filter: « Rechercher » is enabled. */
  searchable: boolean
  onReset: () => void
  onSearch: () => void
  /** « Rechercher » takes the width the reset button leaves (the sheet), else its own (the desktop panel). */
  stretch: boolean
}

/** The two buttons that answer the search overlay: start over without closing, or search. */
export function SearchActions({ searchable, onReset, onSearch, stretch }: SearchActionsProps) {
  return (
    <>
      <Button variant="secondary" onClick={onReset}>
        {strings.filters.reset}
      </Button>
      <div className={stretch ? 'min-w-0 flex-1' : undefined}>
        <Button fullWidth={stretch} disabled={!searchable} onClick={onSearch}>
          {strings.overlay.search}
        </Button>
      </div>
    </>
  )
}
