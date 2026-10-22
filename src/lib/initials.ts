/**
 * Initials shown in an avatar: capitals, without accents, first letter of the first and of the
 * last name. A single name gives a single letter, no name gives an empty string.
 */
export function getInitials(fullName: string): string {
  const names = fullName
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .split(/\s+/)
    .filter((name) => /^\p{L}/u.test(name))

  const firstName = names.at(0)
  const lastName = names.length > 1 ? names.at(-1) : undefined

  return (
    [firstName, lastName]
      // First code point, not first UTF-16 unit: a letter outside the BMP must not be cut in half.
      .map((name) => (name === undefined ? '' : (Array.from(name)[0] ?? '')))
      .join('')
      .toUpperCase()
  )
}
