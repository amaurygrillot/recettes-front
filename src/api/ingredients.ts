import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { normalizeText } from '../lib/normalizeText'
import { api } from './client'
import type { components, paths } from './schema'
import { unwrap } from './unwrap'

export type IngredientSearch = NonNullable<paths['/ingredients']['get']['parameters']['query']>

const ingredientKeys = {
  searches: ['ingredients', 'search'] as const,
  detail: (id: string) => ['ingredients', 'detail', id] as const,
  search: (search: IngredientSearch) => ['ingredients', 'search', search] as const,
}

function searchIngredients(search: IngredientSearch, signal: AbortSignal) {
  return unwrap(api.GET('/ingredients', { params: { query: search }, signal }))
}

/**
 * As-you-type search: the previous results stay on screen while the next keystroke loads. It asks
 * nothing while `enabled` is false (nothing typed yet).
 */
export function useIngredientSearch(search: IngredientSearch, enabled = true) {
  return useQuery({
    enabled,
    queryKey: ingredientKeys.search(search),
    queryFn: ({ signal }) => searchIngredients(search, signal),
    placeholderData: keepPreviousData,
  })
}

function getIngredient(id: string, signal: AbortSignal) {
  return unwrap(api.GET('/ingredients/{id}', { params: { path: { id } }, signal }))
}

/**
 * The names of some ingredients known by their ids (a search keeps ids in its address), as a map. An
 * ingredient is asked for once and kept, whoever needs its name; one that cannot be found (deleted
 * since the link was made) is simply not in the map.
 */
export function useIngredientNames(ids: readonly string[]): ReadonlyMap<string, string> {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ingredientKeys.detail(id),
      queryFn: ({ signal }: { signal: AbortSignal }) => getIngredient(id, signal),
    })),
    combine: (results) =>
      new Map(
        results.flatMap(({ data }) =>
          data?.id !== undefined && data.name !== undefined ? [[data.id, data.name] as const] : [],
        ),
      ),
  })
}

/**
 * Remembers an ingredient that was just picked from a list, so its name is known without asking for it
 * again (see `useIngredientNames`).
 */
export function useRememberIngredient() {
  const queryClient = useQueryClient()
  return (id: string, name: string) => {
    queryClient.setQueryData(ingredientKeys.detail(id), { id, name })
  }
}

/**
 * Looks for the ingredient that already has this name (the back end compares without regard to
 * accents or case, so « pois chiche » is « Pois chiche »): what to choose when creating it answered 409.
 */
export function useFindIngredient() {
  const queryClient = useQueryClient()
  return async (name: string) => {
    const search: IngredientSearch = { namePrefix: name, size: 20 }
    const page = await queryClient.query({
      queryKey: ingredientKeys.search(search),
      queryFn: ({ signal }) => searchIngredients(search, signal),
      staleTime: 0,
    })
    return page.content?.find(
      (ingredient) =>
        ingredient.name !== undefined && normalizeText(ingredient.name) === normalizeText(name),
    )
  }
}

/** Any member may add an ingredient, since a recipe cannot be written without the ones it uses. */
export function useCreateIngredient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ingredient: components['schemas']['IngredientRequest']) =>
      unwrap(api.POST('/ingredients', { body: ingredient })),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ingredientKeys.searches })
    },
  })
}
