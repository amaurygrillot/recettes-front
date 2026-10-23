import { act, renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { fakeToken } from '../test/fakeToken'
import { problemResponse, rejectionOf } from '../test/problem'
import { createQueryWrapper } from '../test/queryWrapper'
import { server } from '../test/server'
import { API_BASE_URL } from './apiConfig'
import { sessionStore } from './sessionStore'
import { useCreateUser, useKnownAccount, useResetPassword, useUpdateUser } from './users'

const url = (path: string) => `${API_BASE_URL}${path}`
const account = { username: 'camille', password: 'a-long-password', email: 'camille@example.org' }
const reset = {
  email: 'camille@example.org',
  token: 'one-time-token',
  newPassword: 'a-new-password',
}

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

describe('what an update teaches about the account', () => {
  it('is known only after a change, and by the id of the member', async () => {
    sessionStore.signIn(fakeToken({ userId: '7', username: 'camille' }))
    server.use(
      http.put(url('/users/update'), () =>
        HttpResponse.json({ id: '7', username: 'camille', email: 'new@example.org' }),
      ),
    )
    const { wrapper } = createQueryWrapper()
    const { result } = renderHook(
      () => ({ update: useUpdateUser(), known: useKnownAccount('7'), other: useKnownAccount('8') }),
      { wrapper },
    )
    expect(result.current.known).toBeUndefined()

    await act(() => result.current.update.mutateAsync({ firstname: 'Camille' }))

    await waitFor(() => {
      expect(result.current.known).toMatchObject({ email: 'new@example.org' })
    })
    expect(result.current.other).toBeUndefined()
  })

  it('shows the new username from now on, when the member renamed themselves', async () => {
    sessionStore.signIn(fakeToken({ userId: '7', username: 'camille' }))
    server.use(
      http.put(url('/users/update'), () => HttpResponse.json({ id: '7', username: 'camille2' })),
    )
    const { result } = renderHook(() => useUpdateUser(), { wrapper: createQueryWrapper().wrapper })

    await act(() => result.current.mutateAsync({ username: 'camille2' }))

    expect(sessionStore.getSnapshot()).toMatchObject({ username: 'camille2' })
  })

  it('leaves the session alone for an answer about somebody else', async () => {
    sessionStore.signIn(fakeToken({ userId: '7', username: 'camille' }))
    server.use(
      http.put(url('/users/update'), () => HttpResponse.json({ id: '99', username: 'someone' })),
    )
    const { result } = renderHook(() => useUpdateUser(), { wrapper: createQueryWrapper().wrapper })

    await act(() => result.current.mutateAsync({ firstname: 'x' }))

    expect(sessionStore.getSnapshot()).toMatchObject({ username: 'camille' })
  })

  it('is known after the registration too, so a new member finds their data', async () => {
    server.use(
      http.post(url('/users/create'), () =>
        HttpResponse.json(
          { id: '9', username: 'odile', email: 'odile@example.org' },
          { status: 201 },
        ),
      ),
    )
    const { wrapper } = createQueryWrapper()
    const { result } = renderHook(
      () => ({ create: useCreateUser(), known: useKnownAccount('9') }),
      { wrapper },
    )

    await act(() => result.current.create.mutateAsync(account))

    await waitFor(() => {
      expect(result.current.known).toMatchObject({ email: 'odile@example.org' })
    })
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
