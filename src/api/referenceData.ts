import { useQuery } from '@tanstack/react-query'
import { api } from './client'
import { unwrap } from './unwrap'

// Categories, tags and units are the vocabulary recipes are written with. All three are public,
// small and not paginated. Writing them is admin-only and has no screen yet.

export const referenceDataKeys = {
  categories: ['categories'] as const,
  categoryHierarchy: ['categories', 'hierarchy'] as const,
  tags: ['tags'] as const,
  units: ['units'] as const,
}

/** Every category at every level, flat and sorted by name. */
export function useCategories() {
  return useQuery({
    queryKey: referenceDataKeys.categories,
    queryFn: () => unwrap(api.GET('/categories')),
  })
}

/** The main categories, each with its subcategories nested beneath it: one call for a menu. */
export function useCategoryHierarchy() {
  return useQuery({
    queryKey: referenceDataKeys.categoryHierarchy,
    queryFn: () => unwrap(api.GET('/categories/hierarchy')),
  })
}

export function useTags() {
  return useQuery({
    queryKey: referenceDataKeys.tags,
    queryFn: () => unwrap(api.GET('/tags')),
  })
}

export function useUnits() {
  return useQuery({
    queryKey: referenceDataKeys.units,
    queryFn: () => unwrap(api.GET('/units')),
  })
}
