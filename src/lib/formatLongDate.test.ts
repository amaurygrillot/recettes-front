import { describe, expect, it } from 'vitest'
import { formatLongDate } from './formatLongDate'

describe('formatLongDate', () => {
  it.each([
    ['2026-10-12T12:00:00Z', '12 octobre 2026'],
    ['2026-01-01T12:00:00Z', '1 janvier 2026'],
    ['2026-12-31T12:00:00Z', '31 décembre 2026'],
  ])('writes %s as « %s »', (isoDate, expected) => {
    expect(formatLongDate(isoDate)).toBe(expected)
  })

  it('gives nothing for text that is not a date', () => {
    expect(formatLongDate('hier')).toBeUndefined()
    expect(formatLongDate('')).toBeUndefined()
  })
})
