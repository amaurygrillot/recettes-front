/** What the editor tells the recipe page when it has just created the recipe: the page then celebrates. */
export const JUST_PUBLISHED_STATE = { justPublished: true } as const

export function isJustPublished(state: unknown): boolean {
  return (
    typeof state === 'object' &&
    state !== null &&
    'justPublished' in state &&
    state.justPublished === true
  )
}
