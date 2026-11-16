import { describe, expect, it } from 'vitest'
import { activeCategory, categoryPositions } from './categoryPositions'

const emoji = (category: number) => ({ emoji: '🙂', category, label: 'x', version: 1, tags: [] })

// 7 emojis of category 0, none of category 1, 13 of category 3: with 6 columns, 2 rows and 3 rows.
const data = {
  categories: [
    { index: 0, label: 'Visages' },
    { index: 1, label: 'Vide' },
    { index: 3, label: 'Nature' },
  ],
  emojis: [
    ...Array.from({ length: 7 }, () => emoji(0)),
    ...Array.from({ length: 13 }, () => emoji(3)),
  ],
}

describe('categoryPositions', () => {
  it('puts a title above each category and a row for each `columns` emojis before it', () => {
    expect(categoryPositions(data, 6, 56, 40)).toEqual([
      { index: 0, top: 0 },
      // one title (40) and two rows (112) come before « Nature »; the empty category has no title
      { index: 3, top: 40 + 112 },
    ])
  })

  it('has fewer rows, so earlier categories, with more columns', () => {
    expect(categoryPositions(data, 7, 56, 40)[1]).toEqual({ index: 3, top: 40 + 56 })
  })

  it('has nothing when there is no emoji', () => {
    expect(categoryPositions({ categories: data.categories, emojis: [] }, 6, 56, 40)).toEqual([])
  })
})

describe('activeCategory', () => {
  const positions = categoryPositions(data, 6, 56, 40)

  it.each([
    ['at the very top', 0, false, 0],
    ['while the first title is still the one at the top', 150, false, 0],
    ['once the next title has reached the top', 152, false, 3],
    ['far past the last title', 5000, false, 3],
    ['at the end of a list too short to bring the last title to the top', 10, true, 3],
  ])('is the right category %s', (_name, scrollTop, atEnd, expected) => {
    expect(activeCategory(positions, scrollTop, atEnd)).toBe(expected)
  })

  it('is nobody when there is no category', () => {
    expect(activeCategory([], 0, false)).toBeUndefined()
  })
})
