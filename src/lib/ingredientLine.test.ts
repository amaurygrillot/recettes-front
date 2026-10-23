import { describe, expect, it } from 'vitest'
import { ingredientLine } from './ingredientLine'

describe('ingredientLine', () => {
  it.each([
    [
      'a quantity, a unit and a name',
      { name: 'farine', quantity: 250, unit: 'g' },
      '250',
      'g de ',
      'farine',
    ],
    ['a quantity and a name only', { name: 'œuf', quantity: 1 }, '1', undefined, 'œuf'],
    ['a name only', { name: 'Sel et poivre' }, undefined, undefined, 'Sel et poivre'],
    [
      'a decimal quantity',
      { name: 'crème', quantity: 1.5, unit: 'c. à soupe' },
      '1,5',
      'c. à soupe de ',
      'crème',
    ],
    ['a unit and no quantity', { name: 'sel', unit: 'pincée' }, undefined, 'pincée de ', 'sel'],
    [
      'no quantity written as null',
      { name: 'sel', quantity: null, unit: null },
      undefined,
      undefined,
      'sel',
    ],
  ])('splits %s', (_what, input, quantity, unit, name) => {
    expect(ingredientLine(input)).toMatchObject({ quantity, unit, name })
  })

  it.each([
    ['ail', "g d'"],
    ['eau froide', "cl d'"],
    ['Œufs', "pièces d'"],
    ['échalote', "pièces d'"],
    ['huile d’olive', "cl d'"],
    ['haricots verts', 'g de '],
    ['homard', 'g de '],
    ['harissa', 'c. à café de '],
    ['halloumi', 'g de '],
    ['herbes de Provence', "c. à café d'"],
    ['farine', 'g de '],
    ['Yaourt', "pots d'"],
  ])('joins the unit to « %s » with « %s »', (name, expectedUnitStart) => {
    const unit = expectedUnitStart.replace(/ d'$| de $/, '')

    expect(ingredientLine({ name, quantity: 1, unit }).unit).toBe(expectedUnitStart)
  })

  it('keeps a note, and drops one that is blank', () => {
    expect(ingredientLine({ name: 'beurre', note: 'coupé en dés' }).note).toBe('coupé en dés')
    expect(ingredientLine({ name: 'beurre', note: '   ' }).note).toBeUndefined()
    expect(ingredientLine({ name: 'beurre', note: null }).note).toBeUndefined()
  })

  it('writes big quantities with the French separators, and no more than two decimals', () => {
    expect(ingredientLine({ name: 'sucre', quantity: 0.333333 }).quantity).toBe('0,33')
    expect(ingredientLine({ name: 'eau', quantity: 1000 }).quantity).toMatch(/^1\s?000$/)
  })

  it('ignores a unit that is blank', () => {
    expect(ingredientLine({ name: 'sel', quantity: 1, unit: '  ' }).unit).toBeUndefined()
  })
})
