import { describe, expect, it } from 'vitest'
import { API_BASE_URL } from '../api/apiConfig'
import { recipeCardsOf, toRecipeCard } from './recipeCards'

const named = (...names: string[]) => names.map((name) => ({ id: `id-${name}`, name }))

describe('toRecipeCard', () => {
  it('keeps what the card shows, with the recipe page and the thumbnail resolved', () => {
    const card = toRecipeCard({
      id: '42',
      title: 'Gratin dauphinois de Mamie',
      coverMediaId: 'm-1',
      categories: [{ id: 'c', name: 'Plat', categoryType: 'MAIN' }],
      tags: named('Four', 'Crème'),
      author: { id: 'u', username: 'Odile' },
      createdAt: '2026-10-21T12:00:00Z',
    })

    expect(card).toEqual({
      id: '42',
      path: '/recettes/42',
      title: 'Gratin dauphinois de Mamie',
      coverUrl: `${API_BASE_URL}/media/m-1?variant=thumbnail`,
      categories: ['Plat'],
      tags: ['Four', 'Crème'],
      hiddenTagCount: 0,
      author: 'Odile',
      createdAt: '2026-10-21T12:00:00Z',
    })
  })

  it('shows three tags and counts the others', () => {
    const card = toRecipeCard({
      id: '1',
      title: 'Crêpes',
      tags: named('Pâte', 'Sucré', 'Fête', 'Enfants', 'Poêle'),
    })

    expect(card?.tags).toEqual(['Pâte', 'Sucré', 'Fête'])
    expect(card?.hiddenTagCount).toBe(2)
  })

  it('shows two categories at most, as the design draws « one or two »', () => {
    const card = toRecipeCard({
      id: '1',
      title: 'Crêpes',
      categories: ['A', 'B', 'C'].map((name) => ({
        id: name,
        name,
        categoryType: 'MAIN' as const,
      })),
    })

    expect(card?.categories).toEqual(['A', 'B'])
  })

  it('has no cover, no author and no date when the API gave none', () => {
    const card = toRecipeCard({ id: '1', title: 'Soupe', coverMediaId: null, author: { id: 'u' } })

    expect(card).toMatchObject({
      coverUrl: undefined,
      author: undefined,
      createdAt: undefined,
      categories: [],
      tags: [],
    })
  })

  it('has no author when the username is empty', () => {
    const card = toRecipeCard({ id: '1', title: 'Soupe', author: { id: 'u', username: '' } })

    expect(card?.author).toBeUndefined()
  })

  it.each([
    ['an id', { title: 'Soupe' }],
    ['a title', { id: '1' }],
    ['a title that is empty', { id: '1', title: '' }],
  ])('gives no card for a recipe without %s: it could not be linked or named', (_what, summary) => {
    expect(toRecipeCard(summary)).toBeUndefined()
  })
})

describe('recipeCardsOf', () => {
  it('lists the recipes of every page, in order', () => {
    const cards = recipeCardsOf([
      {
        content: [
          { id: '1', title: 'A' },
          { id: '2', title: 'B' },
        ],
      },
      { content: [{ id: '3', title: 'C' }] },
    ])

    expect(cards.map((card) => card.id)).toEqual(['1', '2', '3'])
  })

  it('lists a recipe once when a new one pushed it onto the next page', () => {
    const cards = recipeCardsOf([
      {
        content: [
          { id: '1', title: 'A' },
          { id: '2', title: 'B' },
        ],
      },
      {
        content: [
          { id: '2', title: 'B' },
          { id: '3', title: 'C' },
        ],
      },
    ])

    expect(cards.map((card) => card.id)).toEqual(['1', '2', '3'])
  })

  it('skips what cannot be a card and carries on', () => {
    const cards = recipeCardsOf([{ content: [{ title: 'Sans id' }, { id: '2', title: 'B' }] }])

    expect(cards.map((card) => card.id)).toEqual(['2'])
  })

  it('is empty for no page, or pages with no content', () => {
    expect(recipeCardsOf([])).toEqual([])
    expect(recipeCardsOf([{}, { content: [] }])).toEqual([])
  })
})
