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
} from 'lexical'
import { $fillFromHtml } from './htmlConversion'

/** Bold and italic are the only formats: a shortcut for another one (Ctrl + U) is swallowed. */
const AllowedFormatsExtension = defineExtension({
  name: 'recettes/allowed-formats',
  register: (editor) =>
    editor.registerCommand(
      FORMAT_TEXT_COMMAND,
      (format) => format !== 'bold' && format !== 'italic',
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

/** The look of what is written: the text styles come from the page's `.rich-text`, which the viewer shares. */
const THEME = {
  text: { bold: 'font-bold', italic: 'italic' },
  list: { nested: { listitem: 'list-none' } },
}

/**
 * An editor made of the minimal vocabulary of a recipe's text: paragraphs, bold, italic, bulleted
 * and numbered lists, undo and redo. Create one per editor (it must stay the same object for as
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
