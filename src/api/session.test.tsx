import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { fakeToken } from '../test/fakeToken'
import { getSession, signOut, useSession } from './session'
import { sessionStore } from './sessionStore'

afterEach(() => {
  sessionStore.signOut()
  window.sessionStorage.clear()
})

describe('useSession', () => {
  it('follows the session as it changes', () => {
    const { result } = renderHook(() => useSession())
    expect(result.current).toEqual({ status: 'visitor' })

    act(() => {
      sessionStore.signIn(fakeToken({ username: 'camille' }))
    })
    expect(result.current).toMatchObject({ status: 'member', username: 'camille' })

    act(() => {
      sessionStore.expire(sessionStore.getToken() ?? '')
    })
    expect(result.current).toEqual({ status: 'expired' })
  })
})

describe('getSession and signOut', () => {
  it('read and end the session outside React', () => {
    sessionStore.signIn(fakeToken())
    expect(getSession().status).toBe('member')

    signOut()

    expect(getSession()).toEqual({ status: 'visitor' })
  })
})
