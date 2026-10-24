import { describe, expect, it } from 'vitest'
import { sanitizeRichText } from './sanitizeRichText'

describe('sanitizeRichText', () => {
  it('keeps what the editor writes', () => {
    const html =
      '<p>Mélange <strong>bien</strong> et <em>vite</em>.<br></p><ul><li>a</li></ul><ol><li>b</li></ol>'

    expect(sanitizeRichText(html)).toBe(html)
  })

  it.each([
    ['a script', '<p>Bonjour</p><script>alert(1)</script>', '<p>Bonjour</p>'],
    ['an event handler', '<p onclick="alert(1)">Clique</p>', '<p>Clique</p>'],
    ['a link, keeping its words', '<a href="javascript:alert(1)">Clique</a>', 'Clique'],
    ['every attribute', '<p class="x" style="color:red" id="y">Texte</p>', '<p>Texte</p>'],
    ['an image', '<p>Avant<img src="x" onerror="alert(1)">Après</p>', '<p>AvantAprès</p>'],
  ])('removes %s', (_what, html, expected) => {
    expect(sanitizeRichText(html)).toBe(expected)
  })

  it('gives nothing for nothing', () => {
    expect(sanitizeRichText('')).toBe('')
  })
})
