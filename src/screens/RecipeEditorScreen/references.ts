import { createContext, use } from 'react'
import { useCategoryHierarchy, useTags, useUnits } from '../../api/referenceData'
import { categoryNodesOf, type CategoryNode } from '../../app/categoryNodes'
import { categoryPath } from './choices'
import type { CategoryLabeller, Choice } from './editorModel'

/** A unit to choose in a line: its short name when it has one (« g »), its name otherwise (« pincée »). */
export interface UnitOption {
  id: string
  label: string
}

/** What a recipe is written with, and can only be chosen from: the categories, the tags and the units. */
export interface References {
  categories: readonly CategoryNode[]
  tags: readonly Choice[]
  units: readonly UnitOption[]
  /** What a recipe's category is called in the form: « Desserts › Tartes ». */
  categoryLabel: CategoryLabeller
}

export type ReferencesState =
  | { status: 'loading' }
  | { status: 'failed'; retry: () => void }
  | { status: 'ready'; references: References }

/** Loads the vocabulary of a recipe. The editor is not shown until it is all there, or says it could not be. */
export function useReferencesState(): ReferencesState {
  const hierarchy = useCategoryHierarchy()
  const tagList = useTags()
  const unitList = useUnits()

  if (hierarchy.isError || tagList.isError || unitList.isError) {
    return {
      status: 'failed',
      retry: () => {
        if (hierarchy.isError) void hierarchy.refetch()
        if (tagList.isError) void tagList.refetch()
        if (unitList.isError) void unitList.refetch()
      },
    }
  }
  if (hierarchy.data === undefined || tagList.data === undefined || unitList.data === undefined) {
    return { status: 'loading' }
  }

  const categories = categoryNodesOf(hierarchy.data)
  return {
    status: 'ready',
    references: {
      categories,
      tags: tagList.data.flatMap(({ id, name }) => (id && name ? [{ id, label: name }] : [])),
      units: unitList.data.flatMap(({ id, name, abbreviation }) =>
        id && name ? [{ id, label: abbreviation ?? name }] : [],
      ),
      categoryLabel: ({ id, name }) =>
        (id === undefined ? undefined : categoryPath(categories, id)) ?? name ?? '',
    },
  }
}

export const ReferencesContext = createContext<References | null>(null)

/** The vocabulary, for the parts of the form that choose from it. */
export function useReferences(): References {
  const references = use(ReferencesContext)
  if (references === null) throw new Error('useReferences needs the editor around it')
  return references
}
