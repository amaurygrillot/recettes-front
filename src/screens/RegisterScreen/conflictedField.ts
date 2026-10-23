import type { ApiFailure } from '../../api/failure'

/**
 * Which field a `409` on registration is about. The back end says it in the problem's `detail`
 * (« Username already exists » or « Email already exists »); nothing else in the answer tells
 * the two apart. Another conflict, or a detail in other words, names no field.
 */
export function conflictedField(failure: ApiFailure): 'username' | 'email' | undefined {
  if (failure.kind !== 'conflict') return undefined
  const detail = failure.detail?.toLowerCase() ?? ''
  if (detail.includes('username')) return 'username'
  if (detail.includes('email')) return 'email'
  return undefined
}
