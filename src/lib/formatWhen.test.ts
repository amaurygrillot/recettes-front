import { describe, expect, it } from 'vitest'
import { formatWhen } from './formatWhen'

const now = new Date(2026, 9, 24, 9, 5)

describe('formatWhen', () => {
  it('says today, with the time', () => {
    expect(formatWhen(new Date(2026, 9, 24, 8, 30), now)).toBe('aujourd’hui à 8 h 30')
  })

  it('says yesterday, with minutes on two digits, even when it is less than 24 hours ago', () => {
    expect(formatWhen(new Date(2026, 9, 23, 18, 4), now)).toBe('hier à 18 h 04')
    expect(formatWhen(new Date(2026, 9, 23, 23, 59), new Date(2026, 9, 24, 0, 10))).toBe(
      'hier à 23 h 59',
    )
  })

  it('says the date for anything older', () => {
    expect(formatWhen(new Date(2026, 9, 12, 18, 42), now)).toBe('le 12 octobre à 18 h 42')
    expect(formatWhen(new Date(2026, 9, 1, 7, 0), now)).toBe('le 1 octobre à 7 h 00')
  })
})
