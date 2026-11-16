import { describe, expect, it } from 'vitest'
import { isAcceptedByTheBack } from './backEmojiRule'

const JOINER = String.fromCodePoint(0x200d)
const SKIN_TONE = String.fromCodePoint(0x1f3fd)
const HEART = String.fromCodePoint(0x2764)
const SELECTOR = String.fromCodePoint(0xfe0f)

/** The cases the back end's own tests assert (`SingleEmojiValidatorTest`). */
describe('the back end’s rule for the emoji of a list', () => {
  it.each(['🎂', '🍝', '❤️', '👩‍🍳', '👍🏽', '🇫🇷', '1️⃣', '🏳️‍🌈', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'])('accepts %s', (emoji) => {
    expect(isAcceptedByTheBack(emoji)).toBe(true)
  })

  it.each([
    ['nothing', ''],
    ['a space', ' '],
    ['a letter', 'a'],
    ['a digit', '1'],
    ['a hash', '#'],
    ['an arrow', '→'],
    ['two emojis', '🎂🎂'],
    ['an emoji and a letter', '🎂a'],
    ['a lone joiner', JOINER],
    ['a lone skin tone', SKIN_TONE],
    ['a heart in its text style', HEART],
    ['an emoji with a space around it', ' 🎂 '],
    ['more than 32 units', `🎂${(JOINER + '🎂').repeat(11)}`],
  ])('refuses %s', (_name, value) => {
    expect(isAcceptedByTheBack(value)).toBe(false)
  })

  it('wants the selector after a heart, and only a heart that is not emoji by default', () => {
    expect(isAcceptedByTheBack(HEART + SELECTOR)).toBe(true)
  })
})
