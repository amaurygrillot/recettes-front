/**
 * An address with most of its name hidden, so the person recognises it without it being read out
 * to anyone looking at the screen: `odile@exemple.fr` becomes `o***@exemple.fr`.
 */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf('@')
  if (at < 1) return email
  const first = String.fromCodePoint(email.codePointAt(0) ?? 0)
  return `${first}***${email.slice(at)}`
}
