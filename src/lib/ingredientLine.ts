/** The parts of an ingredient line as the design sets them: « **250** g de farine » and a quieter note. */
export interface IngredientLine {
  /** Set bold: « 250 », « 1,5 ». Absent for « Sel et poivre ». */
  quantity: string | undefined
  /** The unit and the little word that joins it to the name: « g de », « c. à soupe d' ». */
  unit: string | undefined
  /** The name, which follows the unit directly when the unit ends in an apostrophe. */
  name: string
  note: string | undefined
}

export interface IngredientLineInput {
  name: string
  quantity?: number | null | undefined
  /** The unit as written on the line: its abbreviation (« g »), else its name (« pincée »). */
  unit?: string | null | undefined
  note?: string | null | undefined
}

const number = new Intl.NumberFormat('fr', { maximumFractionDigits: 2 })

// A name that starts with a vowel or a silent h takes « d' » after a unit (« d'ail », « d'huile »).
// These start with an aspirated h, which takes « de » (« de haricots »).
const ASPIRATED_H = [
  'haricot',
  'hareng',
  'harissa',
  'halloumi',
  'homard',
  'hachis',
  'houmous',
  'hamburger',
  'hot',
]

function takesElision(name: string): boolean {
  const lower = name.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trimStart()
  if (/^[aeiouyœ]/u.test(lower)) return true
  return lower.startsWith('h') && !ASPIRATED_H.some((word) => lower.startsWith(word))
}

function blankToUndefined(text: string | null | undefined): string | undefined {
  const trimmed = text?.trim()
  return trimmed === undefined || trimmed === '' ? undefined : trimmed
}

/**
 * One line of ingredients, split the way it is drawn: the quantity in bold, then the unit with
 * its « de » or « d' » (only when there is a unit: « 1 œuf », not « 1 de œuf »), then the name.
 * Quantities use the French decimal comma.
 */
export function ingredientLine({
  name,
  quantity,
  unit,
  note,
}: IngredientLineInput): IngredientLine {
  const unitText = blankToUnitText(unit, name)
  return {
    quantity: quantity === null || quantity === undefined ? undefined : number.format(quantity),
    unit: unitText,
    name,
    note: blankToUndefined(note),
  }
}

function blankToUnitText(unit: string | null | undefined, name: string): string | undefined {
  const text = blankToUndefined(unit)
  if (text === undefined) return undefined
  return takesElision(name) ? `${text} d'` : `${text} de `
}
