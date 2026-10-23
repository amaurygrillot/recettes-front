import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '../test/server'
import { API_BASE_URL } from './apiConfig'
import { createApiClient } from './client'
import { ApiRequestError, type ApiFailure } from './failure'
import { createSessionStore } from './sessionStore'
import { unwrap, unwrapEmpty } from './unwrap'

const api = createApiClient({
  baseUrl: API_BASE_URL,
  session: createSessionStore(window.sessionStorage),
})
const recipeUrl = `${API_BASE_URL}/recipes/42`

function readRecipe() {
  return unwrap(api.GET('/recipes/{id}', { params: { path: { id: '42' } } }))
}

function problem(status: number, detail: string, headers: Record<string, string> = {}) {
  return HttpResponse.json(
    { status, title: 'Problem', detail },
    {
      status,
      headers: { 'Content-Type': 'application/problem+json', ...headers },
    },
  )
}

/** What a rejected promise rejected with. */
async function failureOf(call: Promise<unknown>): Promise<ApiFailure> {
  try {
    await call
  } catch (error) {
    if (error instanceof ApiRequestError) return error.failure
    throw error
  }
  throw new Error('The call was expected to fail')
}

describe('unwrap', () => {
  it('hands back the body of a successful call', async () => {
    server.use(http.get(recipeUrl, () => HttpResponse.json({ id: '42', title: 'Gratin' })))

    await expect(readRecipe()).resolves.toEqual({ id: '42', title: 'Gratin' })
  })

  it.each([
    [400, 'invalid-request'],
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'not-found'],
    [409, 'conflict'],
    [413, 'payload-too-large'],
    [500, 'server-error'],
  ] as const)(
    'turns a %i problem+json into « %s », keeping its explanation',
    async (status, kind) => {
      server.use(http.get(recipeUrl, () => problem(status, 'What the back end said')))

      expect(await failureOf(readRecipe())).toEqual({
        kind,
        status,
        detail: 'What the back end said',
      })
    },
  )

  it.each([
    [429, 'rate-limited'],
    [503, 'unavailable'],
  ] as const)('reads Retry-After from a %i', async (status, kind) => {
    server.use(http.get(recipeUrl, () => problem(status, 'Slow down', { 'Retry-After': '30' })))

    expect(await failureOf(readRecipe())).toMatchObject({ kind, retryAfterSeconds: 30 })
  })

  it('survives an error page that is not JSON', async () => {
    server.use(
      http.get(recipeUrl, () => HttpResponse.text('<h1>Bad Gateway</h1>', { status: 502 })),
    )

    expect(await failureOf(readRecipe())).toEqual({
      kind: 'server-error',
      status: 502,
      detail: undefined,
    })
  })

  it('survives an error with no body at all', async () => {
    server.use(http.get(recipeUrl, () => new HttpResponse(null, { status: 401 })))

    expect(await failureOf(readRecipe())).toMatchObject({ kind: 'unauthorized', detail: undefined })
  })

  it('reports a server that does not answer as « network »', async () => {
    server.use(http.get(recipeUrl, () => HttpResponse.error()))

    expect(await failureOf(readRecipe())).toEqual({ kind: 'network' })
  })

  it('refuses a success that carries no body where one was due', async () => {
    server.use(http.get(recipeUrl, () => new HttpResponse(null, { status: 200 })))

    expect(await failureOf(readRecipe())).toMatchObject({ kind: 'unexpected', status: 200 })
  })

  it('does not mistake a success whose body is not JSON for a silent server', async () => {
    server.use(
      http.get(recipeUrl, () =>
        HttpResponse.text('<html>', { headers: { 'Content-Type': 'application/json' } }),
      ),
    )

    expect(await failureOf(readRecipe())).toMatchObject({ kind: 'unexpected' })
  })

  it('refuses a status the contract does not describe', async () => {
    server.use(http.get(recipeUrl, () => problem(415, 'Unsupported Media Type')))

    expect(await failureOf(readRecipe())).toMatchObject({ kind: 'unexpected', status: 415 })
  })
})

describe('unwrapEmpty', () => {
  it.each([200, 202, 204])('accepts a %i with no body', async (status) => {
    server.use(http.delete(recipeUrl, () => new HttpResponse(null, { status })))

    await expect(
      unwrapEmpty(api.DELETE('/recipes/{id}', { params: { path: { id: '42' } } })),
    ).resolves.toBeUndefined()
  })

  it('still reports a failure', async () => {
    server.use(http.delete(recipeUrl, () => problem(403, 'Not your recipe')))

    expect(
      await failureOf(unwrapEmpty(api.DELETE('/recipes/{id}', { params: { path: { id: '42' } } }))),
    ).toMatchObject({ kind: 'forbidden' })
  })
})
