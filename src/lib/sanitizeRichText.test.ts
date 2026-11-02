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

  it.each([
    ['underline', '<p>un <u>mot</u></p>'],
    ['strikethrough', '<p>une <s>erreur</s></p>'],
    ['a smaller text', '<p>une <small>note</small></p>'],
    ['a larger text', '<p>un <big>titre</big></p>'],
    ['all of them nested', '<p><big><u><s><strong><em>tout</em></strong></s></u></big></p>'],
  ])('keeps %s, with no attribute to add', (_what, html) => {
    expect(sanitizeRichText(html)).toBe(html)
  })

  it('leaves what recipes held before the three new tools exactly as it was', () => {
    const html =
      '<p>Mélange <strong>bien</strong> et <em>vite</em>.</p><ul><li>farine</li></ul><ol><li>un</li></ol><p>fin<br>de ligne</p>'

    expect(sanitizeRichText(html)).toBe(html)
  })

  it.each([
    [
      'a class on a size tag',
      '<small class="big" style="font-size:99px">x</small>',
      '<small>x</small>',
    ],
    ['an event handler on underline', '<u onmouseover="window.hacked = 1">x</u>', '<u>x</u>'],
    ['a style on strikethrough', '<s style="position:fixed;inset:0">x</s>', '<s>x</s>'],
    ['an id on a big text', '<big id="a" data-x="1">x</big>', '<big>x</big>'],
  ])('strips every attribute from the new tags: %s', (_what, html, expected) => {
    expect(sanitizeRichText(html)).toBe(expected)
  })

  it.each([
    ['a script inside a size tag', '<small><script>window.hacked = 1</script>x</small>'],
    ['an image inside underline', '<u><img src=x onerror="window.hacked = 1">x</u>'],
    ['an svg inside strikethrough', '<s><svg onload="window.hacked = 1"></svg>x</s>'],
    ['a font tag carrying a size', '<font size="7" color="red">x</font>'],
    ['mutation-style nesting', '<big><p><big><style>@import "x"</style></big></p></big>'],
  ])('still removes what does not belong, even next to the new tags: %s', (_what, html) => {
    const clean = sanitizeRichText(html)

    expect(clean).not.toMatch(/<(script|img|svg|style|font)|onerror|onload|@import/)
  })

  it('gives nothing for nothing', () => {
    expect(sanitizeRichText('')).toBe('')
  })
})
