import { activeFilterCount, type SearchCriteria } from '../../app/searchCriteria'
import { useRecipeFeed } from '../../app/useRecipeFeed'
import { useSearchCriteria } from '../../app/useSearchCriteria'
import { activeFiltersOf } from './activeFilters'
import type { FilterChoices } from './filterChoices'
import { toRecipeFilters, type SearchScope } from './recipeFilters'
import { useFilterOptions } from './useFilterOptions'

/**
 * Everything the search page shows, from the address and the API: the criteria, the answer, what
 * the filters can be chosen among, and the chips of the filters in force. The layouts only place it.
 */
export function useSearchPage(scope: SearchScope) {
  const { criteria: requested, update } = useSearchCriteria()
  const showAuthor = scope.kind === 'all'
  // In « Mes recettes » the author is the member: a name in the address is ignored, as it is for the API.
  const criteria: SearchCriteria = showAuthor ? requested : { ...requested, author: '' }

  const feed = useRecipeFeed(toRecipeFilters(criteria, scope))
  const options = useFilterOptions()

  const changeFilters = (changes: Partial<FilterChoices>) => {
    update(changes)
  }

  return {
    criteria,
    feed,
    options,
    showAuthor,
    hasFilters: activeFilterCount(criteria) > 0,
    activeFilters: activeFiltersOf(criteria, options, changeFilters, showAuthor),
    changeFilters,
    changeSort: (sort: SearchCriteria['sort']) => {
      update({ sort })
    },
  }
}

export type SearchPage = ReturnType<typeof useSearchPage>
