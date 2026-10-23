/**
 * Where someone was in a recipe's step-by-step mode, kept on this device only (`localStorage`):
 * « Reprendre à l'étape 3 » brings them back after the phone went to sleep or the tab closed.
 * Storage can be blocked (private mode, a full disk): then nothing is remembered, and nothing breaks.
 */

const KEY_PREFIX = 'recettes.cooking.'

const keyOf = (recipeId: string) => `${KEY_PREFIX}${recipeId}`

/** The step reached, counted from 1, or nothing when none was kept (or what was kept is not a step). */
export function readCookingStep(recipeId: string): number | undefined {
  try {
    const stored = window.localStorage.getItem(keyOf(recipeId))
    if (stored === null || !/^\d+$/.test(stored)) return undefined
    const step = Number(stored)
    return step >= 1 ? step : undefined
  } catch {
    return undefined
  }
}

export function saveCookingStep(recipeId: string, step: number): void {
  try {
    window.localStorage.setItem(keyOf(recipeId), String(step))
  } catch {
    // Nothing to do: the step simply is not remembered.
  }
}

/** Forgets the step: the recipe was finished, or the cook started over. */
export function clearCookingStep(recipeId: string): void {
  try {
    window.localStorage.removeItem(keyOf(recipeId))
  } catch {
    // Same as above.
  }
}
