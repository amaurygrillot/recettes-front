/**
 * The back end's rule for the emoji of a list (recettes-back, docs/recipe-lists.md, « The emoji
 * rule »), written again here to check that nothing the picker offers could be refused with a `400`.
 * It is not used by the application: the server stays the authority.
 *
 * The value is exactly one extended grapheme cluster, that cluster is a fully-qualified emoji
 * sequence, and it is at most 32 UTF-16 units. A sequence is a keycap, a flag (two regional
 * indicators), a tag sequence (the flags of England, Scotland and Wales), or elements joined by a zero
 * width joiner, an element being a pictograph (followed by U+FE0F, which only an emoji-by-default
 * pictograph may do without) or a modifier base with a skin tone.
 */
const VARIATION_SELECTOR = String.fromCodePoint(0xfe0f)
const KEYCAP_MARK = String.fromCodePoint(0x20e3)
const JOINER = String.fromCodePoint(0x200d)
const BLACK_FLAG = String.fromCodePoint(0x1f3f4)
const TAG_END = String.fromCodePoint(0xe007f)
const REGIONAL_INDICATORS = `${String.fromCodePoint(0x1f1e6)}-${String.fromCodePoint(0x1f1ff)}`
const TAGS = `${String.fromCodePoint(0xe0020)}-${String.fromCodePoint(0xe007e)}`

const MAX_UTF16_UNITS = 32

const KEYCAP = new RegExp(`^[0-9#*]${VARIATION_SELECTOR}${KEYCAP_MARK}$`, 'u')
const FLAG = new RegExp(`^[${REGIONAL_INDICATORS}]{2}$`, 'u')
const TAG_SEQUENCE = new RegExp(`^${BLACK_FLAG}[${TAGS}]+${TAG_END}$`, 'u')
const PICTOGRAPH = new RegExp(
  `^(?![0-9#*])(?!\\p{Emoji_Modifier})(?![${REGIONAL_INDICATORS}])\\p{Emoji}$`,
  'u',
)
const EMOJI_PRESENTATION = /^\p{Emoji_Presentation}$/u
const MODIFIER_BASE = /^\p{Emoji_Modifier_Base}$/u
const MODIFIER = /^\p{Emoji_Modifier}$/u

function isElement(part: string): boolean {
  const [first, second, ...rest] = Array.from(part)
  if (first === undefined) return false
  if (second !== undefined && rest.length === 0 && MODIFIER_BASE.test(first)) {
    if (MODIFIER.test(second)) return true
  }
  if (rest.length > 0 || !PICTOGRAPH.test(first)) return false
  if (second === undefined) return EMOJI_PRESENTATION.test(first)
  return second === VARIATION_SELECTOR
}

function graphemeClusters(value: string): string[] {
  return Array.from(
    new Intl.Segmenter('fr', { granularity: 'grapheme' }).segment(value),
    ({ segment }) => segment,
  )
}

/** Whether the back end accepts `value` as the emoji of a list. */
export function isAcceptedByTheBack(value: string): boolean {
  if (value.length > MAX_UTF16_UNITS || graphemeClusters(value).length !== 1) return false
  if (KEYCAP.test(value) || FLAG.test(value) || TAG_SEQUENCE.test(value)) return true
  return value.split(JOINER).every(isElement)
}
