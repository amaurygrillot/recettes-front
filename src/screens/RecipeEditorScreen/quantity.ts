/**
 * What was typed as a quantity: nothing (« Sel »), a number, or a mistake. The French decimal comma
 * is accepted as well as the point. The back end takes 7 digits before the point and 3 after, and
 * not less than zero.
 */
export type QuantityReading =
  { kind: 'none' } | { kind: 'number'; value: number } | { kind: 'negative' } | { kind: 'invalid' }

const NUMBER = /^(\d{1,7})(?:[.,](\d{1,3}))?$/
const NEGATIVE = /^-\s*\d+(?:[.,]\d+)?$/

export function readQuantity(text: string): QuantityReading {
  const typed = text.trim()
  if (typed === '') return { kind: 'none' }
  if (NEGATIVE.test(typed)) return { kind: 'negative' }
  const match = NUMBER.exec(typed)
  if (match === null) return { kind: 'invalid' }
  const [, whole = '', decimals] = match
  return { kind: 'number', value: Number(decimals === undefined ? whole : `${whole}.${decimals}`) }
}
