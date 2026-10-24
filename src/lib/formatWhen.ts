const DAY_MS = 86_400_000

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

/**
 * When something happened, as it is said aloud: « aujourd'hui à 18 h 42 », « hier à 18 h 42 »,
 * « le 12 octobre à 18 h 42 ». Days are the reader's own (their time zone, from midnight).
 */
export function formatWhen(then: Date, now: Date): string {
  const time = `${then.getHours()} h ${String(then.getMinutes()).padStart(2, '0')}`
  const daysAgo = Math.round((startOfDay(now).getTime() - startOfDay(then).getTime()) / DAY_MS)
  if (daysAgo === 0) return `aujourd’hui à ${time}`
  if (daysAgo === 1) return `hier à ${time}`
  const day = new Intl.DateTimeFormat('fr', { day: 'numeric', month: 'long' }).format(then)
  return `le ${day} à ${time}`
}
