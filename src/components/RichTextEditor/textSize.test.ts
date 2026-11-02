import { LexicalBuilder } from '@lexical/extension'
import { $getRoot, $isTextNode, FORMAT_TEXT_COMMAND, type LexicalEditor } from 'lexical'
import { describe, expect, it } from 'vitest'
import { $toHtml } from './htmlConversion'
import { createRichTextExtension } from './richTextExtension'
import { $sizeAtCaret, chooseSize, type TextSize } from './textSize'

function editorWith(html: string): LexicalEditor {
  const editor = LexicalBuilder.fromExtensions([createRichTextExtension(html)]).buildEditor()
  // The editor has no screen here: its selection is made in its state, over all the text.
  editor.update(
    () => {
      const text = $getRoot().getFirstDescendant()
      if (!$isTextNode(text)) return
      const selection = text.select(0, text.getTextContentSize())
      // What a browser's selection change does: the selection takes the format of the text it is over.
      selection.format = text.getFormat()
    },
    { discrete: true },
  )
  return editor
}

function sizeOf(editor: LexicalEditor): TextSize {
  return editor.read($sizeAtCaret)
}

describe('chooseSize', () => {
  it.each([
    ['normal', 'small', '<p><small>texte</small></p>'],
    ['normal', 'large', '<p><big>texte</big></p>'],
  ] as const)('goes from %s to %s', (from, to, html) => {
    const editor = editorWith('<p>texte</p>')
    expect(sizeOf(editor)).toBe(from)

    chooseSize(editor, from, to)

    expect(editor.read($toHtml)).toBe(html)
    expect(sizeOf(editor)).toBe(to)
  })

  it.each([
    ['small', 'normal', '<p><small>texte</small></p>', '<p>texte</p>'],
    ['large', 'normal', '<p><big>texte</big></p>', '<p>texte</p>'],
    ['small', 'large', '<p><small>texte</small></p>', '<p><big>texte</big></p>'],
    ['large', 'small', '<p><big>texte</big></p>', '<p><small>texte</small></p>'],
  ] as const)('goes from %s to %s', (from, to, start, expected) => {
    const editor = editorWith(start)
    expect(sizeOf(editor)).toBe(from)

    chooseSize(editor, from, to)

    expect(editor.read($toHtml)).toBe(expected)
  })

  it('does nothing when the size is already the one asked for', () => {
    const editor = editorWith('<p><small>texte</small></p>')

    chooseSize(editor, 'small', 'small')

    expect(editor.read($toHtml)).toBe('<p><small>texte</small></p>')
  })

  it('knows no other way to a size than its own command', () => {
    const editor = editorWith('<p>texte</p>')

    expect(editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')).toBe(true)
  })
})
