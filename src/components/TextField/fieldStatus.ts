export type FieldStatus = 'idle' | 'met' | 'error' | 'success'

/** What a field can say under itself: the messages that compete for the one place, and its look. */
export interface FieldMessages {
  /** Help shown under the field while there is no error and no success message. */
  hint?: string | undefined
  /** The hint is a rule the value now keeps: it turns green with a tick, the frame stays as it was. */
  hintMet?: boolean | undefined
  /**
   * Replaces the hint and marks the field as invalid. The message is tied to the field with
   * `aria-describedby`; how a failed submission is announced (focus on the first invalid field)
   * is for the form to decide, so the message is not a live region.
   */
  error?: string | undefined
  /** Marks the field as invalid, in its brick frame, without a message of its own (the form says it elsewhere). */
  invalid?: boolean | undefined
  /** Replaces the hint and puts a tick in the field. */
  success?: string | undefined
}

/** One message at a time under the field: the error wins over the success, which wins over the hint. */
export function describeField({ error, invalid, success, hint, hintMet }: FieldMessages): {
  status: FieldStatus
  message: string | undefined
} {
  if (error) return { status: 'error', message: error }
  if (invalid) return { status: 'error', message: undefined }
  if (success) return { status: 'success', message: success }
  if (hint && hintMet) return { status: 'met', message: hint }
  return { status: 'idle', message: hint }
}

export const FIELD_BORDERS: Record<FieldStatus, string> = {
  idle: 'border-2 border-ink-500 bg-paper-50 focus:border-ink-900',
  met: 'border-2 border-ink-500 bg-paper-50 focus:border-ink-900',
  error: 'border-3 border-brick bg-brick-wash',
  success: 'border-3 border-herb bg-paper-50 pr-13',
}

/** How many characters are typed out of how many are allowed: a field with a limit shows it. */
export interface FieldCounter {
  typed: number
  max: number
}
