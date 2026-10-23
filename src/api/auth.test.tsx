import { act, renderHook } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { fakeToken } from '../test/fakeToken'
import { problemResponse, rejectionOf } from '../test/problem'
import { createQueryWrapper } from '../test/queryWrapper'
import { server } from '../test/server'
import { API_BASE_URL } from './apiConfig'
import { useLogin, useRequestPasswordReset } from './auth'
import { sessionStore } from './sessionStore'

const credentials = { username: 'camille', password: 'a-long-password' }

describe('useLogin', () => {
  it('starts the session from the token the back end answers as plain text', async () => {
    const token = fakeToken({ username: 'camille', userId: '42', roles: ['USER', 'ADMIN'] })
    server.use(
      http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
        expect(await request.json()).toEqual(credentials)
        return HttpResponse.text(`${token}\n`)
      }),
    )
    const { result } = renderHook(() => useLogin(), { wrapper: createQueryWrapper().wrapper })

    await act(() => result.current.mutateAsync(credentials))

    expect(sessionStore.getSnapshot()).toEqual({
      status: 'member',
      username: 'camille',
      userId: '42',
      roles: ['USER', 'ADMIN'],
    })
    expect(window.sessionStorage.getItem('recettes.token')).toBe(token)
  })

  it.each([
    [400, 'invalid-request'],
    [401, 'unauthorized'],
  ])('fails on a %i with « %s »', async (status, kind) => {
    server.use(http.post(`${API_BASE_URL}/auth/login`, () => problemResponse(status)))
    const { result } = renderHook(() => useLogin(), { wrapper: createQueryWrapper().wrapper })

    const error = await act(() => rejectionOf(result.current.mutateAsync(credentials)))

    expect(error).toMatchObject({ failure: { kind, status } })
    expect(sessionStore.getSnapshot()).toEqual({ status: 'visitor' })
  })

  it('fails with « network » when the back end cannot be reached', async () => {
    server.use(http.post(`${API_BASE_URL}/auth/login`, () => HttpResponse.error()))
    const { result } = renderHook(() => useLogin(), { wrapper: createQueryWrapper().wrapper })

    const error = await act(() => rejectionOf(result.current.mutateAsync(credentials)))

    expect(error).toMatchObject({ failure: { kind: 'network' } })
  })

  it('does not start a session from a token it cannot read', async () => {
    server.use(http.post(`${API_BASE_URL}/auth/login`, () => HttpResponse.text('not-a-token')))
    const { result } = renderHook(() => useLogin(), { wrapper: createQueryWrapper().wrapper })

    const error = await act(() => rejectionOf(result.current.mutateAsync(credentials)))

    expect(error).toMatchObject({ failure: { kind: 'unexpected' } })
    expect(sessionStore.getSnapshot()).toEqual({ status: 'visitor' })
  })

  it('logs in again over a session that expired', async () => {
    sessionStore.signIn(fakeToken())
    sessionStore.expire(sessionStore.getToken() ?? '')
    server.use(http.post(`${API_BASE_URL}/auth/login`, () => HttpResponse.text(fakeToken())))
    const { result } = renderHook(() => useLogin(), { wrapper: createQueryWrapper().wrapper })

    await act(() => result.current.mutateAsync(credentials))

    expect(sessionStore.getSnapshot().status).toBe('member')
  })
})

describe('useRequestPasswordReset', () => {
  it('sends the address and succeeds with the answer that does not tell whether it is known', async () => {
    let received: unknown
    server.use(
      http.post(`${API_BASE_URL}/auth/reinit-password`, async ({ request }) => {
        received = await request.json()
        return new HttpResponse(null, { status: 202 })
      }),
    )
    const { result } = renderHook(() => useRequestPasswordReset(), {
      wrapper: createQueryWrapper().wrapper,
    })

    await act(() => result.current.mutateAsync('camille@example.org'))

    expect(received).toEqual({ email: 'camille@example.org' })
  })

  it('fails with « invalid-request » on a 400', async () => {
    server.use(http.post(`${API_BASE_URL}/auth/reinit-password`, () => problemResponse(400)))
    const { result } = renderHook(() => useRequestPasswordReset(), {
      wrapper: createQueryWrapper().wrapper,
    })

    const error = await act(() => rejectionOf(result.current.mutateAsync('nope')))

    expect(error).toMatchObject({ failure: { kind: 'invalid-request', status: 400 } })
  })
})
