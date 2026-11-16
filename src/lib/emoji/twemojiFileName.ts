/** Where the Twemoji drawings are served from: the front's own origin, copied from the package at build time (vite.config.ts). */
export const TWEMOJI_URL = '/twemoji'

/**
 * The one drawing whose file does not follow that rule: the eye in a speech bubble keeps its
 * selectors in the sequence but not in its file. Found by the test that every emoji offered has one.
 */
const IRREGULAR_FILES: Readonly<Record<string, string>> = {
  '1f441-fe0f-200d-1f5e8-fe0f': '1f441-200d-1f5e8',
}

const ZERO_WIDTH_JOINER = 0x200d
const VARIATION_SELECTOR_16 = 0xfe0f

/**
 * The name of the file that draws an emoji (without `.svg`): its code points in lower-case
 * hexadecimal, joined by « - ». Twemoji drops U+FE0F from the name, **except in a sequence joined by
 * a zero width joiner**, which keeps it (the rainbow flag is `1f3f3-fe0f-200d-1f308`, the heart is
 * `2764`). That rule is Twemoji's own (`grabTheRightIcon`), and the test that every emoji the picker
 * offers has its file is what keeps this function honest.
 */
export function twemojiFileName(emoji: string): string {
  const codePoints = Array.from(emoji, (character) => character.codePointAt(0) ?? 0)
  const kept = codePoints.includes(ZERO_WIDTH_JOINER)
    ? codePoints
    : codePoints.filter((codePoint) => codePoint !== VARIATION_SELECTOR_16)
  const name = kept.map((codePoint) => codePoint.toString(16)).join('-')
  return IRREGULAR_FILES[name] ?? name
}

/** The address of the drawing of an emoji. */
export function twemojiPath(emoji: string): string {
  return `${TWEMOJI_URL}/${twemojiFileName(emoji)}.svg`
}
