import { describe, expect, it } from 'vitest'
import { categoryNodesOf, categoryOptionsOf, findCategory } from './categoryNodes'

const TREE = [
  {
    id: 'desserts',
    name: 'Desserts',
    subcategories: [
      { id: 'tartes', name: 'Tartes', subcategories: [{ id: 'tartelettes', name: 'Tartelettes' }] },
      { id: 'gateaux', name: 'Gâteaux', subcategories: [] },
    ],
  },
  { id: 'soupes', name: 'Soupes' },
]

describe('categoryNodesOf', () => {
  it('makes every level certain: children are always a list', () => {
    expect(categoryNodesOf(TREE)).toEqual([
      {
        id: 'desserts',
        name: 'Desserts',
        children: [
          {
            id: 'tartes',
            name: 'Tartes',
            children: [{ id: 'tartelettes', name: 'Tartelettes', children: [] }],
          },
          { id: 'gateaux', name: 'Gâteaux', children: [] },
        ],
      },
      { id: 'soupes', name: 'Soupes', children: [] },
    ])
  })

  it('leaves out an entry with no id or no name, which could not be chosen', () => {
    expect(categoryNodesOf([{ name: 'Sans id' }, { id: 'x' }, { id: 'y', name: '' }])).toEqual([])
  })
})

describe('categoryOptionsOf', () => {
  it('lists every category at every depth, a subcategory naming its parent', () => {
    expect(categoryOptionsOf(categoryNodesOf(TREE))).toEqual([
      { id: 'desserts', label: 'Desserts', hint: undefined },
      { id: 'tartes', label: 'Tartes', hint: 'Desserts' },
      { id: 'tartelettes', label: 'Tartelettes', hint: 'Tartes' },
      { id: 'gateaux', label: 'Gâteaux', hint: 'Desserts' },
      { id: 'soupes', label: 'Soupes', hint: undefined },
    ])
  })
})

describe('findCategory', () => {
  const nodes = categoryNodesOf(TREE)

  it('finds a category and the ones above it, outermost first', () => {
    const found = findCategory(nodes, 'tartelettes')

    expect(found?.node.name).toBe('Tartelettes')
    expect(found?.ancestors.map((ancestor) => ancestor.name)).toEqual(['Desserts', 'Tartes'])
  })

  it('finds a main category, with nothing above it', () => {
    expect(findCategory(nodes, 'soupes')?.ancestors).toEqual([])
  })

  it('finds nothing for an id that does not exist', () => {
    expect(findCategory(nodes, 'inconnue')).toBeUndefined()
  })
})
