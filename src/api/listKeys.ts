import type { RecipeSearchFilters } from './recipes'

/** What of a list's content is asked for: everything `GET /recipes` can filter and sort on, but the list itself. */
export type ListContentFilters = Omit<RecipeSearchFilters, 'listId'>

/**
 * The query keys of everything private to the signed-in member. They live under two roots, and only
 * these two (`privateData.ts` removes both when the person changes): the lists with what they hold,
 * and the photos of the lists, which are kept apart because a photo never changes behind its version
 * and must not be refetched each time a list is touched.
 */
export const listKeys = {
  all: ['lists'] as const,
  mine: ['lists', 'mine'] as const,
  containingAny: ['lists', 'containing'] as const,
  containing: (recipeId: string) => ['lists', 'containing', recipeId] as const,
  detail: (id: string) => ['lists', 'detail', id] as const,
  contentOf: (id: string) => ['lists', 'content', id] as const,
  content: (id: string, filters: ListContentFilters) => ['lists', 'content', id, filters] as const,
}

export type CoverVariant = 'full' | 'thumbnail'

export const listCoverKeys = {
  all: ['list-covers'] as const,
  of: (listId: string) => ['list-covers', listId] as const,
  one: (listId: string, version: string, variant: CoverVariant) =>
    ['list-covers', listId, version, variant] as const,
}
