import type { RecipeSearchFilters } from '../../api/recipes'
import type { SearchCriteria, SortKey } from '../../app/searchCriteria'

/** Whose recipes are listed: everybody's, or one member's (« Mes recettes »). */
export type SearchScope = { kind: 'all' } | { kind: 'mine'; authorId: string }

const SORTS: Record<SortKey, Pick<RecipeSearchFilters, 'sortBy' | 'direction'>> = {
  recent: { sortBy: 'CREATED_AT', direction: 'DESC' },
  modified: { sortBy: 'UPDATED_AT', direction: 'DESC' },
  'title-asc': { sortBy: 'TITLE', direction: 'ASC' },
  'title-desc': { sortBy: 'TITLE', direction: 'DESC' },
}

/**
 * What to ask the API for. In « Mes recettes » the author is the member, by id, and the author
 * text is ignored: the field is not offered there, and a link that carries one must not widen the list.
 */
export function toRecipeFilters(criteria: SearchCriteria, scope: SearchScope): RecipeSearchFilters {
  const title = criteria.query.trim()
  const author = criteria.author.trim()
  return {
    ...SORTS[criteria.sort],
    ...(title !== '' && { title }),
    ...(criteria.categoryId !== undefined && { categoryId: criteria.categoryId }),
    // Absent means « with the subcategories »: only the exact reading has to be asked for.
    ...(criteria.categoryId !== undefined &&
      criteria.exactCategory && { includeSubcategories: false }),
    ...(criteria.tagId !== undefined && { tagId: criteria.tagId }),
    ...(scope.kind === 'mine' && { authorId: scope.authorId }),
    ...(scope.kind === 'all' && author !== '' && { authorName: author }),
  }
}
