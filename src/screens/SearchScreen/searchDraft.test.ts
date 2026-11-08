import { describe, expect, it } from 'vitest'
import { EMPTY_CRITERIA, type SearchCriteria } from '../../app/searchCriteria'
import { canSearch, criteriaOf, draftOf, EMPTY_DRAFT } from './searchDraft'

const SEARCHED: SearchCriteria = {
  query: 'tarte',
  categoryId: 'c-1',
  tagIds: ['t-1', 't-2'],
  ingredientIds: ['i-1', 'i-2'],
  author: 'Odile',
  sort: 'title-asc',
}

describe('searchDraft', () => {
  it('starts from a search already made, without its order', () => {
    expect(draftOf(SEARCHED)).toEqual({
      query: 'tarte',
      categoryId: 'c-1',
      tagIds: ['t-1', 't-2'],
      ingredientIds: ['i-1', 'i-2'],
      author: 'Odile',
    })
  })

  it('starts from nothing', () => {
    expect(draftOf(EMPTY_CRITERIA)).toEqual(EMPTY_DRAFT)
  })

  it('gives back the search it asks for, with the order it is told to keep', () => {
    expect(criteriaOf(draftOf(SEARCHED), 'modified')).toEqual({ ...SEARCHED, sort: 'modified' })
  })

  it('does not search for the spaces around an author either', () => {
    expect(criteriaOf({ ...EMPTY_DRAFT, author: ' Odile ' }, 'recent').author).toBe('Odile')
  })

  it('does not search for the spaces around a word', () => {
    expect(criteriaOf({ ...EMPTY_DRAFT, query: '  gratin  ' }, 'recent').query).toBe('gratin')
  })

  it.each([
    ['nothing', false, EMPTY_DRAFT, false],
    ['spaces only', false, { ...EMPTY_DRAFT, query: '   ' }, false],
    ['a word', true, { ...EMPTY_DRAFT, query: 'tarte' }, false],
    ['a category', true, { ...EMPTY_DRAFT, categoryId: 'c-1' }, false],
    ['a tag', true, { ...EMPTY_DRAFT, tagIds: ['t-1'] }, false],
    ['an ingredient', true, { ...EMPTY_DRAFT, ingredientIds: ['i-1'] }, false],
    ['an author', true, { ...EMPTY_DRAFT, author: 'Odile' }, false],
    ['spaces as an author', false, { ...EMPTY_DRAFT, author: '  ' }, false],
    ['nothing, in « Mes recettes »', true, EMPTY_DRAFT, true],
  ])('with %s, can search: %s', (_what, expected, draft, mine) => {
    expect(canSearch(draft, mine)).toBe(expected)
  })
})
