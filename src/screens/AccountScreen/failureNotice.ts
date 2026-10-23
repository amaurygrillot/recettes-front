import { isTransient, type ApiFailure } from '../../api/failure'
import { failureMessage } from '../../app/failureMessage'
import type { FailureNotice } from '../../app/useToasts'
import { strings } from './strings'

/**
 * The notification of a save that failed for a reason no field can show: what happened, the
 * sentence of its cause, and « Réessayer » when sending the same thing again can work. What was
 * typed stays in the fields either way.
 */
export function failureNotice(failure: ApiFailure, retry: () => void): FailureNotice {
  return {
    message: strings.failure,
    detail: failureMessage(failure),
    retry: isTransient(failure) ? retry : undefined,
  }
}
