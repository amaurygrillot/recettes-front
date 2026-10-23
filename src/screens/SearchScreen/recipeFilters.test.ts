import { describe, expect, it } from 'vitest'
import { EMPTY_CRITERIA, type SearchCriteria } from '../../app/searchCriteria'
import { toRecipeFilters, type SearchScope } from './recipeFilters'

const ALL: SearchScope = { kind: 'all' }
const MINE: SearchScope = { kind: 'mine', authorId: 'u-42' }

describe('toRecipeFilters', () => {
  it('asks for the newest first when nothing else is said', () => {
    expect(toRecipeFilters(EMPTY_CRITERIA, ALL)).toEqual({
      sortBy: 'CREATED_AT',
      direction: 'DESC',
    })
  })

  it.each([
    ['recent', 'CREATED_AT', 'DESC'],
    ['modified', 'UPDATED_AT', 'DESC'],
    ['title-asc', 'TITLE', 'ASC'],
    ['title-desc', 'TITLE', 'DESC'],
  ] as const)('maps the order %s to %s %s', (sort, sortBy, direction) => {
    expect(toRecipeFilters({ ...EMPTY_CRITERIA, sort }, ALL)).toEqual({ sortBy, direction })
  })

  it('sends every criterion that is set, the text and the author trimmed', () => {
    const criteria: SearchCriteria = {
      query: '  tarte ',
      categoryId: 'c-1',
      exactCategory: false,
      tagId: 't-1',
      author: ' Odile ',
      sort: 'recent',
    }

    expect(toRecipeFilters(criteria, ALL)).toEqual({
      sortBy: 'CREATED_AT',
      direction: 'DESC',
      title: 'tarte',
      categoryId: 'c-1',
      tagId: 't-1',
      authorName: 'Odile',
    })
  })

  it('leaves out a blank text or author rather than filtering on nothing', () => {
    const filters = toRecipeFilters({ ...EMPTY_CRITERIA, query: '   ', author: '  ' }, ALL)

    expect(filters).not.toHaveProperty('title')
    expect(filters).not.toHaveProperty('authorName')
  })

  it('asks for the exact category only when told to, and only with a category', () => {
    const inclusive = toRecipeFilters({ ...EMPTY_CRITERIA, categoryId: 'c-1' }, ALL)
    expect(inclusive).not.toHaveProperty('includeSubcategories')

    const exact = toRecipeFilters(
      { ...EMPTY_CRITERIA, categoryId: 'c-1', exactCategory: true },
      ALL,
    )
    expect(exact).toHaveProperty('includeSubcategories', false)

    const orphan = toRecipeFilters({ ...EMPTY_CRITERIA, exactCategory: true }, ALL)
    expect(orphan).not.toHaveProperty('includeSubcategories')
  })

  describe('in « Mes recettes »', () => {
    it('filters on the member by id', () => {
      expect(toRecipeFilters(EMPTY_CRITERIA, MINE)).toMatchObject({ authorId: 'u-42' })
    })

    it('ignores an author text carried by the address: it must not widen the list', () => {
      const filters = toRecipeFilters({ ...EMPTY_CRITERIA, author: 'Hugo' }, MINE)

      expect(filters).toMatchObject({ authorId: 'u-42' })
      expect(filters).not.toHaveProperty('authorName')
    })
  })

  it('does not filter on an author id in the plain search', () => {
    expect(toRecipeFilters(EMPTY_CRITERIA, ALL)).not.toHaveProperty('authorId')
  })
})
