import { z } from 'zod'
import type { EditorValues } from './editorModel'
import { draftValuesSchema } from './editorSchema'

/**
 * The draft of a recipe, kept on this device only (`localStorage`): nothing of it is sent before
 * « Enregistrer ». Storage can be blocked or full (private mode): then nothing is kept, and the
 * editor says so (`saveDraft` answers whether it worked) instead of failing.
 */
const PREFIX = 'recettes.draft.'
const INTERRUPTED_PREFIX = 'recettes.draft-interrupted.'

/** One draft per recipe being edited, and one for the recipe being created. */
export function draftKey(recipeId: string | undefined): string {
  return `${PREFIX}${recipeId ?? 'new'}`
}

export interface Draft {
  /** Epoch milliseconds of the last change that was kept. */
  savedAt: number
  values: EditorValues
}

const storedSchema = z.object({ savedAt: z.number(), values: draftValuesSchema })

/** The draft kept under `key`, or nothing when there is none or what is there is not a draft. */
export function loadDraft(key: string): Draft | undefined {
  try {
    const stored = window.localStorage.getItem(key)
    if (stored === null) return undefined
    const parsed = storedSchema.safeParse(JSON.parse(stored))
    return parsed.success ? parsed.data : undefined
  } catch {
    return undefined
  }
}

/** Keeps the values as the draft of `key`; false when the device would not keep them. */
export function saveDraft(key: string, values: EditorValues, savedAt = Date.now()): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify({ savedAt, values }))
    return true
  } catch {
    return false
  }
}

export function clearDraft(key: string): void {
  try {
    window.localStorage.removeItem(key)
    window.sessionStorage.removeItem(`${INTERRUPTED_PREFIX}${key}`)
  } catch {
    // Nothing was kept, so there is nothing to forget.
  }
}

/**
 * Notes that this tab lost its session while this draft was open: when the member is back (the page
 * is opened again after the sign-in), the draft is taken up again without asking, as it was left.
 */
export function markInterrupted(key: string): void {
  try {
    window.sessionStorage.setItem(`${INTERRUPTED_PREFIX}${key}`, '1')
  } catch {
    // Without it the draft is simply offered again, as any draft.
  }
}

/** Whether the draft was left by a lost session, forgetting it: it is asked once, when the page opens. */
export function takeInterrupted(key: string): boolean {
  try {
    const interrupted = window.sessionStorage.getItem(`${INTERRUPTED_PREFIX}${key}`) !== null
    window.sessionStorage.removeItem(`${INTERRUPTED_PREFIX}${key}`)
    return interrupted
  } catch {
    return false
  }
}
