import { describe, expect, it } from 'vitest'
import {
  activeFilterCount,
  criteriaFromParams,
  criteriaToParams,
  EMPTY_CRITERIA,
  isNarrowed,
  MAX_INGREDIENT_FILTERS,
  MAX_QUERY_LENGTH,
  MAX_TAG_FILTERS,
  type SearchCriteria,
} from './searchCriteria'

const from = (query: string) => criteriaFromParams(new URLSearchParams(query))

describe('criteriaFromParams', () => {
  it('is the default search for a URL that says nothing', () => {
    expect(from('')).toEqual(EMPTY_CRITERIA)
  })

  it('reads every criterion', () => {
    expect(
      from(
        'q=tarte&categorie=c-1&tag=t-1&tag=t-2&ingredient=i-1&ingredient=i-2&auteur=Odile&tri=titre-az',
      ),
    ).toEqual({
      query: 'tarte',
      categoryId: 'c-1',
      tagIds: ['t-1', 't-2'],
      ingredientIds: ['i-1', 'i-2'],
      author: 'Odile',
      sort: 'title-asc',
    })
  })

  it.each([
    ['recentes', 'recent'],
    ['modifiees', 'modified'],
    ['titre-az', 'title-asc'],
    ['titre-za', 'title-desc'],
  ] as const)('reads the order « %s » as %s', (parameter, sort) => {
    expect(from(`tri=${parameter}`).sort).toBe(sort)
  })

  it.each(['tri=nimporte', 'tri=', 'tri=TITRE-AZ'])(
    'falls back to the default order for « %s »',
    (query) => {
      expect(from(query).sort).toBe('recent')
    },
  )

  it('ignores « exacte », which an old link may carry: a category always takes what is beneath it', () => {
    expect(from('categorie=c-1&exacte=1')).toEqual({ ...EMPTY_CRITERIA, categoryId: 'c-1' })
  })

  it('treats an empty category or tag as none', () => {
    expect(from('categorie=&tag=')).toMatchObject({ categoryId: undefined, tagIds: [] })
  })

  it('reads as many tags as the address has, each once, in its order, without the empty ones', () => {
    expect(from('tag=t-2&tag=&tag=t-1&tag=t-3&tag=t-2').tagIds).toEqual(['t-2', 't-1', 't-3'])
  })

  it('keeps no more tags than the API takes', () => {
    const many = Array.from({ length: MAX_TAG_FILTERS + 5 }, (_, index) => `tag=t-${index}`)

    expect(from(many.join('&')).tagIds).toHaveLength(MAX_TAG_FILTERS)
  })

  it('reads each ingredient once, in the order of the address, without the empty ones', () => {
    expect(from('ingredient=i-2&ingredient=&ingredient=i-1&ingredient=i-2').ingredientIds).toEqual([
      'i-2',
      'i-1',
    ])
  })

  it('keeps no more ingredients than the API takes', () => {
    const many = Array.from(
      { length: MAX_INGREDIENT_FILTERS + 5 },
      (_, index) => `ingredient=i-${index}`,
    )

    expect(from(many.join('&')).ingredientIds).toHaveLength(MAX_INGREDIENT_FILTERS)
  })

  it('cuts a text longer than the API accepts', () => {
    expect(from(`q=${'a'.repeat(MAX_QUERY_LENGTH + 50)}`).query).toHaveLength(MAX_QUERY_LENGTH)
  })
})

describe('criteriaToParams', () => {
  it('has no query string for the default search', () => {
    expect(criteriaToParams(EMPTY_CRITERIA).toString()).toBe('')
  })

  it('writes what differs from the default, text first', () => {
    const criteria: SearchCriteria = {
      query: 'tarte & crème',
      categoryId: 'c-1',
      tagIds: ['t-1', 't-2'],
      ingredientIds: ['i-1', 'i-2'],
      author: 'Odile',
      sort: 'title-desc',
    }

    expect(criteriaToParams(criteria).toString()).toBe(
      'q=tarte+%26+cr%C3%A8me&categorie=c-1&tag=t-1&tag=t-2&ingredient=i-1&ingredient=i-2&auteur=Odile&tri=titre-za',
    )
  })

  it('reads back what it wrote', () => {
    const criteria: SearchCriteria = {
      query: 'crème brûlée',
      categoryId: 'c-1',
      tagIds: ['t-1', 't-2'],
      ingredientIds: ['i-1', 'i-2'],
      author: 'Odile',
      sort: 'modified',
    }

    expect(criteriaFromParams(criteriaToParams(criteria))).toEqual(criteria)
  })
})

describe('activeFilterCount and isNarrowed', () => {
  it('counts the category, each tag, each ingredient and the author, not the text or the order', () => {
    expect(activeFilterCount(EMPTY_CRITERIA)).toBe(0)
    expect(activeFilterCount({ ...EMPTY_CRITERIA, query: 'tarte', sort: 'title-asc' })).toBe(0)
    expect(
      activeFilterCount({ ...EMPTY_CRITERIA, categoryId: 'c', tagIds: ['t'], author: 'Odile' }),
    ).toBe(3)
    expect(activeFilterCount({ ...EMPTY_CRITERIA, tagIds: ['t-1', 't-2', 't-3'] })).toBe(3)
    expect(activeFilterCount({ ...EMPTY_CRITERIA, ingredientIds: ['i-1', 'i-2'] })).toBe(2)
  })

  it('is narrowed by a text or a filter, not by the order', () => {
    expect(isNarrowed(EMPTY_CRITERIA)).toBe(false)
    expect(isNarrowed({ ...EMPTY_CRITERIA, sort: 'modified' })).toBe(false)
    expect(isNarrowed({ ...EMPTY_CRITERIA, query: 'tarte' })).toBe(true)
    expect(isNarrowed({ ...EMPTY_CRITERIA, tagIds: ['t'] })).toBe(true)
    expect(isNarrowed({ ...EMPTY_CRITERIA, ingredientIds: ['i-1'] })).toBe(true)
  })

  it('does not take spaces for a word or an author: they would list the whole library', () => {
    const spaces = { ...EMPTY_CRITERIA, query: '  ', author: '   ' }

    expect(activeFilterCount(spaces)).toBe(0)
    expect(isNarrowed(spaces)).toBe(false)
  })
})
