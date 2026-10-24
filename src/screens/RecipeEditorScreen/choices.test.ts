import { describe, expect, it } from 'vitest'
import type { CategoryNode } from '../../app/categoryNodes'
import { applyChoice, categoryOptions, categoryPath, chosenBeneath } from './choices'

const TREE: CategoryNode[] = [
  { id: 'entrees', name: 'Entrées', children: [] },
  {
    id: 'desserts',
    name: 'Desserts',
    children: [
      { id: 'tartes', name: 'Tartes', children: [] },
      { id: 'gateaux', name: 'Gâteaux', children: [] },
    ],
  },
]

describe('categoryPath', () => {
  it.each([
    ['entrees', 'Entrées'],
    ['desserts', 'Desserts'],
    ['tartes', 'Desserts › Tartes'],
  ])('writes where %s sits: « %s »', (id, path) => {
    expect(categoryPath(TREE, id)).toBe(path)
  })

  it('has nothing for a category that is not in the tree', () => {
    expect(categoryPath(TREE, 'absente')).toBeUndefined()
  })
})

describe('categoryOptions', () => {
  it('lists every category at every depth, in the order of the tree, with its path', () => {
    expect(categoryOptions(TREE)).toEqual([
      { id: 'entrees', label: 'Entrées', name: 'Entrées', parentPath: undefined },
      { id: 'desserts', label: 'Desserts', name: 'Desserts', parentPath: undefined },
      { id: 'tartes', label: 'Desserts › Tartes', name: 'Tartes', parentPath: 'Desserts' },
      { id: 'gateaux', label: 'Desserts › Gâteaux', name: 'Gâteaux', parentPath: 'Desserts' },
    ])
  })
})

describe('chosenBeneath', () => {
  it('counts what is chosen under a category, not the category itself', () => {
    const desserts = TREE[1]
    if (desserts === undefined) throw new Error('fixture without desserts')

    expect(chosenBeneath(desserts, new Set(['desserts', 'tartes']))).toBe(1)
    expect(chosenBeneath(desserts, new Set(['tartes', 'gateaux']))).toBe(2)
    expect(chosenBeneath(desserts, new Set(['entrees']))).toBe(0)
  })
})

describe('applyChoice', () => {
  const options = categoryOptions(TREE)

  it('keeps what stays in its place and adds what is new after it, in the list’s order', () => {
    const current = [
      { id: 'tartes', label: 'Desserts › Tartes' },
      { id: 'entrees', label: 'Entrées' },
    ]

    expect(
      applyChoice(current, options, new Set(['entrees', 'tartes', 'gateaux', 'desserts'])),
    ).toEqual([
      { id: 'tartes', label: 'Desserts › Tartes' },
      { id: 'entrees', label: 'Entrées' },
      { id: 'desserts', label: 'Desserts' },
      { id: 'gateaux', label: 'Desserts › Gâteaux' },
    ])
  })

  it('drops what was unticked', () => {
    const current = [
      { id: 'tartes', label: 'Desserts › Tartes' },
      { id: 'entrees', label: 'Entrées' },
    ]

    expect(applyChoice(current, options, new Set(['entrees']))).toEqual([
      { id: 'entrees', label: 'Entrées' },
    ])
  })

  it('can end with nothing chosen', () => {
    expect(applyChoice([{ id: 'tartes', label: 'x' }], options, new Set())).toEqual([])
  })

  it('does not add twice what is already there', () => {
    const current = [{ id: 'tartes', label: 'Desserts › Tartes' }]

    expect(applyChoice(current, options, new Set(['tartes']))).toEqual(current)
  })
})
