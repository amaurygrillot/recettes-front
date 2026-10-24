/**
 * The sentence of a form library's error for a field. An error of a list can carry its own
 * sentence (« Ajoute au moins une étape. ») on the list, or under `root`; the error of a field
 * has it as `message`. Anything else says nothing.
 */
export function messageOf(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null) return undefined
  if ('message' in error && typeof error.message === 'string' && error.message !== '') {
    return error.message
  }
  if ('root' in error) return messageOf(error.root)
  return undefined
}
