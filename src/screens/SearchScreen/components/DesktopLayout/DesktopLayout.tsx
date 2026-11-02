import { paths } from '../../../../app/paths'
import { useSearchOverlay } from '../../../../app/useSearchOverlay'
import { strings as appStrings } from '../../../../app/strings'
import { CreateLink } from '../../../../components/CreateLink/CreateLink'
import { NO_FILTERS } from '../../filterChoices'
import type { SearchScope } from '../../recipeFilters'
import { strings } from '../../strings'
import type { SearchPage } from '../../useSearchPage'
import { ActiveFilters } from '../ActiveFilters/ActiveFilters'
import { FiltersColumn } from '../FiltersColumn/FiltersColumn'
import { ResultsBar } from '../ResultsBar/ResultsBar'
import { SearchInvitation } from '../SearchInvitation/SearchInvitation'
import { SearchResults } from '../SearchResults/SearchResults'

export interface DesktopLayoutProps {
  page: SearchPage
  scope: SearchScope
  /** A member allowed to write recipes: « Mes recettes » offers « Nouvelle recette » in its header. */
  mayCreate: boolean
}

/**
 * The results page from 1024 px: the filters in a column of 270 px, which refine the results as they are
 * chosen, the results in three columns beside it. The title text is searched from the bar, whose field opens
 * the search over the page. With nothing left to search for the results give way to an invitation to search.
 */
export function DesktopLayout({ page, scope, mayCreate }: DesktopLayoutProps) {
  const { criteria, feed, options, activeFilters, hasFilters, showAuthor, searching } = page
  const openSearch = useSearchOverlay()
  const mine = scope.kind === 'mine'

  return (
    <main className="grid grid-cols-12 items-start gap-6 pt-8 pb-12">
      <div className="col-span-3">
        <FiltersColumn
          criteria={criteria}
          options={options}
          showAuthor={showAuthor}
          onChange={page.changeFilters}
        />
      </div>
      <div className="col-span-9 flex flex-col gap-4.5">
        <div className="flex items-end justify-between gap-6">
          <h1 className="font-title text-page-title-lg text-ink-900">
            {mine ? strings.titles.mine : strings.titles.search}
          </h1>
          {mine && mayCreate && (
            <CreateLink to={paths.newRecipe} label={appStrings.navigation.newRecipe} expanded />
          )}
        </div>
        <ActiveFilters
          filters={activeFilters}
          lockedLabel={mine ? strings.active.mine : undefined}
          onClearAll={() => {
            page.changeFilters(NO_FILTERS)
          }}
        />
        {searching ? (
          <>
            <ResultsBar
              feed={feed}
              sort={criteria.sort}
              onSortChange={page.changeSort}
              sortAsList
            />
            <SearchResults
              feed={feed}
              criteria={criteria}
              scope={scope}
              hasFilters={hasFilters}
              onClearFilters={() => {
                page.changeFilters(NO_FILTERS)
              }}
              desktopColumns={3}
            />
          </>
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
