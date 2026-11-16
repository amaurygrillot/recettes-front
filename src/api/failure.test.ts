import { describe, expect, it } from 'vitest'
import { failureFromResponse, isTransient, type ApiFailure, type ApiFailureKind } from './failure'

function answer(status: number, headers: Record<string, string> = {}): Response {
  return new Response(null, { status, headers })
}

const problem = { status: 0, title: 'Problem', detail: 'The title must not be blank.' }

const KIND_BY_STATUS: readonly (readonly [status: number, kind: ApiFailureKind])[] = [
  [400, 'invalid-request'],
  [401, 'unauthorized'],
  [403, 'forbidden'],
  [404, 'not-found'],
  [408, 'network'],
  [409, 'conflict'],
  [413, 'payload-too-large'],
  [429, 'rate-limited'],
  [500, 'server-error'],
  [502, 'server-error'],
  [503, 'unavailable'],
  [406, 'unexpected'],
  [415, 'unexpected'],
  [302, 'unexpected'],
]

const PROBLEM_TYPE = 'urn:recettes:problem:'

describe('failureFromResponse', () => {
  it.each(KIND_BY_STATUS.filter(([status]) => status !== 408))(
    'reads a %i as « %s »',
    (status, kind) => {
      expect(failureFromResponse(answer(status), problem)).toMatchObject({ kind, status })
    },
  )

  it('reads a 408 as a connection that failed: the server gave up on a client gone quiet', () => {
    expect(failureFromResponse(answer(408), { status: 408, error: 'Request Timeout' })).toEqual({
      kind: 'network',
    })
  })

  it.each([['recipe-list-name-taken'], ['too-many-recipe-lists'], ['recipe-list-full']] as const)(
    'tells a 409 of type « %s » by its problem type',
    (reason) => {
      const body = { ...problem, type: `${PROBLEM_TYPE}${reason}` }

      expect(failureFromResponse(answer(409), body)).toMatchObject({ kind: 'conflict', reason })
    },
  )

  it.each([['about:blank'], [`${PROBLEM_TYPE}something-new`], ['']])(
    'gives no reason to a 409 of type « %s »',
    (type) => {
      expect(failureFromResponse(answer(409), { ...problem, type })).toMatchObject({
        kind: 'conflict',
        reason: undefined,
      })
    },
  )

  it('never reads the detail to tell conflicts apart', () => {
    const body = { ...problem, detail: 'Recipe list name is already taken' }

    expect(failureFromResponse(answer(409), body)).toMatchObject({ reason: undefined })
  })

  it('carries the explanation of the problem+json body', () => {
    expect(failureFromResponse(answer(400), problem)).toEqual({
      kind: 'invalid-request',
      status: 400,
      detail: 'The title must not be blank.',
    })
  })

  it.each([
    ['an empty body', undefined],
    ['a text body', 'Bad Gateway'],
    ['null', null],
    ['an object without detail', { title: 'Problem' }],
    ['a detail that is not text', { detail: 12 }],
    ['an empty detail', { detail: '' }],
  ])('has no detail for %s', (_name, body) => {
    expect(failureFromResponse(answer(409), body)).toMatchObject({
      kind: 'conflict',
      detail: undefined,
    })
  })

  it.each([
    [429, 'rate-limited'],
    [503, 'unavailable'],
  ] as const)('reads Retry-After on a %i', (status, kind) => {
    expect(failureFromResponse(answer(status, { 'Retry-After': '30' }), problem)).toMatchObject({
      kind,
      retryAfterSeconds: 30,
    })
  })

  it.each([
    ['missing', {}],
    ['an HTTP date', { 'Retry-After': 'Wed, 21 Oct 2026 07:28:00 GMT' }],
    ['not a number', { 'Retry-After': 'soon' }],
    ['negative', { 'Retry-After': '-5' }],
  ])('does not invent a delay when Retry-After is %s', (_name, headers) => {
    expect(failureFromResponse(answer(429, headers), problem)).toMatchObject({
      kind: 'rate-limited',
      retryAfterSeconds: undefined,
    })
  })
})

describe('isTransient', () => {
  it.each([
    ['network', true],
    ['unavailable', true],
    ['server-error', true],
    ['rate-limited', true],
    ['invalid-request', false],
    ['unauthorized', false],
    ['forbidden', false],
    ['not-found', false],
    ['conflict', false],
    ['payload-too-large', false],
    ['unexpected', false],
  ] as const)('%s is transient: %s', (kind, transient) => {
    const status = KIND_BY_STATUS.find(([, candidate]) => candidate === kind)?.[0] ?? 0
    const failure: ApiFailure =
      kind === 'network' ? { kind } : failureFromResponse(answer(status), undefined)

    expect(isTransient(failure)).toBe(transient)
  })
})
