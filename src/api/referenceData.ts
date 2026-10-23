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
    queryFn: ({ signal }) => unwrap(api.GET('/categories', { signal })),
  })
}

/** The main categories, each with its subcategories nested beneath it: one call for a menu. */
export function useCategoryHierarchy() {
  return useQuery({
    queryKey: referenceDataKeys.categoryHierarchy,
    queryFn: ({ signal }) => unwrap(api.GET('/categories/hierarchy', { signal })),
  })
}

export function useTags() {
  return useQuery({
    queryKey: referenceDataKeys.tags,
    queryFn: ({ signal }) => unwrap(api.GET('/tags', { signal })),
  })
}

export function useUnits() {
  return useQuery({
    queryKey: referenceDataKeys.units,
    queryFn: ({ signal }) => unwrap(api.GET('/units', { signal })),
  })
}
