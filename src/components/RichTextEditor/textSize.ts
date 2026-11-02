import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  type LexicalEditor,
  type TextFormatType,
} from 'lexical'

/**
 * The size of a text, relative to the field's own: Normal is the field's size, Petit and Grand the sizes
 * of the page's text just below and above it. They are carried by the `subscript` and `superscript` formats
 * (see `htmlConversion.ts` for how they are stored).
 */
export type TextSize = 'small' | 'normal' | 'large'

const FORMATS: Record<Exclude<TextSize, 'normal'>, TextFormatType> = {
  small: 'subscript',
  large: 'superscript',
}

/** The size at the caret (read inside an editor state). */
export function $sizeAtCaret(): TextSize {
  const selection = $getSelection()
  if (!$isRangeSelection(selection)) return 'normal'
  if (selection.hasFormat('superscript')) return 'large'
  if (selection.hasFormat('subscript')) return 'small'
  return 'normal'
}

/**
 * Gives the selection (or what is typed next) a size. The two formats toggle and exclude each other, so going to
 * Normal switches the current one off and going to a size switches that one on, whatever is on now.
 */
export function chooseSize(editor: LexicalEditor, current: TextSize, wanted: TextSize): void {
  if (current === wanted) return
  const toggled = wanted === 'normal' ? current : wanted
  if (toggled === 'normal') return
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, FORMATS[toggled])
}
