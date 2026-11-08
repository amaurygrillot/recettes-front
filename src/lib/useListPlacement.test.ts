import { describe, expect, it } from 'vitest'
import { choosePlacement } from './useListPlacement'

describe('choosePlacement', () => {
  it('keeps the list under the field when it fits there', () => {
    expect(choosePlacement({ below: 300, above: 500 }, 200)).toBe('below')
  })

  it('puts it over the field when it does not fit under and there is more room over', () => {
    expect(choosePlacement({ below: 40, above: 300 }, 200)).toBe('above')
  })

  it('keeps it under the field when there is no more room over it, even if it does not fit', () => {
    expect(choosePlacement({ below: 120, above: 80 }, 200)).toBe('below')
  })

  it('keeps it under the field when both sides are the same', () => {
    expect(choosePlacement({ below: 100, above: 100 }, 200)).toBe('below')
  })
})
