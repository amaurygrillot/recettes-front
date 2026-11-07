import type { SearchCriteria } from '../../app/searchCriteria'
import type { ActiveFilter } from './components/ActiveFilters/ActiveFilters'
import { findCategory } from '../../app/categoryNodes'
import type { FilterChoices } from './filterChoices'
import { strings } from './strings'
import type { FilterOptions } from './useFilterOptions'

const { active } = strings

/**
 * The chips for the filters in force, each able to drop its filter. The names of a category and a
 * tag come with the options, those of the ingredients from their own lookup: until they are loaded
 * their chips are not shown (the filter itself is already applied), rather than showing an id.
 */
export function activeFiltersOf(
  criteria: SearchCriteria,
  options: FilterOptions,
  ingredientNames: ReadonlyMap<string, string>,
  change: (changes: Partial<FilterChoices>) => void,
  showAuthor: boolean,
): ActiveFilter[] {
  const chips: ActiveFilter[] = []

  if (criteria.categoryId !== undefined && options.status === 'ready') {
    const name = findCategory(options.categories, criteria.categoryId)?.node.name
    if (name !== undefined) {
      const label = criteria.exactCategory ? active.exactCategory(name) : name
      chips.push({
        key: 'category',
        label,
        removeLabel: active.removeFilter(label),
        onRemove: () => {
          change({ categoryId: undefined, exactCategory: false })
        },
      })
    }
  }

  if (options.status === 'ready') {
    for (const id of criteria.tagIds) {
      const name = options.tags.find((tag) => tag.id === id)?.name
      if (name === undefined) continue
      chips.push({
        key: `tag-${id}`,
        label: name,
        removeLabel: active.removeFilter(name),
        onRemove: () => {
          change({ tagIds: criteria.tagIds.filter((chosen) => chosen !== id) })
        },
      })
    }
  }

  for (const id of criteria.ingredientIds) {
    const name = ingredientNames.get(id)
    if (name === undefined) continue
    chips.push({
      key: `ingredient-${id}`,
      label: name,
      removeLabel: active.removeFilter(name),
      onRemove: () => {
        change({ ingredientIds: criteria.ingredientIds.filter((chosen) => chosen !== id) })
      },
    })
  }

  const author = criteria.author.trim()
  if (showAuthor && author !== '') {
    const label = active.byAuthor(author)
    chips.push({
      key: 'author',
      label,
      removeLabel: active.removeFilter(label),
      onRemove: () => {
        change({ author: '' })
      },
    })
  }

  return chips
}
