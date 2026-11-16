import type { EmojiData } from 'frimousse'
import { z } from 'zod'
import { normalizeText } from '../normalizeText'

/** Where the French Emojibase files are served from: the front's own origin, copied at build time (vite.config.ts). */
export const EMOJIBASE_URL = '/emojibase'

/**
 * The highest Emoji version the picker offers, and the highest the Twemoji package draws
 * (`@twemoji/svg` 15.0.0 is Emoji 15.0). It is also well below the Unicode 16.0 of Java 25, which is
 * what the back end's rule for an emoji relies on: nothing the picker offers can be refused for being
 * too new. Emoji 15.1 and later (sequences of existing emojis, then new ones) are not offered.
 */
export const EMOJI_VERSION_CAP = 15

// What of the two files of a language is read (the package's own, served as they are): checked
// when they arrive, so that a file that is not the one expected fails loudly instead of showing nothing.
const rawSkin = z.object({
  emoji: z.string(),
  label: z.string(),
  version: z.number(),
  tone: z.union([z.number(), z.array(z.number())]).optional(),
})
const rawEmoji = z.object({
  emoji: z.string(),
  label: z.string(),
  version: z.number(),
  group: z.number().optional(),
  tags: z.array(z.string()).optional(),
  skins: z.array(rawSkin).optional(),
})
const rawMessages = z.object({
  groups: z.array(z.object({ key: z.string(), order: z.number() })),
  skinTones: z.array(z.object({ key: z.string(), message: z.string() })),
})

export type RawEmoji = z.infer<typeof rawEmoji>
type RawMessages = z.infer<typeof rawMessages>

/** What the two files of a language hold, as the picker and the names read them. */
export interface RawEmojibase {
  emojis: readonly RawEmoji[]
  messages: RawMessages
}

export function readEmojibase(emojis: unknown, messages: unknown): RawEmojibase {
  return { emojis: z.array(rawEmoji).parse(emojis), messages: rawMessages.parse(messages) }
}

type SkinToneKey = keyof EmojiData['skinTones']

// `tone` of a single-person variant, 1 to 5, in the order light to dark.
const SKIN_TONES: Readonly<Record<number, SkinToneKey>> = {
  1: 'light',
  2: 'medium-light',
  3: 'medium',
  4: 'medium-dark',
  5: 'dark',
}

const TONE_ORDER: readonly SkinToneKey[] = [
  'light',
  'medium-light',
  'medium',
  'medium-dark',
  'dark',
]

/**
 * What a search matches on besides the name: the tags, and the same words without accents and in
 * lower case, so that « gateau » finds « Gâteau d’anniversaire » (the picker's own search is case
 * sensitive to accents).
 */
function searchTerms(emoji: RawEmoji): string[] {
  const words = [emoji.label, ...(emoji.tags ?? [])]
  return [...new Set([...(emoji.tags ?? []), ...words.map(normalizeText)])]
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function skinToneLabels(messages: RawMessages): EmojiData['skinTones'] {
  const label = (key: SkinToneKey) =>
    capitalize(messages.skinTones.find((tone) => tone.key === key)?.message ?? key)
  return {
    light: label('light'),
    'medium-light': label('medium-light'),
    medium: label('medium'),
    'medium-dark': label('medium-dark'),
    dark: label('dark'),
  }
}

/** The variants of the five single skin tones, when the emoji has all of them (the pairs of different tones of a couple are not offered). */
function singleSkins(emoji: RawEmoji): EmojiData['skinTones'] | undefined {
  const found = new Map<SkinToneKey, string>()
  for (const skin of emoji.skins ?? []) {
    const key = typeof skin.tone === 'number' ? SKIN_TONES[skin.tone] : undefined
    if (key !== undefined && skin.version <= EMOJI_VERSION_CAP) found.set(key, skin.emoji)
  }
  const [light, mediumLight, medium, mediumDark, dark] = TONE_ORDER.map((key) => found.get(key))
  if (
    light === undefined ||
    mediumLight === undefined ||
    medium === undefined ||
    mediumDark === undefined ||
    dark === undefined
  ) {
    return undefined
  }
  return { light, 'medium-light': mediumLight, medium, 'medium-dark': mediumDark, dark }
}

/**
 * The emojis the picker offers, in the shape Frimousse reads: only those of the Emoji version it is
 * capped at, grouped as the data groups them (the « component » group, the loose skin tones and hair
 * pieces, is not an emoji), with the flags (the drawings are Twemoji's, so no device lacks them) and
 * the five single skin tones of those that have them.
 *
 * `categoryLabel` gives the title of a group from its key: the French of the screens, not of the data.
 */
export function parseEmojiData(
  { emojis, messages }: RawEmojibase,
  categoryLabel: (groupKey: string) => string,
): EmojiData {
  const groups = messages.groups.filter((group) => group.key !== 'component')
  const shown = new Set(groups.map((group) => group.order))
  return {
    locale: 'fr',
    categories: groups.map((group) => ({ index: group.order, label: categoryLabel(group.key) })),
    skinTones: skinToneLabels(messages),
    emojis: emojis
      .filter(
        (emoji) =>
          emoji.group !== undefined && shown.has(emoji.group) && emoji.version <= EMOJI_VERSION_CAP,
      )
      .map((emoji) => {
        const skins = singleSkins(emoji)
        return {
          emoji: emoji.emoji,
          category: emoji.group ?? 0,
          label: capitalize(emoji.label),
          version: emoji.version,
          tags: searchTerms(emoji),
          ...(skins === undefined ? {} : { skins }),
        }
      }),
  }
}
