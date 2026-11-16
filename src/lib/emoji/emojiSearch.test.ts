import { describe, expect, it } from 'vitest'
import { countEmojisFound } from './emojiSearch'

const emojis = [
  {
    emoji: '🎂',
    category: 4,
    label: 'Gâteau d’anniversaire',
    version: 0.6,
    tags: ['gateau', 'fête'],
  },
  { emoji: '🍰', category: 4, label: 'Part de gâteau', version: 0.6, tags: ['dessert'] },
  { emoji: '🎄', category: 6, label: 'Sapin de Noël', version: 0.6, tags: ['Noël', 'fête'] },
]

describe('countEmojisFound', () => {
  it.each([
    ['nothing typed finds every emoji', '', 3],
    ['spaces alone find every emoji', '   ', 3],
    ['a word of the name', 'gâteau', 2],
    ['a tag', 'fête', 2],
    ['the case is ignored', 'SAPIN', 1],
    ['a word that is nowhere', 'xqzw', 0],
  ])('%s', (_name, search, count) => {
    expect(countEmojisFound(emojis, search)).toBe(count)
  })
})
