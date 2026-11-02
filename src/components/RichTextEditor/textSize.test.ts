import { LexicalBuilder } from '@lexical/extension'
import { $getRoot, $getSelection, $isRangeSelection, type LexicalEditor } from 'lexical'
import { describe, expect, it } from 'vitest'
import { $toHtml } from './htmlConversion'
import { createRichTextExtension } from './richTextExtension'
import { $sizeAtCaret, chooseSize, type TextSize } from './textSize'

/**
 * An editor with this text, and a selection over all of it (the editor has no screen here, so the selection is made
 * in its state, taking the format of the text it is over as a browser's selection change does) or, `collapsed`, a caret at its end.
 */
function editorWith(html: string, { collapsed = false } = {}): LexicalEditor {
  const editor = LexicalBuilder.fromExtensions([createRichTextExtension(html)]).buildEditor()
  editor.update(
    () => {
      const texts = $getRoot().getAllTextNodes()
      const first = texts[0]
      const last = texts.at(-1)
      if (first === undefined || last === undefined) return
      const end = last.getTextContentSize()
      const range = collapsed ? last.select(end, end) : first.select(0, 0)
      if (!collapsed) range.focus.set(last.getKey(), end, 'text')
      range.format = (collapsed ? last : first).getFormat()
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
    ['normal', 'small', '<p>texte</p>', '<p><small>texte</small></p>'],
    ['normal', 'large', '<p>texte</p>', '<p><big>texte</big></p>'],
    ['small', 'normal', '<p><small>texte</small></p>', '<p>texte</p>'],
    ['large', 'normal', '<p><big>texte</big></p>', '<p>texte</p>'],
    ['small', 'large', '<p><small>texte</small></p>', '<p><big>texte</big></p>'],
    ['large', 'small', '<p><big>texte</big></p>', '<p><small>texte</small></p>'],
    ['small', 'small', '<p><small>texte</small></p>', '<p><small>texte</small></p>'],
  ] as const)('takes a text from %s to %s', (from, to, start, expected) => {
    const editor = editorWith(start)
    expect(sizeOf(editor)).toBe(from)

    chooseSize(editor, to)

    expect(editor.read($toHtml)).toBe(expected)
    expect(sizeOf(editor)).toBe(to)
  })

  it('takes a selection of several sizes to one, Normal included', () => {
    const editor = editorWith('<p><small>petit</small> normal <big>grand</big></p>')

    chooseSize(editor, 'normal')

    expect(editor.read($toHtml)).toBe('<p>petit normal grand</p>')
  })

  it('makes a selection of several sizes the same size', () => {
    const editor = editorWith('<p><small>petit</small> normal</p>')

    chooseSize(editor, 'large')

    expect(editor.read($toHtml)).toBe('<p><big>petit normal</big></p>')
  })

  it('sets the size of what is typed next at a caret, and leaves the text alone', () => {
    const editor = editorWith('<p><small>texte</small></p>', { collapsed: true })
    expect(sizeOf(editor)).toBe('small')

    chooseSize(editor, 'normal')

    expect(sizeOf(editor)).toBe('normal')
    expect(editor.read($toHtml)).toBe('<p><small>texte</small></p>')
    expect(
      editor.read(() => {
        const s = $getSelection()
        return $isRangeSelection(s) && s.isCollapsed()
      }),
    ).toBe(true)
  })
})
