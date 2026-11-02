import {
  DEFAULT_SORT,
  isNarrowed,
  type SearchCriteria,
  type SortKey,
} from '../../app/searchCriteria'
import { filterChoicesOf, NO_FILTERS, type FilterChoices } from './filterChoices'

/** What the search overlay edits: the title text and the filter choices. The address only hears of them when it is validated. */
export interface SearchDraft extends FilterChoices {
  query: string
}

export const EMPTY_DRAFT: SearchDraft = { query: '', ...NO_FILTERS }

/** The draft that starts from a search already made (the results page's) or from nothing. */
export function draftOf(criteria: SearchCriteria): SearchDraft {
  return { query: criteria.query, ...filterChoicesOf(criteria) }
}

/** The search a draft asks for. The order belongs to the results page, so the search keeps the one it had. */
export function criteriaOf(draft: SearchDraft, sort: SortKey): SearchCriteria {
  return { ...draft, query: draft.query.trim(), sort }
}

/**
 * Whether there is something to search for: a word, a filter, or « Mes recettes », which is a filter of its own.
 * No search leads to the whole library.
 */
export function canSearch(draft: SearchDraft, mine: boolean): boolean {
  return mine || isNarrowed(criteriaOf(draft, DEFAULT_SORT))
}
