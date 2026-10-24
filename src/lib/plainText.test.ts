import { describe, expect, it } from 'vitest'
import { plainText } from './plainText'

describe('plainText', () => {
  it('keeps the words and drops the tags', () => {
    expect(plainText('<p>Mélange la <strong>farine</strong> et le sel.</p>')).toBe(
      'Mélange la farine et le sel.',
    )
  })

  it('puts the paragraphs and list items on one line', () => {
    expect(plainText('<p>Un</p>\n<ul><li>deux</li><li>trois</li></ul>')).toBe('Un deux trois')
  })

  it('reads entities as the characters they stand for', () => {
    expect(plainText('<p>Fondant &amp; croustillant</p>')).toBe('Fondant & croustillant')
  })

  it('does not run anything that is in it', () => {
    expect(plainText('<p>Sûr</p><img src=x onerror="document.title=1">')).toBe('Sûr')
    expect(document.title).not.toBe('1')
  })

  it('is empty for nothing written', () => {
    expect(plainText('')).toBe('')
    expect(plainText('<p></p>')).toBe('')
  })
})
