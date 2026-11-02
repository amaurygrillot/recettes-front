import { LexicalBuilder } from '@lexical/extension'
import { describe, expect, it } from 'vitest'
import { $toHtml } from './htmlConversion'
import { createRichTextExtension } from './richTextExtension'

/** What the editor stores once it has opened this HTML: a round trip, with no screen involved. */
function roundTrip(html: string): string {
  const editor = LexicalBuilder.fromExtensions([createRichTextExtension(html)]).buildEditor()
  return editor.read($toHtml)
}

describe('opening stored HTML and storing it again', () => {
  it.each([
    ['a paragraph', '<p>Mélange tout.</p>'],
    ['bold and italic', '<p>Mélange <strong>bien</strong> et <em>vite</em>.</p>'],
    ['bold and italic together', '<p><strong><em>très</em></strong> vite</p>'],
    ['a bulleted list', '<ul><li>farine</li><li>sucre</li></ul>'],
    ['a numbered list', '<ol><li>un</li><li>deux</li></ol>'],
    ['a paragraph and a list', '<p>Pour la pâte :</p><ul><li>farine</li><li>beurre</li></ul>'],
    ['a line break', '<p>Une ligne<br>Une autre</p>'],
    ['underline', '<p>un <u>mot</u> souligné</p>'],
    ['strikethrough', '<p>une <s>erreur</s> barrée</p>'],
    ['a smaller text', '<p>une <small>note</small> discrète</p>'],
    ['a larger text', '<p>un <big>titre</big> de passage</p>'],
    ['a size inside a list', '<ul><li>une <small>petite</small> ligne</li></ul>'],
  ])('keeps %s as it is', (_what, html) => {
    expect(roundTrip(html)).toBe(html)
  })

  it('turns the old spellings into the editor’s own: b and i become strong and em', () => {
    expect(roundTrip('<p><b>gras</b> <i>italique</i></p>')).toBe(
      '<p><strong>gras</strong> <em>italique</em></p>',
    )
  })

  it('writes the marks in a fixed order, whichever order they were read in', () => {
    expect(roundTrip('<p><em><s><u><strong>tout</strong></u></s></em></p>')).toBe(
      '<p><u><s><strong><em>tout</em></strong></s></u></p>',
    )
  })

  it('writes a size around the other marks, and never both sizes at once', () => {
    expect(roundTrip('<p><small><strong>petit gras</strong></small></p>')).toBe(
      '<p><small><strong>petit gras</strong></small></p>',
    )
    expect(roundTrip('<p><big><small>les deux</small></big></p>')).toMatch(
      /^<p><(small|big)>les deux<\/(small|big)><\/p>$/,
    )
  })

  it('keeps what is not marked next to what is', () => {
    expect(roundTrip('<p>a <u>b</u> c <s>d</s> e <big>f</big></p>')).toBe(
      '<p>a <u>b</u> c <s>d</s> e <big>f</big></p>',
    )
  })

  it('puts plain text in a paragraph', () => {
    expect(roundTrip('Juste du texte, sans balise.')).toBe('<p>Juste du texte, sans balise.</p>')
  })

  it('keeps text and line breaks that are loose together, in one paragraph', () => {
    expect(roundTrip('Une ligne<br>Une autre')).toBe('<p>Une ligne<br>Une autre</p>')
  })

  it('escapes what would read as markup', () => {
    expect(roundTrip('<p>1 &lt; 2 &amp; 3 &gt; 2</p>')).toBe('<p>1 &lt; 2 &amp; 3 &gt; 2</p>')
  })

  it.each([
    ['nothing', ''],
    ['an emptied editor', '<p></p>'],
    ['blank paragraphs', '<p> </p><p><br></p>'],
    ['an empty list', '<ul><li></li></ul>'],
  ])('is empty for %s', (_what, html) => {
    expect(roundTrip(html)).toBe('')
  })

  it('drops the blank paragraphs left between paragraphs of text', () => {
    expect(roundTrip('<p>Un</p><p></p><p>Deux</p>')).toBe('<p>Un</p><p>Deux</p>')
  })

  describe('against what an attacker could have stored', () => {
    it.each([
      ['a script', '<p>Bonjour</p><script>window.hacked = true</script>', '<p>Bonjour</p>'],
      [
        'an image',
        '<p>Avant<img src="x" onerror="window.hacked = true">Après</p>',
        '<p>AvantAprès</p>',
      ],
      [
        'every attribute',
        '<p class="a" style="color:red" onclick="window.hacked = true">Texte</p>',
        '<p>Texte</p>',
      ],
      [
        'a link, keeping its words',
        '<p><a href="javascript:window.hacked = true">Clique</a></p>',
        '<p>Clique</p>',
      ],
      ['a heading, keeping its words', '<h1>Titre</h1><p>Texte</p>', '<p>Titre</p><p>Texte</p>'],
      [
        'an attribute on a size or a mark',
        '<p><small class="x" onmouseover="window.hacked = true">a</small><u style="color:red">b</u><s id="y">c</s><big data-z="1">d</big></p>',
        '<p><small>a</small><u>b</u><s>c</s><big>d</big></p>',
      ],
      [
        'a script inside a size',
        '<p><big><script>window.hacked = true</script>grand</big></p>',
        '<p><big>grand</big></p>',
      ],
    ])('does not let %s into what is stored again', (_what, html, expected) => {
      expect(roundTrip(html)).toBe(expected)
      expect(Reflect.get(window, 'hacked')).toBeUndefined()
    })
  })
})
