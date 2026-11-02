import {
  $getSelection,
  $isRangeSelection,
  SET_TEXT_FORMAT_COMMAND,
  type LexicalEditor,
} from 'lexical'

/**
 * The size of a text, relative to the field's own: Normal is the field's size, Petit and Grand the sizes
 * of the page's text just below and above it. They are carried by the `subscript` and `superscript` formats
 * (see `htmlConversion.ts` for how they are stored).
 */
export type TextSize = 'small' | 'normal' | 'large'

/** The size at the caret (read inside an editor state). */
export function $sizeAtCaret(): TextSize {
  const selection = $getSelection()
  if (!$isRangeSelection(selection)) return 'normal'
  if (selection.hasFormat('superscript')) return 'large'
  if (selection.hasFormat('subscript')) return 'small'
  return 'normal'
}

/**
 * Gives the selection (or what is typed next) a size. It sets both formats outright instead of toggling one, so it
 * works whatever the text was before, a selection of several sizes included (Normal then makes it all Normal).
 */
export function chooseSize(editor: LexicalEditor, wanted: TextSize): void {
  editor.dispatchCommand(SET_TEXT_FORMAT_COMMAND, {
    subscript: wanted === 'small',
    superscript: wanted === 'large',
  })
}
