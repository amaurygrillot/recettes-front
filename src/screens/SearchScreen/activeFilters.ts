import type { SearchCriteria } from '../../app/searchCriteria'
import type { ActiveFilter } from './components/ActiveFilters/ActiveFilters'
import { findCategory } from '../../app/categoryNodes'
import type { FilterChoices } from './filterChoices'
import { strings } from './strings'
import type { FilterOptions } from './useFilterOptions'

const { active } = strings

/**
 * The chips for the filters in force, each able to drop its filter. The names of a category and a
 * tag come with the options: until they are loaded their chips are not shown (the filter itself
 * is already applied), rather than showing an id.
 */
export function activeFiltersOf(
  criteria: SearchCriteria,
  options: FilterOptions,
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

  if (criteria.tagId !== undefined && options.status === 'ready') {
    const name = options.tags.find((tag) => tag.id === criteria.tagId)?.name
    if (name !== undefined) {
      chips.push({
        key: 'tag',
        label: name,
        removeLabel: active.removeFilter(name),
        onRemove: () => {
          change({ tagId: undefined })
        },
      })
    }
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
