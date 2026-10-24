import DOMPurify from 'dompurify'

// What the editor can write: paragraphs, bold, italic and the two kinds of list. Nothing else
// is kept, and no attribute at all (no link, no style, no event handler, no image).
const ALLOWED = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: [],
  ALLOW_DATA_ATTR: false,
  ALLOW_ARIA_ATTR: false,
}

/**
 * The markup of a recipe's text with everything outside the editor's own vocabulary removed. The
 * back end keeps what the author wrote, so it is the front that closes the stored-XSS hole: this
 * is applied before the text is shown (`RichTextView`) and before it is opened for editing.
 */
export function sanitizeRichText(html: string): string {
  return DOMPurify.sanitize(html, ALLOWED)
}
