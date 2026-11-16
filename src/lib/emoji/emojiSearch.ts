import type { EmojiData } from 'frimousse'

/**
 * How many emojis a search finds, counted the way the picker lists them (a name or a tag that
 * contains the word, case ignored): the number the picker announces. It has to follow the picker's
 * own rule; the test that compares it with what the picker lists keeps them together.
 */
export function countEmojisFound(emojis: EmojiData['emojis'], search: string): number {
  const word = search.toLowerCase().trim()
  if (word === '') return emojis.length
  return emojis.filter(
    (emoji) =>
      emoji.label.toLowerCase().includes(word) ||
      emoji.tags.some((tag) => tag.toLowerCase().includes(word)),
  ).length
}
