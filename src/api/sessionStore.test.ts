import { describe, expect, it, vi } from 'vitest'
import { fakeToken } from '../test/fakeToken'
import { createSessionStore } from './sessionStore'

const KEY = 'recettes.token'

/** A Storage that remembers what it is given; `broken` makes every access throw, like a blocked browser. */
function fakeStorage(initial: Record<string, string> = {}, broken = false) {
  const items = new Map(Object.entries(initial))
  const guard = () => {
    if (broken) throw new DOMException('Storage is disabled', 'SecurityError')
  }
  return {
    items,
    getItem: (key: string) => {
      guard()
      return items.get(key) ?? null
    },
    setItem: (key: string, value: string) => {
      guard()
      items.set(key, value)
    },
    removeItem: (key: string) => {
      guard()
      items.delete(key)
    },
  }
}

describe('a new session store', () => {
  it('starts as a visitor', () => {
    const store = createSessionStore(fakeStorage())

    expect(store.getSnapshot()).toEqual({ status: 'visitor' })
    expect(store.getToken()).toBeNull()
  })

  it('resumes the member whose token a previous page load left in the tab', () => {
    const token = fakeToken({ username: 'camille', userId: '42', roles: ['USER'] })
    const store = createSessionStore(fakeStorage({ [KEY]: token }))

    expect(store.getSnapshot()).toEqual({
      status: 'member',
      username: 'camille',
      userId: '42',
      roles: ['USER'],
    })
    expect(store.getToken()).toBe(token)
  })

  it.each([
    ['expired', fakeToken({ expiresInSeconds: -1 })],
    ['not a token', 'garbage'],
  ])('forgets a stored token that is %s', (_name, stored) => {
    const storage = fakeStorage({ [KEY]: stored })
    const store = createSessionStore(storage)

    expect(store.getSnapshot()).toEqual({ status: 'visitor' })
    expect(storage.items.has(KEY)).toBe(false)
  })

  it('works as a memory-only session when the browser blocks storage', () => {
    const store = createSessionStore(fakeStorage({}, true))

    expect(store.signIn(fakeToken())).toBe(true)
    expect(store.getSnapshot().status).toBe('member')
  })
})

describe('signing in', () => {
  it('starts the session and keeps the token for the tab', () => {
    const storage = fakeStorage()
    const store = createSessionStore(storage)
    const token = fakeToken({ username: 'camille', roles: ['USER', 'ADMIN'] })

    expect(store.signIn(token)).toBe(true)

    expect(store.getSnapshot()).toMatchObject({
      status: 'member',
      username: 'camille',
      roles: ['USER', 'ADMIN'],
    })
    expect(store.getToken()).toBe(token)
    expect(storage.items.get(KEY)).toBe(token)
  })

  it.each([
    ['unreadable', 'garbage'],
    ['already expired', fakeToken({ expiresInSeconds: -1 })],
  ])('refuses a token that is %s and changes nothing', (_name, token) => {
    const store = createSessionStore(fakeStorage())
    const listener = vi.fn()
    store.subscribe(listener)

    expect(store.signIn(token)).toBe(false)

    expect(store.getSnapshot()).toEqual({ status: 'visitor' })
    expect(listener).not.toHaveBeenCalled()
  })

  it('replaces an expired session', () => {
    const store = createSessionStore(fakeStorage())
    store.signIn(fakeToken({ username: 'camille' }))
    store.expire(store.getToken() ?? '')

    store.signIn(fakeToken({ username: 'camille' }))

    expect(store.getSnapshot().status).toBe('member')
  })
})

describe('signing out', () => {
  it('forgets the token everywhere', () => {
    const storage = fakeStorage()
    const store = createSessionStore(storage)
    store.signIn(fakeToken())

    store.signOut()

    expect(store.getSnapshot()).toEqual({ status: 'visitor' })
    expect(store.getToken()).toBeNull()
    expect(storage.items.has(KEY)).toBe(false)
  })

  it('does nothing, and tells nobody, for a visitor', () => {
    const store = createSessionStore(fakeStorage())
    const listener = vi.fn()
    store.subscribe(listener)

    store.signOut()

    expect(listener).not.toHaveBeenCalled()
  })

  it('turns an expired session into a visitor', () => {
    const store = createSessionStore(fakeStorage())
    store.signIn(fakeToken())
    store.expire(store.getToken() ?? '')

    store.signOut()

    expect(store.getSnapshot()).toEqual({ status: 'visitor' })
  })
})

describe('expiring', () => {
  it('drops the token and marks the session as expired', () => {
    const storage = fakeStorage()
    const store = createSessionStore(storage)
    store.signIn(fakeToken())

    store.expire(store.getToken() ?? '')

    expect(store.getSnapshot()).toEqual({ status: 'expired' })
    expect(store.getToken()).toBeNull()
    expect(storage.items.has(KEY)).toBe(false)
  })

  it('tells the subscribers once, however many requests were refused', () => {
    const store = createSessionStore(fakeStorage())
    store.signIn(fakeToken())
    const listener = vi.fn()
    store.subscribe(listener)

    store.expire(store.getToken() ?? '')
    store.expire(store.getToken() ?? '')
    store.expire(store.getToken() ?? '')

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('ignores a refusal of an old token: the newer session stays', () => {
    const store = createSessionStore(fakeStorage())
    const oldToken = fakeToken({ username: 'camille', expiresInSeconds: 100 })
    store.signIn(oldToken)
    store.signIn(fakeToken({ username: 'camille', expiresInSeconds: 3600 }))

    store.expire(oldToken)

    expect(store.getSnapshot().status).toBe('member')
  })

  it('has no effect on a visitor: there was no session to lose', () => {
    const store = createSessionStore(fakeStorage())

    store.expire(store.getToken() ?? '')

    expect(store.getSnapshot()).toEqual({ status: 'visitor' })
  })
})

describe('subscribing', () => {
  it('notifies on each change until the subscription is cancelled', () => {
    const store = createSessionStore(fakeStorage())
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)

    store.signIn(fakeToken())
    store.signOut()
    unsubscribe()
    store.signIn(fakeToken())

    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('hands React the same snapshot until something changes', () => {
    const store = createSessionStore(fakeStorage())
    store.signIn(fakeToken())

    expect(store.getSnapshot()).toBe(store.getSnapshot())
  })
})
