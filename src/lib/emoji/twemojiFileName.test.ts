import { describe, expect, it } from 'vitest'
import { twemojiFileName, twemojiPath } from './twemojiFileName'

describe('twemojiFileName', () => {
  it.each([
    ['a plain emoji', '🎄', '1f384'],
    ['an emoji written with its variation selector, which the file name drops', '❤️', '2764'],
    ['a keycap, which loses it too', '1️⃣', '31-20e3'],
    ['a flag', '🇫🇷', '1f1eb-1f1f7'],
    ['a skin tone', '👍🏽', '1f44d-1f3fd'],
    ['a sequence joined by a zero width joiner', '👩‍🍳', '1f469-200d-1f373'],
    ['a joined sequence, which keeps its variation selectors', '🏳️‍🌈', '1f3f3-fe0f-200d-1f308'],
    ['the one joined sequence whose file loses them', '👁️‍🗨️', '1f441-200d-1f5e8'],
    [
      'a flag of a region, drawn with tag characters',
      '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      '1f3f4-e0067-e0062-e0065-e006e-e0067-e007f',
    ],
  ])('names the file of %s', (_name, emoji, fileName) => {
    expect(twemojiFileName(emoji)).toBe(fileName)
  })

  it('serves the drawing from the front’s own origin', () => {
    expect(twemojiPath('🎄')).toBe('/twemoji/1f384.svg')
  })
})
