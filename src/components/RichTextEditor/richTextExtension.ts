import { HistoryExtension } from '@lexical/history'
import { ListExtension } from '@lexical/list'
import { HeadingNode, QuoteNode, RichTextExtension } from '@lexical/rich-text'
import { mergeRegister } from '@lexical/utils'
import {
  $createParagraphNode,
  COMMAND_PRIORITY_HIGH,
  FORMAT_TEXT_COMMAND,
  defineExtension,
  type ElementNode,
  type TextFormatType,
} from 'lexical'
import { $fillFromHtml } from './htmlConversion'

/**
 * What a text can be: bold, italic, underlined, struck through, and (as the `subscript` and `superscript` formats,
 * see `textSize.ts`) smaller or larger. A shortcut for any other format (code, highlight…) is swallowed.
 */
const ALLOWED_FORMATS: readonly TextFormatType[] = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'subscript',
  'superscript',
]

const AllowedFormatsExtension = defineExtension({
  name: 'recettes/allowed-formats',
  register: (editor) =>
    editor.registerCommand(
      FORMAT_TEXT_COMMAND,
      (format) => !ALLOWED_FORMATS.includes(format),
      COMMAND_PRIORITY_HIGH,
    ),
})

function $replaceByParagraph(node: ElementNode): void {
  const paragraph = $createParagraphNode()
  paragraph.append(...node.getChildren())
  node.replace(paragraph)
}

/** No headings and no quotes: what brings one in (a paste) becomes a paragraph. */
const PlainBlocksExtension = defineExtension({
  name: 'recettes/plain-blocks',
  register: (editor) =>
    mergeRegister(
      editor.registerNodeTransform(HeadingNode, $replaceByParagraph),
      editor.registerNodeTransform(QuoteNode, $replaceByParagraph),
    ),
})

/**
 * The look of what is written: the text styles come from the page's `.rich-text`, which the viewer shares (the sizes
 * too: Lexical writes them as `sub` and `sup`, which that stylesheet draws as the two sizes).
 */
const THEME = {
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'rt-underline',
    strikethrough: 'rt-strike',
    underlineStrikethrough: 'rt-underline-strike',
  },
  list: { nested: { listitem: 'list-none' } },
}

/**
 * An editor made of the vocabulary of a recipe's text: paragraphs, bold, italic, underline, strikethrough, two sizes,
 * bulleted and numbered lists, undo and redo. Create one per editor (it must stay the same object for as
 * long as the editor lives) with the stored HTML to start from.
 */
export function createRichTextExtension(initialHtml: string) {
  return defineExtension({
    name: 'recettes/rich-text',
    namespace: 'recettes-rich-text',
    dependencies: [
      RichTextExtension,
      ListExtension,
      HistoryExtension,
      AllowedFormatsExtension,
      PlainBlocksExtension,
    ],
    theme: THEME,
    $initialEditorState: (editor) => {
      $fillFromHtml(editor, initialHtml)
    },
    onError: (error) => {
      throw error
    },
  })
}
