import { describe, expect, it } from 'vitest'
import {
  activeFilterCount,
  criteriaFromParams,
  criteriaToParams,
  EMPTY_CRITERIA,
  isNarrowed,
  MAX_QUERY_LENGTH,
  type SearchCriteria,
} from './searchCriteria'

const from = (query: string) => criteriaFromParams(new URLSearchParams(query))

describe('criteriaFromParams', () => {
  it('is the default search for a URL that says nothing', () => {
    expect(from('')).toEqual(EMPTY_CRITERIA)
  })

  it('reads every criterion', () => {
    expect(from('q=tarte&categorie=c-1&exacte=1&tag=t-1&auteur=Odile&tri=titre-az')).toEqual({
      query: 'tarte',
      categoryId: 'c-1',
      exactCategory: true,
      tagId: 't-1',
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

  it('ignores « only this category » when there is no category', () => {
    expect(from('exacte=1').exactCategory).toBe(false)
  })

  it('treats an empty category or tag as none', () => {
    expect(from('categorie=&tag=')).toMatchObject({ categoryId: undefined, tagId: undefined })
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
      exactCategory: true,
      tagId: 't-1',
      author: 'Odile',
      sort: 'title-desc',
    }

    expect(criteriaToParams(criteria).toString()).toBe(
      'q=tarte+%26+cr%C3%A8me&categorie=c-1&exacte=1&tag=t-1&auteur=Odile&tri=titre-za',
    )
  })

  it('does not write « only this category » without a category', () => {
    expect(criteriaToParams({ ...EMPTY_CRITERIA, exactCategory: true }).toString()).toBe('')
  })

  it('reads back what it wrote', () => {
    const criteria: SearchCriteria = {
      query: 'crème brûlée',
      categoryId: 'c-1',
      exactCategory: false,
      tagId: undefined,
      author: 'Odile',
      sort: 'modified',
    }

    expect(criteriaFromParams(criteriaToParams(criteria))).toEqual(criteria)
  })
})

describe('activeFilterCount and isNarrowed', () => {
  it('counts the category, the tag and the author, not the text or the order', () => {
    expect(activeFilterCount(EMPTY_CRITERIA)).toBe(0)
    expect(activeFilterCount({ ...EMPTY_CRITERIA, query: 'tarte', sort: 'title-asc' })).toBe(0)
    expect(
      activeFilterCount({ ...EMPTY_CRITERIA, categoryId: 'c', tagId: 't', author: 'Odile' }),
    ).toBe(3)
  })

  it('is narrowed by a text or a filter, not by the order', () => {
    expect(isNarrowed(EMPTY_CRITERIA)).toBe(false)
    expect(isNarrowed({ ...EMPTY_CRITERIA, sort: 'modified' })).toBe(false)
    expect(isNarrowed({ ...EMPTY_CRITERIA, query: 'tarte' })).toBe(true)
    expect(isNarrowed({ ...EMPTY_CRITERIA, tagId: 't' })).toBe(true)
  })
})
