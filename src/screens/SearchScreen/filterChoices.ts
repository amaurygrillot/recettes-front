import type { SearchCriteria } from '../../app/searchCriteria'
import { strings } from './strings'

/** The part of a search that the « Filtres » choose: not the title text, not the order. */
export type FilterChoices = Pick<
  SearchCriteria,
  'categoryId' | 'tagIds' | 'ingredientIds' | 'author'
>

export const NO_FILTERS: FilterChoices = {
  categoryId: undefined,
  tagIds: [],
  ingredientIds: [],
  author: '',
}

export function filterChoicesOf({
  categoryId,
  tagIds,
  ingredientIds,
  author,
}: SearchCriteria): FilterChoices {
  return { categoryId, tagIds, ingredientIds, author }
}

export type SectionKey = 'category' | 'tags' | 'ingredients' | 'author'

/** Where each section of the filters is, for the pills that jump to them. The overlay's panel and a desktop's column can both be in the page, but the page behind a modal overlay is inert. */
export const SECTION_IDS: Record<SectionKey, string> = {
  category: 'filter-section-category',
  tags: 'filter-section-tags',
  ingredients: 'filter-section-ingredients',
  author: 'filter-section-author',
}

export interface FilterSection {
  key: SectionKey
  id: string
  label: string
  /** How many choices are active in it. */
  count: number
}

/** The sections on offer, with what is chosen in each. The author is not offered in « Mes recettes ». */
export function filterSectionsOf(choices: FilterChoices, showAuthor: boolean): FilterSection[] {
  const sections: FilterSection[] = [
    {
      key: 'category',
      id: SECTION_IDS.category,
      label: strings.filters.category.legend,
      count: Number(choices.categoryId !== undefined),
    },
    {
      key: 'tags',
      id: SECTION_IDS.tags,
      label: strings.filters.tags.legend,
      count: choices.tagIds.length,
    },
    {
      key: 'ingredients',
      id: SECTION_IDS.ingredients,
      label: strings.filters.ingredients.legend,
      count: choices.ingredientIds.length,
    },
  ]
  if (showAuthor) {
    sections.push({
      key: 'author',
      id: SECTION_IDS.author,
      label: strings.filters.author.legend,
      count: Number(choices.author.trim() !== ''),
    })
  }
  return sections
}
