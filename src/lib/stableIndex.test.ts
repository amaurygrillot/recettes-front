import { describe, expect, it } from 'vitest'
import { stableIndex } from './stableIndex'

describe('stableIndex', () => {
  it('always gives the same index for the same text', () => {
    expect(stableIndex('anne girard', 6)).toBe(stableIndex('anne girard', 6))
  })

  it.each(['', 'a', 'anne girard', 'Éloïse Çelik', 'x'.repeat(500)])(
    'stays within the range for %j',
    (seed) => {
      const index = stableIndex(seed, 6)

      expect(Number.isInteger(index)).toBe(true)
      expect(index).toBeGreaterThanOrEqual(0)
      expect(index).toBeLessThan(6)
    },
  )

  it('spreads different texts over the whole range', () => {
    const indexes = new Set(
      ['anne', 'bruno', 'chloé', 'david', 'emma', 'félix', 'gaëlle', 'hugo', 'inès', 'jules'].map(
        (name) => stableIndex(name, 6),
      ),
    )

    expect(indexes.size).toBeGreaterThan(3)
  })
})
