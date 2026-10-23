import { describe, expect, it } from 'vitest'
import { categoryIcon, mainCategoriesOf } from './mainCategories'

describe('categoryIcon', () => {
  it.each([
    ['Entrées', 'leaf'],
    ['entrée', 'leaf'],
    ['Plats', 'plate'],
    ['Plat principal', 'plate'],
    ['Desserts', 'cake'],
    ['dessert-10998922', 'cake'],
    ['Soupes', 'soup'],
    ['PAINS', 'bread'],
    ['Pain', 'bread'],
  ] as const)('draws « %s » with the %s icon', (name, icon) => {
    expect(categoryIcon(name)).toBe(icon)
  })

  it.each(['Boissons', 'Platter', 'Goûter', '', '   ', '12', 'constructor'])(
    'falls back to the cutlery for « %s »',
    (name) => {
      expect(categoryIcon(name)).toBe('cutlery')
    },
  )
})

describe('mainCategoriesOf', () => {
  it('keeps the main categories, in the order the API gave them', () => {
    const categories = [
      { id: '1', name: 'Plats', categoryType: 'MAIN' as const, parentCategoryId: null },
      { id: '2', name: 'Tartes', categoryType: 'SUB' as const, parentCategoryId: '3' },
      { id: '3', name: 'Desserts', categoryType: 'MAIN' as const, parentCategoryId: null },
    ]

    expect(mainCategoriesOf(categories)).toEqual([
      { id: '1', name: 'Plats', icon: 'plate' },
      { id: '3', name: 'Desserts', icon: 'cake' },
    ])
  })

  it('leaves out a category that has no id, no name or no type', () => {
    expect(
      mainCategoriesOf([
        { name: 'Sans id', categoryType: 'MAIN' },
        { id: '1', categoryType: 'MAIN' },
        { id: '2', name: '', categoryType: 'MAIN' },
        { id: '3', name: 'Sans type' },
      ]),
    ).toEqual([])
  })

  it('is empty when there is no category', () => {
    expect(mainCategoriesOf([])).toEqual([])
  })
})
