import { useCategoryHierarchy, useTags } from '../../api/referenceData'
import type { ComboboxOption } from '../../components/Combobox/Combobox'
import { categoryNodesOf, categoryOptionsOf, type CategoryNode } from './categoryNodes'

export interface TagChoice {
  id: string
  name: string
}

/** What the filters can be chosen among: the category tree and the tags. */
export type FilterOptions =
  | { status: 'loading' }
  | { status: 'failed'; retry: () => void }
  | {
      status: 'ready'
      categories: readonly CategoryNode[]
      categoryOptions: readonly ComboboxOption[]
      tags: readonly TagChoice[]
      tagOptions: readonly ComboboxOption[]
    }

export function useFilterOptions(): FilterOptions {
  const hierarchy = useCategoryHierarchy()
  const tagList = useTags()

  if (hierarchy.isError || tagList.isError) {
    return {
      status: 'failed',
      retry: () => {
        if (hierarchy.isError) void hierarchy.refetch()
        if (tagList.isError) void tagList.refetch()
      },
    }
  }
  if (hierarchy.data === undefined || tagList.data === undefined) return { status: 'loading' }

  const categories = categoryNodesOf(hierarchy.data)
  const tags = tagList.data.flatMap(({ id, name }) => (id && name ? [{ id, name }] : []))
  return {
    status: 'ready',
    categories,
    categoryOptions: categoryOptionsOf(categories),
    tags,
    tagOptions: tags.map(({ id, name }) => ({ id, label: name })),
  }
}
