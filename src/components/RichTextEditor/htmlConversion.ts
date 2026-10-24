import { $generateNodesFromDOM } from '@lexical/html'
import { $isListItemNode, $isListNode } from '@lexical/list'
import {
  $createParagraphNode,
  $getRoot,
  $isElementNode,
  $isLineBreakNode,
  $isTextNode,
  type LexicalEditor,
  type LexicalNode,
  type ParagraphNode,
} from 'lexical'
import { sanitizeRichText } from '../../lib/sanitizeRichText'

function escapeHtml(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function $textOf(node: LexicalNode): string {
  return node.getTextContent().trim()
}

/**
 * The markup of one node, in the editor's own vocabulary only (`p`, `br`, `strong`, `em`, `ul`,
 * `ol`, `li`) and with no attribute: what is stored is exactly what `RichTextView` will keep.
 */
function $nodeToHtml(node: LexicalNode): string {
  if ($isTextNode(node)) {
    let html = escapeHtml(node.getTextContent())
    if (node.hasFormat('italic')) html = `<em>${html}</em>`
    if (node.hasFormat('bold')) html = `<strong>${html}</strong>`
    return html
  }
  if ($isLineBreakNode(node)) return '<br>'
  if (!$isElementNode(node)) return ''

  const children = node.getChildren().map($nodeToHtml).join('')
  if ($isListNode(node)) {
    const tag = node.getListType() === 'number' ? 'ol' : 'ul'
    return `<${tag}>${children}</${tag}>`
  }
  if ($isListItemNode(node)) return `<li>${children}</li>`
  return `<p>${children}</p>`
}

/**
 * What the editor holds, as the HTML to store: empty (`''`) when nothing is written, and without
 * the blank paragraphs and list items left by a stray Enter. Call it inside `editorState.read`.
 */
export function $toHtml(): string {
  const blocks = $getRoot().getChildren()
  return blocks
    .filter((block) => $textOf(block) !== '')
    .map($nodeToHtml)
    .join('')
}

/**
 * Replaces what the editor holds with stored HTML. The markup is cleaned first (the back end keeps
 * whatever was written, so nothing foreign gets into the editor), and loose text becomes paragraphs.
 * Call it inside `editor.update`.
 */
export function $fillFromHtml(editor: LexicalEditor, html: string): void {
  const root = $getRoot()
  root.clear()
  const document = new DOMParser().parseFromString(sanitizeRichText(html), 'text/html')

  let paragraph: ParagraphNode | null = null
  for (const node of $generateNodesFromDOM(editor, document)) {
    if ($isElementNode(node) && !node.isInline()) {
      paragraph = null
      root.append(node)
    } else {
      if (paragraph === null) {
        paragraph = $createParagraphNode()
        root.append(paragraph)
      }
      paragraph.append(node)
    }
  }
  if (root.isEmpty()) root.append($createParagraphNode())
}
