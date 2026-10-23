import DOMPurify from 'dompurify'
import { useMemo } from 'react'
import { classNames } from '../../lib/classNames'

export interface RichTextViewProps {
  /** The HTML an author wrote, as the back end stored it: unsanitised, so never trusted. */
  html: string
  /** `step` is the 22/34 text of a recipe's steps; `body` the 18/28 of an introduction or a tip. */
  size?: 'step' | 'body'
}

// What the editor can write: paragraphs, bold, italic and the two kinds of list. Nothing else
// is kept, and no attribute at all (no link, no style, no event handler, no image).
const ALLOWED = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: [],
  ALLOW_DATA_ATTR: false,
  ALLOW_ARIA_ATTR: false,
}

const SIZES = { step: 'text-step', body: 'text-body' }

/**
 * The one place that shows stored HTML. The back end keeps what the author wrote, so this is the
 * only defence against a script slipped into a recipe: everything outside the editor's own
 * vocabulary is removed before the markup reaches the page.
 */
export function RichTextView({ html, size = 'body' }: RichTextViewProps) {
  // A page re-renders for reasons that have nothing to do with the text (a photo viewer opening).
  const safeHtml = useMemo(() => DOMPurify.sanitize(html, ALLOWED), [html])
  return (
    <div
      className={classNames('rich-text text-ink-900', SIZES[size])}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  )
}
