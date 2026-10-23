import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { fakeToken } from '../test/fakeToken'
import { server } from '../test/server'
import { API_BASE_URL } from './apiConfig'
import { createApiClient } from './client'
import { createSessionStore } from './sessionStore'

const url = (path: string) => `${API_BASE_URL}${path}`
const credentials = { username: 'camille', password: 'a-long-password' }

function signedInClient() {
  const session = createSessionStore(window.sessionStorage)
  session.signIn(fakeToken())
  return { session, api: createApiClient({ baseUrl: API_BASE_URL, session }) }
}

function visitorClient() {
  const session = createSessionStore(window.sessionStorage)
  return { session, api: createApiClient({ baseUrl: API_BASE_URL, session }) }
}

/** Records the Authorization header of every request that reaches `path`, and answers `respond`. */
function spyOn(method: 'get' | 'post' | 'put', path: string, respond: () => Response) {
  const authorizations: (string | null)[] = []
  server.use(
    http[method](url(path), ({ request }) => {
      authorizations.push(request.headers.get('Authorization'))
      return respond()
    }),
  )
  return authorizations
}

const unauthorized = () =>
  HttpResponse.json({ status: 401, detail: 'Unauthorized' }, { status: 401 })

beforeEach(() => {
  window.sessionStorage.clear()
})

describe('the token', () => {
  it('is attached to a request once the member is signed in', async () => {
    const { session, api } = signedInClient()
    const authorizations = spyOn('get', '/recipes', () => HttpResponse.json({ content: [] }))

    await api.GET('/recipes', {})

    expect(authorizations).toEqual([`Bearer ${session.getToken()}`])
  })

  it('is not sent by a visitor', async () => {
    const { api } = visitorClient()
    const authorizations = spyOn('get', '/recipes', () => HttpResponse.json({ content: [] }))

    await api.GET('/recipes', {})

    expect(authorizations).toEqual([null])
  })

  it('is kept away from the routes that obtain a credential, so a stale one cannot block them', async () => {
    const { api } = signedInClient()
    const login = spyOn('post', '/auth/login', () => HttpResponse.text('token'))
    const reset = spyOn(
      'post',
      '/auth/reinit-password',
      () => new HttpResponse(null, { status: 202 }),
    )
    const register = spyOn('post', '/users/create', () => HttpResponse.json({}, { status: 201 }))
    const newPassword = spyOn('put', '/users/reinit-password', () => new HttpResponse(null))

    await api.POST('/auth/login', { body: credentials, parseAs: 'text' })
    await api.POST('/auth/reinit-password', { body: { email: 'camille@example.org' } })
    await api.POST('/users/create', { body: { ...credentials, email: 'camille@example.org' } })
    await api.PUT('/users/reinit-password', {
      body: { email: 'camille@example.org', token: 'one-time', newPassword: 'a-new-password' },
    })

    expect([...login, ...reset, ...register, ...newPassword]).toEqual([null, null, null, null])
  })

  it('does travel on the other account route', async () => {
    const { api } = signedInClient()
    const authorizations = spyOn('put', '/users/update', () => HttpResponse.json({}))

    await api.PUT('/users/update', { body: { firstname: 'Camille' } })

    expect(authorizations[0]).toMatch(/^Bearer /)
  })
})

describe('a refused token (401)', () => {
  it('ends the session of the member', async () => {
    const { session, api } = signedInClient()
    spyOn('post', '/recipes', unauthorized)

    const { response } = await api.POST('/recipes', {
      body: { title: 'Tarte', categoryIds: [], ingredientGroups: [], steps: [] },
    })

    expect(response.status).toBe(401)
    expect(session.getSnapshot()).toEqual({ status: 'expired' })
    expect(session.getToken()).toBeNull()
  })

  it('does not replay a write: the answer is the 401 itself', async () => {
    const { api } = signedInClient()
    const authorizations = spyOn('post', '/recipes', unauthorized)

    await api.POST('/recipes', {
      body: { title: 'Tarte', categoryIds: [], ingredientGroups: [], steps: [] },
    })

    expect(authorizations).toHaveLength(1)
  })

  it('still lets a public read through, replayed without the token', async () => {
    const { session, api } = signedInClient()
    let calls = 0
    const authorizations: (string | null)[] = []
    server.use(
      http.get(url('/recipes'), ({ request }) => {
        authorizations.push(request.headers.get('Authorization'))
        calls += 1
        return request.headers.has('Authorization')
          ? unauthorized()
          : HttpResponse.json({ content: [{ id: '1', title: 'Gratin' }] })
      }),
    )

    const { data } = await api.GET('/recipes', {})

    expect(data?.content?.[0]?.title).toBe('Gratin')
    expect(calls).toBe(2)
    expect(authorizations[1]).toBeNull()
    expect(session.getSnapshot()).toEqual({ status: 'expired' })
  })

  it('replays a read once, not forever, when the route really needs a token', async () => {
    const { api } = signedInClient()
    const authorizations = spyOn('get', '/recipes', unauthorized)

    const { response } = await api.GET('/recipes', {})

    expect(response.status).toBe(401)
    expect(authorizations).toHaveLength(2)
  })

  it('is not an expired session for a visitor: there was no token to refuse', async () => {
    const { session, api } = visitorClient()
    spyOn('post', '/recipes', unauthorized)

    await api.POST('/recipes', {
      body: { title: 'Tarte', categoryIds: [], ingredientGroups: [], steps: [] },
    })

    expect(session.getSnapshot()).toEqual({ status: 'visitor' })
  })

  it('is not an expired session when the login itself is refused', async () => {
    const { session, api } = signedInClient()
    spyOn('post', '/auth/login', unauthorized)

    await api.POST('/auth/login', { body: credentials, parseAs: 'text' })

    expect(session.getSnapshot().status).toBe('member')
  })

  it.each([400, 403, 404, 409, 413, 429, 500, 503])('is not what a %i means', async (status) => {
    const { session, api } = signedInClient()
    spyOn('post', '/recipes', () => HttpResponse.json({ status }, { status }))

    await api.POST('/recipes', {
      body: { title: 'Tarte', categoryIds: [], ingredientGroups: [], steps: [] },
    })

    expect(session.getSnapshot().status).toBe('member')
  })
})
