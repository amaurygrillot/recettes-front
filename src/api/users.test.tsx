import { act, renderHook } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'
import { fakeToken } from '../test/fakeToken'
import { problemResponse, rejectionOf } from '../test/problem'
import { createQueryWrapper } from '../test/queryWrapper'
import { server } from '../test/server'
import { API_BASE_URL } from './apiConfig'
import { sessionStore } from './sessionStore'
import { useCreateUser, useResetPassword, useUpdateUser } from './users'

const url = (path: string) => `${API_BASE_URL}${path}`
const account = { username: 'camille', password: 'a-long-password', email: 'camille@example.org' }
const reset = {
  email: 'camille@example.org',
  token: 'one-time-token',
  newPassword: 'a-new-password',
}

afterEach(() => {
  sessionStore.signOut()
  window.sessionStorage.clear()
})

describe('useCreateUser', () => {
  it('registers the account and answers the stored one', async () => {
    let received: unknown
    server.use(
      http.post(url('/users/create'), async ({ request }) => {
        received = await request.json()
        return HttpResponse.json({ id: '7', username: 'camille', roles: ['USER'] }, { status: 201 })
      }),
    )
    const { result } = renderHook(() => useCreateUser(), { wrapper: createQueryWrapper().wrapper })

    const created = await act(() => result.current.mutateAsync(account))

    expect(received).toEqual(account)
    expect(created).toMatchObject({ id: '7', username: 'camille' })
  })

  it.each([
    [400, 'invalid-request'],
    [409, 'conflict'],
  ])('fails on a %i with « %s »', async (status, kind) => {
    server.use(http.post(url('/users/create'), () => problemResponse(status)))
    const { result } = renderHook(() => useCreateUser(), { wrapper: createQueryWrapper().wrapper })

    const error = await act(() => rejectionOf(result.current.mutateAsync(account)))

    expect(error).toMatchObject({ failure: { kind, status, detail: 'What the back end said' } })
  })
})

describe('useUpdateUser', () => {
  it('sends the changes with the token of the member', async () => {
    sessionStore.signIn(fakeToken())
    let authorization: string | null = null
    server.use(
      http.put(url('/users/update'), ({ request }) => {
        authorization = request.headers.get('Authorization')
        return HttpResponse.json({ id: '7', firstname: 'Camille' })
      }),
    )
    const { result } = renderHook(() => useUpdateUser(), { wrapper: createQueryWrapper().wrapper })

    const updated = await act(() => result.current.mutateAsync({ firstname: 'Camille' }))

    expect(updated).toMatchObject({ firstname: 'Camille' })
    expect(authorization).toMatch(/^Bearer /)
  })

  it.each([
    [400, 'invalid-request'],
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'not-found'],
    [409, 'conflict'],
  ])('fails on a %i with « %s »', async (status, kind) => {
    server.use(http.put(url('/users/update'), () => problemResponse(status)))
    const { result } = renderHook(() => useUpdateUser(), { wrapper: createQueryWrapper().wrapper })

    const error = await act(() => rejectionOf(result.current.mutateAsync({ firstname: 'Camille' })))

    expect(error).toMatchObject({ failure: { kind, status } })
  })
})

describe('useResetPassword', () => {
  it('completes the reset', async () => {
    let received: unknown
    server.use(
      http.put(url('/users/reinit-password'), async ({ request }) => {
        received = await request.json()
        return new HttpResponse(null, { status: 200 })
      }),
    )
    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createQueryWrapper().wrapper,
    })

    await act(() => result.current.mutateAsync(reset))

    expect(received).toEqual(reset)
  })

  it('fails with « invalid-request » however the token was wrong', async () => {
    server.use(http.put(url('/users/reinit-password'), () => problemResponse(400)))
    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createQueryWrapper().wrapper,
    })

    const error = await act(() => rejectionOf(result.current.mutateAsync(reset)))

    expect(error).toMatchObject({ failure: { kind: 'invalid-request', status: 400 } })
  })

  it('gets through with a stale token still in the tab', async () => {
    sessionStore.signIn(fakeToken())
    let authorization: string | null = 'unset'
    server.use(
      http.put(url('/users/reinit-password'), ({ request }) => {
        authorization = request.headers.get('Authorization')
        return new HttpResponse(null, { status: 200 })
      }),
    )
    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createQueryWrapper().wrapper,
    })

    await act(() => result.current.mutateAsync(reset))

    expect(authorization).toBeNull()
  })
})
