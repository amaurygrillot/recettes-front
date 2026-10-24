import { z } from 'zod'
import { sameValues, type EditorValues } from './editorModel'
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

/** Whether the draft was left by a lost session. Reading changes nothing: it can be asked again by a render that runs twice. */
export function wasInterrupted(key: string): boolean {
  try {
    return window.sessionStorage.getItem(`${INTERRUPTED_PREFIX}${key}`) !== null
  } catch {
    return false
  }
}

/** Forgets that the draft was left by a lost session: it has been taken up. */
export function forgetInterrupted(key: string): void {
  try {
    window.sessionStorage.removeItem(`${INTERRUPTED_PREFIX}${key}`)
  } catch {
    // Nothing was kept, so there is nothing to forget.
  }
}

/** What the editor opens with, and what it has to ask. */
export interface Beginning {
  values: EditorValues
  /** A draft that waits for an answer: « Reprendre ton brouillon ? ». */
  offered: Draft | undefined
  /** The draft was taken up without asking: the session was lost, and the member is back. */
  resumed: boolean
}

/**
 * How the editor opens: with the draft when the member left it by losing their session, with what
 * the recipe holds and the draft offered when there is one, with what the recipe holds when not. A
 * draft that holds what the recipe holds already is not a draft.
 */
export function readBeginning(key: string, initial: EditorValues): Beginning {
  const draft = loadDraft(key)
  if (draft === undefined || sameValues(draft.values, initial)) {
    return { values: initial, offered: undefined, resumed: false }
  }
  return wasInterrupted(key)
    ? { values: draft.values, offered: undefined, resumed: true }
    : { values: initial, offered: draft, resumed: false }
}
