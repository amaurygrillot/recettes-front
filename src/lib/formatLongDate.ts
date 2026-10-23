const long = new Intl.DateTimeFormat('fr', { dateStyle: 'long' })

/** A date as people say it: « 12 octobre 2026 ». Text that is not a date gives `undefined`. */
export function formatLongDate(isoDate: string): string | undefined {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? undefined : long.format(date)
}
