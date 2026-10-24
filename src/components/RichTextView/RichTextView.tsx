import { useMemo } from 'react'
import { classNames } from '../../lib/classNames'
import { sanitizeRichText } from '../../lib/sanitizeRichText'

export interface RichTextViewProps {
  /** The HTML an author wrote, as the back end stored it: unsanitised, so never trusted. */
  html: string
  /** `step` is the 22/34 text of a recipe's steps; `body` the 18/28 of an introduction or a tip. */
  size?: 'step' | 'body'
}

const SIZES = { step: 'text-step', body: 'text-body' }

/**
 * The one place that shows stored HTML (cleaned by `sanitizeRichText`). The back end keeps what the author wrote, so this is the
 * only defence against a script slipped into a recipe: everything outside the editor's own
 * vocabulary is removed before the markup reaches the page.
 */
export function RichTextView({ html, size = 'body' }: RichTextViewProps) {
  // A page re-renders for reasons that have nothing to do with the text (a photo viewer opening).
  const safeHtml = useMemo(() => sanitizeRichText(html), [html])
  return (
    <div
      className={classNames('rich-text text-ink-900', SIZES[size])}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  )
}
