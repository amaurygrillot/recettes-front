import { describe, expect, it } from 'vitest'
import { isAcceptedByTheBack } from '../../test/backEmojiRule'
import { EMOJI_VERSION_CAP, parseEmojiData, readEmojibase } from './emojiData'
import { twemojiFileName } from './twemojiFileName'

/**
 * The emojis the picker can offer are the ones `parseEmojiData` hands to it, skin tones included,
 * from the very files the app serves. Two promises are kept for every one of them: the back end
 * accepts it as the emoji of a list, and Twemoji has the file that draws it.
 */
const files = import.meta.glob('/node_modules/emojibase-data/fr/*.json', {
  eager: true,
  import: 'default',
})
const raw = readEmojibase(
  files['/node_modules/emojibase-data/fr/data.json'],
  files['/node_modules/emojibase-data/fr/messages.json'],
)
const data = parseEmojiData(raw, (key) => key)
const drawings = new Set(
  Object.keys(import.meta.glob('/node_modules/@twemoji/svg/*.svg')).map((path) =>
    path.slice(path.lastIndexOf('/') + 1),
  ),
)

const offered = data.emojis.flatMap((emoji) => [emoji.emoji, ...Object.values(emoji.skins ?? {})])

describe('the emojis the picker offers', () => {
  it('are many, with their skin tones and the flags', () => {
    expect(data.emojis.length).toBeGreaterThan(1300)
    expect(offered.length).toBeGreaterThan(3000)
    expect(data.emojis.some((emoji) => emoji.skins !== undefined)).toBe(true)
    expect(data.emojis.map((emoji) => emoji.emoji)).toContain('🇫🇷')
  })

  it('stop at the version of the drawings, and never include a loose component', () => {
    expect(Math.max(...data.emojis.map((emoji) => emoji.version))).toBeLessThanOrEqual(
      EMOJI_VERSION_CAP,
    )
    expect(data.categories).toHaveLength(9)
    const categories = new Set(data.categories.map((category) => category.index))
    expect(data.emojis.every((emoji) => categories.has(emoji.category))).toBe(true)
  })

  it('give a skin tone only as the five tones together', () => {
    const incomplete = data.emojis.filter(
      (emoji) => emoji.skins !== undefined && Object.keys(emoji.skins).length !== 5,
    )

    expect(incomplete).toEqual([])
  })

  it('are all accepted by the back end’s rule for the emoji of a list', () => {
    const refused = offered.filter((emoji) => !isAcceptedByTheBack(emoji))

    expect(refused).toEqual([])
  })

  it('all have a Twemoji drawing', () => {
    const undrawn = offered.filter((emoji) => !drawings.has(`${twemojiFileName(emoji)}.svg`))

    expect(undrawn).toEqual([])
  })
})
