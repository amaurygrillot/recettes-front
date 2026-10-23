import type { ApiFailure } from '../api/failure'
import { strings } from './strings'

const { failures } = strings

/**
 * The sentence for a failed call, one per cause. A screen that knows better (a `401` on the login
 * form means wrong credentials) answers that case itself and leaves the others to this.
 */
export function failureMessage(failure: ApiFailure): string {
  switch (failure.kind) {
    case 'network':
      return failures.network
    case 'invalid-request':
      return failures.invalidRequest
    case 'unauthorized':
      return failures.unauthorized
    case 'forbidden':
      return failures.forbidden
    case 'not-found':
      return failures.notFound
    case 'conflict':
      return failures.conflict
    case 'payload-too-large':
      return failures.payloadTooLarge
    case 'rate-limited':
      return failures.rateLimited(failure.retryAfterSeconds)
    case 'unavailable':
      return failures.unavailable(failure.retryAfterSeconds)
    case 'server-error':
      return failures.serverError
    case 'unexpected':
      return failures.unexpected
  }
}
