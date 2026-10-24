/**
 * The text of some HTML, without its tags and on one line: what a step starts with when it is
 * shown small. The HTML is only read (a parsed document runs nothing), never put in a page.
 */
export function plainText(html: string): string {
  // The end of a paragraph or of a list item is a break between words, which the tags alone would lose.
  const spaced = html.replace(/<\/(?:p|li|div)>|<br\s*\/?>/gi, ' ')
  const text = new DOMParser().parseFromString(spaced, 'text/html').body.textContent
  return text.replace(/\s+/g, ' ').trim()
}
