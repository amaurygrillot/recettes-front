/** The order a search is shown in. The URL spells them in French; the API asks in `sortBy` and `direction`. */
export type SortKey = 'recent' | 'modified' | 'title-asc' | 'title-desc'

export const DEFAULT_SORT: SortKey = 'recent'

/** The most the API takes for a title search (`@Size(max = 200)`), and so the most the field takes. */
export const MAX_QUERY_LENGTH = 200

/**
 * Everything a search is made of. The URL is its home (`/rechercher?q=tarte&categorie=…`): a search
 * can be linked, reloaded, and walked back through. The API takes one category and one tag, and
 * has no ingredient criterion, so neither does this.
 */
export interface SearchCriteria {
  /** Matched against the titles. */
  query: string
  categoryId: string | undefined
  /** Only the recipes filed under the category itself, not beneath it. */
  exactCategory: boolean
  tagId: string | undefined
  /** Matched against the authors' usernames. */
  author: string
  sort: SortKey
}

export const EMPTY_CRITERIA: SearchCriteria = {
  query: '',
  categoryId: undefined,
  exactCategory: false,
  tagId: undefined,
  author: '',
  sort: DEFAULT_SORT,
}

const PARAMETERS = {
  query: 'q',
  category: 'categorie',
  exactCategory: 'exacte',
  tag: 'tag',
  author: 'auteur',
  sort: 'tri',
} as const

const SORT_SPELLINGS: readonly { key: SortKey; parameter: string }[] = [
  { key: 'recent', parameter: 'recentes' },
  { key: 'modified', parameter: 'modifiees' },
  { key: 'title-asc', parameter: 'titre-az' },
  { key: 'title-desc', parameter: 'titre-za' },
]

const PARAMETER_BY_SORT = new Map(SORT_SPELLINGS.map(({ key, parameter }) => [key, parameter]))
const SORT_BY_PARAMETER = new Map(
  SORT_SPELLINGS.map(({ key, parameter }): [string, SortKey] => [parameter, key]),
)

function nonEmpty(value: string | null): string | undefined {
  return value === null || value === '' ? undefined : value
}

/** The criteria a URL asks for. What it does not say, or says wrongly, is the default. */
export function criteriaFromParams(params: URLSearchParams): SearchCriteria {
  const categoryId = nonEmpty(params.get(PARAMETERS.category))
  return {
    query: (params.get(PARAMETERS.query) ?? '').slice(0, MAX_QUERY_LENGTH),
    categoryId,
    // « Only this category » means nothing without a category.
    exactCategory: categoryId !== undefined && params.get(PARAMETERS.exactCategory) === '1',
    tagId: nonEmpty(params.get(PARAMETERS.tag)),
    author: params.get(PARAMETERS.author) ?? '',
    sort: SORT_BY_PARAMETER.get(params.get(PARAMETERS.sort) ?? '') ?? DEFAULT_SORT,
  }
}

/** The query string of some criteria: only what differs from the default, so a plain search has none. */
export function criteriaToParams(criteria: SearchCriteria): URLSearchParams {
  const params = new URLSearchParams()
  if (criteria.query !== '') params.set(PARAMETERS.query, criteria.query)
  if (criteria.categoryId !== undefined) {
    params.set(PARAMETERS.category, criteria.categoryId)
    if (criteria.exactCategory) params.set(PARAMETERS.exactCategory, '1')
  }
  if (criteria.tagId !== undefined) params.set(PARAMETERS.tag, criteria.tagId)
  if (criteria.author !== '') params.set(PARAMETERS.author, criteria.author)
  const sortParameter = PARAMETER_BY_SORT.get(criteria.sort)
  if (criteria.sort !== DEFAULT_SORT && sortParameter !== undefined) {
    params.set(PARAMETERS.sort, sortParameter)
  }
  return params
}

/** How many filters are chosen: what the « Filtres » button counts. The title text is not one. */
export function activeFilterCount(criteria: SearchCriteria): number {
  return (
    Number(criteria.categoryId !== undefined) +
    Number(criteria.tagId !== undefined) +
    Number(criteria.author !== '')
  )
}

/** Whether the search narrows anything down: a text or a filter. The order alone does not. */
export function isNarrowed(criteria: SearchCriteria): boolean {
  return criteria.query !== '' || activeFilterCount(criteria) > 0
}
