import { describe, expect, it } from 'vitest'
import { ApiRequestError, type ApiFailure } from './failure'
import { shouldRetryQuery } from './queryClient'

const failures: Record<string, ApiFailure> = {
  network: { kind: 'network' },
  unavailable: { kind: 'unavailable', status: 503, detail: undefined, retryAfterSeconds: 3 },
  serverError: { kind: 'server-error', status: 500, detail: undefined },
  notFound: { kind: 'not-found', status: 404, detail: undefined },
  forbidden: { kind: 'forbidden', status: 403, detail: undefined },
  invalid: { kind: 'invalid-request', status: 400, detail: undefined },
}

describe('shouldRetryQuery', () => {
  it.each(['network', 'unavailable', 'serverError'])('tries a %s again, twice', (name) => {
    const error = new ApiRequestError(failures[name] ?? { kind: 'network' })

    expect([0, 1, 2].map((failureCount) => shouldRetryQuery(failureCount, error))).toEqual([
      true,
      true,
      false,
    ])
  })

  it.each(['notFound', 'forbidden', 'invalid'])(
    'does not repeat a %s: the answer would be the same',
    (name) => {
      const error = new ApiRequestError(failures[name] ?? { kind: 'network' })

      expect(shouldRetryQuery(0, error)).toBe(false)
    },
  )
})
