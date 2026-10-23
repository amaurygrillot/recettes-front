import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { components, paths } from './schema'
import { unwrap } from './unwrap'

export type IngredientSearch = NonNullable<paths['/ingredients']['get']['parameters']['query']>

const ingredientKeys = {
  searches: ['ingredients', 'search'] as const,
  search: (search: IngredientSearch) => ['ingredients', 'search', search] as const,
}

/** As-you-type search: the previous results stay on screen while the next keystroke loads. */
export function useIngredientSearch(search: IngredientSearch) {
  return useQuery({
    queryKey: ingredientKeys.search(search),
    queryFn: () => unwrap(api.GET('/ingredients', { params: { query: search } })),
    placeholderData: keepPreviousData,
  })
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
