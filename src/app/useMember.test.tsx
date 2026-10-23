import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { sessionStore } from '../api/sessionStore'
import { fakeToken } from '../test/fakeToken'
import { useMember } from './useMember'

describe('useMember', () => {
  it('is nobody for a visitor', () => {
    const { result } = renderHook(() => useMember())

    expect(result.current).toBeUndefined()
  })

  it('is the signed-in member, and follows a rename', () => {
    sessionStore.signIn(fakeToken({ username: 'odile74', userId: 'u-1' }))
    const { result } = renderHook(() => useMember())
    expect(result.current).toMatchObject({ username: 'odile74', userId: 'u-1' })

    act(() => {
      sessionStore.rename('odile75')
    })

    expect(result.current).toMatchObject({ username: 'odile75' })
  })

  it('keeps the member while the session is expired: the page stays behind the dialog', () => {
    const token = fakeToken({ username: 'odile74' })
    sessionStore.signIn(token)
    const { result } = renderHook(() => useMember())

    act(() => {
      sessionStore.expire(token)
    })

    expect(result.current).toMatchObject({ username: 'odile74' })
  })

  it('forgets the member once they sign out', () => {
    sessionStore.signIn(fakeToken())
    const { result } = renderHook(() => useMember())

    act(() => {
      sessionStore.signOut()
    })

    expect(result.current).toBeUndefined()
  })
})
