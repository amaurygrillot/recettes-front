import { useIngredientNames } from '../../api/ingredients'
import { activeFilterCount, isNarrowed, type SearchCriteria } from '../../app/searchCriteria'
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

  // Nothing to search for (every filter taken off a results page): the page invites to search, it lists nothing.
  const searching = scope.kind === 'mine' || isNarrowed(criteria)
  const feed = useRecipeFeed(toRecipeFilters(criteria, scope), { enabled: searching })
  const options = useFilterOptions()
  const ingredientNames = useIngredientNames(criteria.ingredientIds)

  const changeFilters = (changes: Partial<FilterChoices>) => {
    update(changes)
  }

  return {
    criteria,
    searching,
    feed,
    options,
    showAuthor,
    hasFilters: activeFilterCount(criteria) > 0,
    activeFilters: activeFiltersOf(criteria, options, ingredientNames, changeFilters, showAuthor),
    changeFilters,
    changeSort: (sort: SearchCriteria['sort']) => {
      update({ sort })
    },
  }
}

export type SearchPage = ReturnType<typeof useSearchPage>
