import { isNarrowed } from '../../../../app/searchCriteria'
import { TABLET_QUERY } from '../../../../lib/breakpoints'
import { useMediaQuery } from '../../../../lib/useMediaQuery'
import { NO_FILTERS } from '../../filterChoices'
import type { SearchScope } from '../../recipeFilters'
import { strings } from '../../strings'
import type { SearchPage } from '../../useSearchPage'
import { ActiveFilters } from '../ActiveFilters/ActiveFilters'
import { FiltersControl } from '../FiltersControl/FiltersControl'
import { ResultsBar } from '../ResultsBar/ResultsBar'
import { SearchField } from '../SearchField/SearchField'
import { SearchResults } from '../SearchResults/SearchResults'

export interface PhoneLayoutProps {
  page: SearchPage
  scope: SearchScope
}

/**
 * The search page on a phone and a tablet: a header that stays at the top (field, « Filtres »,
 * the filters in force, the count and the sort), the results below it, the filters in a sheet.
 */
export function PhoneLayout({ page, scope }: PhoneLayoutProps) {
  const { criteria, feed, options, activeFilters, hasFilters } = page
  const labelled = useMediaQuery(TABLET_QUERY)
  const mine = scope.kind === 'mine'
  const showCaption = !mine && feed.status === 'ready' && !isNarrowed(criteria)

  return (
    <main className="pb-8">
      <div className="sticky top-0 z-10 -mx-4 flex flex-col gap-2.5 bg-paper-100 px-4 pt-4 shadow-paper tablet:-mx-8 tablet:px-8">
        <h1 className={mine ? 'font-title text-page-title text-ink-900' : 'sr-only'}>
          {mine ? strings.titles.mine : strings.titles.search}
        </h1>
        <div className="flex items-start gap-3">
          <SearchField />
          <FiltersControl
            criteria={criteria}
            scope={scope}
            options={options}
            onApply={page.changeFilters}
            labelled={labelled}
          />
        </div>
        <ActiveFilters
          filters={activeFilters}
          lockedLabel={mine ? strings.active.mine : undefined}
          onClearAll={() => {
            page.changeFilters(NO_FILTERS)
          }}
        />
        <ResultsBar
          feed={feed}
          sort={criteria.sort}
          onSortChange={page.changeSort}
          sortAsList={false}
        />
      </div>
      <div className="flex flex-col gap-4.5 pt-3.5">
        {showCaption && (
          <p className="text-detail text-ink-800">{strings.captions[criteria.sort]}</p>
        )}
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
      </div>
    </main>
  )
}
