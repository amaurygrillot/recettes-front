import { describe, expect, it } from 'vitest'
import type { ApiFailure } from '../api/failure'
import { failureMessage } from './failureMessage'

const problem = { status: 400, detail: undefined }

const KINDS: readonly ApiFailure[] = [
  { kind: 'network' },
  { kind: 'invalid-request', ...problem },
  { kind: 'unauthorized', ...problem },
  { kind: 'forbidden', ...problem },
  { kind: 'not-found', ...problem },
  { kind: 'conflict', ...problem },
  { kind: 'payload-too-large', ...problem },
  { kind: 'rate-limited', ...problem, retryAfterSeconds: 30 },
  { kind: 'unavailable', ...problem, retryAfterSeconds: 30 },
  { kind: 'server-error', ...problem },
  { kind: 'unexpected', status: undefined, detail: undefined },
]

describe('failureMessage', () => {
  it('has a sentence for every kind of failure, and no two kinds share one', () => {
    const messages = KINDS.map(failureMessage)

    expect(messages.every((message) => message.length > 0)).toBe(true)
    expect(new Set(messages).size).toBe(KINDS.length)
  })

  it.each([
    ['rate-limited', 30, 'Tu vas un peu vite. Réessaie dans 30 secondes.'],
    ['rate-limited', 1, 'Tu vas un peu vite. Réessaie dans 1 seconde.'],
    ['rate-limited', undefined, 'Tu vas un peu vite. Réessaie dans un instant.'],
    ['unavailable', 30, 'Le serveur est très sollicité. Réessaie dans 30 secondes.'],
    ['unavailable', undefined, 'Le serveur est très sollicité. Réessaie dans un instant.'],
  ] as const)('tells a %s caller how long to wait (%s s)', (kind, retryAfterSeconds, expected) => {
    expect(failureMessage({ kind, ...problem, retryAfterSeconds })).toBe(expected)
  })
})
