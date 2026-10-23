import { describe, expect, it } from 'vitest'
import { formatRelativeDate } from './formatRelativeDate'

const NOW = new Date('2026-10-23T12:00:00Z')

describe('formatRelativeDate', () => {
  it.each([
    ['30 seconds ago', '2026-10-23T11:59:30Z', 'maintenant'],
    ['5 minutes ago', '2026-10-23T11:55:00Z', 'il y a 5 minutes'],
    ['3 hours ago', '2026-10-23T09:00:00Z', 'il y a 3 heures'],
    ['yesterday', '2026-10-22T12:00:00Z', 'il y a 1 jour'],
    ['2 days ago', '2026-10-21T12:00:00Z', 'il y a 2 jours'],
    ['6 days ago', '2026-10-17T12:00:00Z', 'il y a 6 jours'],
    ['a week ago', '2026-10-16T12:00:00Z', 'il y a 1 semaine'],
    ['2 weeks ago', '2026-10-09T12:00:00Z', 'il y a 2 semaines'],
    ['a month ago', '2026-09-22T12:00:00Z', 'il y a 1 mois'],
    ['5 months ago', '2026-05-20T12:00:00Z', 'il y a 5 mois'],
    ['11 months ago', '2025-11-01T12:00:00Z', 'il y a 11 mois'],
    ['almost a year ago', '2025-10-27T12:00:00Z', 'il y a 1 an'],
    ['a year ago', '2025-10-23T12:00:00Z', 'il y a 1 an'],
    ['3 years ago', '2023-10-01T12:00:00Z', 'il y a 3 ans'],
  ])('reads %s as « %s »', (_when, isoDate, expected) => {
    expect(formatRelativeDate(isoDate, NOW)).toBe(expected)
  })

  it('reads a date in the future as « maintenant »', () => {
    expect(formatRelativeDate('2026-10-24T12:00:00Z', NOW)).toBe('maintenant')
  })

  it('gives nothing for text that is not a date', () => {
    expect(formatRelativeDate('hier soir', NOW)).toBeUndefined()
  })

  it('compares with the current time when none is given', () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60_000).toISOString()

    expect(formatRelativeDate(tenMinutesAgo)).toBe('il y a 10 minutes')
  })
})
