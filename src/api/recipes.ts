import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'
import { api } from './client'
import type { components, paths } from './schema'
import { unwrap, unwrapEmpty } from './unwrap'

type Schemas = components['schemas']

/** Everything `GET /recipes` can filter and sort on; the page index is the hook's business. */
export type RecipeSearchFilters = Omit<
  NonNullable<paths['/recipes']['get']['parameters']['query']>,
  'page'
>

export const recipeKeys = {
  all: ['recipes'] as const,
  searches: ['recipes', 'search'] as const,
  search: (filters: RecipeSearchFilters) => ['recipes', 'search', filters] as const,
  count: (filters: RecipeSearchFilters) => ['recipes', 'search', 'count', filters] as const,
  detail: (id: string) => ['recipes', 'detail', id] as const,
}

function searchRecipes(filters: RecipeSearchFilters, page: number, signal: AbortSignal) {
  return unwrap(api.GET('/recipes', { params: { query: { ...filters, page } }, signal }))
}

/**
 * The feed and the search results, a page at a time (« Voir plus » calls `fetchNextPage`). When
 * the filters change, the previous answer stays in `data` (with `isPlaceholderData` true) until
 * the new one arrives, so a list being refined never blanks.
 */
export function useRecipeSearch(filters: RecipeSearchFilters) {
  return useInfiniteQuery({
    queryKey: recipeKeys.search(filters),
    queryFn: ({ pageParam, signal }) => searchRecipes(filters, pageParam, signal),
    placeholderData: keepPreviousData,
    initialPageParam: 0,
    // `last` is Spring's own flag; anything but an explicit `false` ends the list.
    getNextPageParam: (lastPage) =>
      lastPage.last === false ? (lastPage.number ?? 0) + 1 : undefined,
  })
}

/** How many recipes match, without loading them: `totalElements` of a page of one. */
export function useRecipeCount(filters: RecipeSearchFilters, enabled = true) {
  return useQuery({
    enabled,
    queryKey: recipeKeys.count(filters),
    queryFn: async ({ signal }) => {
      const page = await searchRecipes({ ...filters, size: 1 }, 0, signal)
      return page.totalElements ?? 0
    },
    placeholderData: keepPreviousData,
  })
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: ({ signal }) => unwrap(api.GET('/recipes/{id}', { params: { path: { id } }, signal })),
  })
}

/** A saved recipe is the freshest copy of itself, and makes every list stale. */
function cacheSavedRecipe(queryClient: QueryClient, recipe: Schemas['RecipeResponse']): void {
  if (recipe.id !== undefined) queryClient.setQueryData(recipeKeys.detail(recipe.id), recipe)
  void queryClient.invalidateQueries({ queryKey: recipeKeys.searches })
}

export function useCreateRecipe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (recipe: Schemas['CreateRecipeRequest']) =>
      unwrap(api.POST('/recipes', { body: recipe })),
    onSuccess: (recipe) => {
      cacheSavedRecipe(queryClient, recipe)
    },
  })
}

export interface RecipeUpdate {
  id: string
  /** A partial update: an absent field is left alone, a present collection replaces the whole one. */
  changes: Schemas['UpdateRecipeRequest']
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, changes }: RecipeUpdate) =>
      unwrap(api.PUT('/recipes/{id}', { params: { path: { id } }, body: changes })),
    onSuccess: (recipe) => {
      cacheSavedRecipe(queryClient, recipe)
    },
  })
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      unwrapEmpty(api.DELETE('/recipes/{id}', { params: { path: { id } } })),
    onSuccess: (_nothing, id) => {
      queryClient.removeQueries({ queryKey: recipeKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: recipeKeys.searches })
    },
  })
}
