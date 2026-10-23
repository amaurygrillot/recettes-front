import type { SearchCriteria } from '../../../../app/searchCriteria'
import { Button } from '../../../../components/Button/Button'
import { filterChoicesOf, NO_FILTERS, type FilterChoices } from '../../filterChoices'
import { strings } from '../../strings'
import type { FilterOptions } from '../../useFilterOptions'
import { FiltersPanel } from '../FiltersPanel/FiltersPanel'

export interface FiltersColumnProps {
  criteria: SearchCriteria
  options: FilterOptions
  showAuthor: boolean
  /** Writes the changed filters into the search at once: there is no draft here. */
  onChange: (changes: Partial<FilterChoices>) => void
}

/**
 * The filters of a desktop, in a card of 270 px beside the results: every choice applies as it is
 * made, so there is no « Voir les N recettes », only « Réinitialiser ».
 */
export function FiltersColumn({ criteria, options, showAuthor, onChange }: FiltersColumnProps) {
  return (
    <aside
      aria-labelledby="filters-column-title"
      className="flex flex-col gap-4 rounded-xl border-2 border-ink-900 bg-paper-50 p-5 shadow-paper"
    >
      <h2 id="filters-column-title" className="font-title text-title-2 text-ink-900">
        {strings.filters.title}
      </h2>
      <FiltersPanel
        choices={filterChoicesOf(criteria)}
        onChange={onChange}
        options={options}
        showAuthor={showAuthor}
        authorDebounceMs={300}
        dense
      />
      <Button
        variant="secondary"
        size="medium"
        fullWidth
        onClick={() => {
          onChange(NO_FILTERS)
        }}
      >
        {strings.filters.reset}
      </Button>
    </aside>
  )
}
