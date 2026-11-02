import { activeFilterCount } from '../../../../app/searchCriteria'
import { SearchEntryField } from '../../../../app/SearchEntryField'
import { useSearchOverlay } from '../../../../app/useSearchOverlay'
import { TABLET_QUERY } from '../../../../lib/breakpoints'
import { useMediaQuery } from '../../../../lib/useMediaQuery'
import { NO_FILTERS } from '../../filterChoices'
import type { SearchScope } from '../../recipeFilters'
import { strings } from '../../strings'
import type { SearchPage } from '../../useSearchPage'
import { ActiveFilters } from '../ActiveFilters/ActiveFilters'
import { FiltersButton } from '../FiltersButton/FiltersButton'
import { ResultsBar } from '../ResultsBar/ResultsBar'
import { SearchInvitation } from '../SearchInvitation/SearchInvitation'
import { SearchResults } from '../SearchResults/SearchResults'

export interface PhoneLayoutProps {
  page: SearchPage
  scope: SearchScope
}

/**
 * The results page on a phone and a tablet: a header that stays at the top (the field and « Filtres », which
 * open the search over the page, the filters in force, the count and the sort), the results below it. With
 * nothing left to search for it invites to search instead.
 */
export function PhoneLayout({ page, scope }: PhoneLayoutProps) {
  const { criteria, feed, activeFilters, hasFilters, searching } = page
  const labelled = useMediaQuery(TABLET_QUERY)
  const openSearch = useSearchOverlay()
  const mine = scope.kind === 'mine'

  return (
    <main className="pb-8">
      <div className="sticky top-0 z-10 -mx-4 flex flex-col gap-2.5 bg-paper-100 px-4 pt-4 shadow-paper tablet:-mx-8 tablet:px-8">
        <h1 className={mine ? 'font-title text-page-title text-ink-900' : 'sr-only'}>
          {mine ? strings.titles.mine : strings.titles.search}
        </h1>
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <SearchEntryField />
          </div>
          <FiltersButton
            count={activeFilterCount(criteria)}
            labelled={labelled}
            onOpen={() => {
              openSearch({ focus: 'filters' })
            }}
          />
        </div>
        <ActiveFilters
          filters={activeFilters}
          lockedLabel={mine ? strings.active.mine : undefined}
          onClearAll={() => {
            page.changeFilters(NO_FILTERS)
          }}
        />
        {searching && (
          <ResultsBar
            feed={feed}
            sort={criteria.sort}
            onSortChange={page.changeSort}
            sortAsList={false}
          />
        )}
      </div>
      <div className="flex flex-col gap-4.5 pt-3.5">
        {searching ? (
          <SearchResults
            feed={feed}
            criteria={criteria}
            scope={scope}
            hasFilters={hasFilters}
            onClearFilters={() => {
              page.changeFilters(NO_FILTERS)
            }}
            desktopColumns={4}
          />
        ) : (
          <SearchInvitation
            onSearch={() => {
              openSearch()
            }}
          />
        )}
      </div>
    </main>
  )
}
