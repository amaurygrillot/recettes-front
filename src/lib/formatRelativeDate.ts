const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY
// Twelve of the 30-day months: a date 362 days ago is « 1 an », never « 12 mois ».
const YEAR = 12 * MONTH

// « il y a 1 semaine » reads better than « la semaine dernière » in a card's byline, so the
// number is always spelled out; only « maintenant » comes from the automatic form.
const spelledOut = new Intl.RelativeTimeFormat('fr', { numeric: 'always' })
const automatic = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' })

/**
 * How long ago `isoDate` was, in French, rounded down to one unit: « il y a 2 jours »,
 * « il y a 3 semaines ». A date in the future (a skewed clock) reads as « maintenant »; text
 * that is not a date gives `undefined`, so the caller leaves it out rather than show « Invalid Date ».
 */
export function formatRelativeDate(isoDate: string, now: Date = new Date()): string | undefined {
  const then = new Date(isoDate).getTime()
  if (Number.isNaN(then)) return undefined

  const elapsed = Math.max(0, now.getTime() - then)
  if (elapsed < MINUTE) return automatic.format(0, 'second')
  if (elapsed < HOUR) return spelledOut.format(-Math.floor(elapsed / MINUTE), 'minute')
  if (elapsed < DAY) return spelledOut.format(-Math.floor(elapsed / HOUR), 'hour')
  if (elapsed < WEEK) return spelledOut.format(-Math.floor(elapsed / DAY), 'day')
  if (elapsed < MONTH) return spelledOut.format(-Math.floor(elapsed / WEEK), 'week')
  if (elapsed < YEAR) return spelledOut.format(-Math.floor(elapsed / MONTH), 'month')
  return spelledOut.format(-Math.floor(elapsed / YEAR), 'year')
}
