import { logger } from '../lib/logger'
import { readTokenClaims, type Role } from './tokenClaims'

/**
 * Who is using the app. `expired` is a member whose token the back refused (401): the session is
 * over, but the screen they were on is kept until they have been told, so no work is lost.
 */
export type Session =
  | { readonly status: 'visitor' }
  | {
      readonly status: 'member'
      readonly username: string
      readonly userId: string
      readonly roles: readonly Role[]
    }
  | { readonly status: 'expired' }

export type Member = Extract<Session, { status: 'member' }>

type TokenStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export interface SessionStore {
  getSnapshot: () => Session
  subscribe: (listener: () => void) => () => void
  /** The only reader of the token: the API client attaches it to requests, nothing else sees it. */
  getToken: () => string | null
  /** Starts a session; false (and nothing changes) when the token is not one the app can read. */
  signIn: (token: string) => boolean
  signOut: () => void
  /**
   * The back end refused `refusedToken`: drops it and tells the app, once. No effect unless that
   * token is still the member's, so a late answer to an old request cannot end a newer session.
   */
  expire: (refusedToken: string) => void
}

const VISITOR: Session = { status: 'visitor' }
const EXPIRED: Session = { status: 'expired' }
const STORAGE_KEY = 'recettes.token'

/** Storage can throw (disabled by the browser, private mode): the session then lives in memory only. */
function safely<T>(action: () => T, fallback: T): T {
  try {
    return action()
  } catch {
    return fallback
  }
}

/**
 * The authenticated session, kept in `sessionStorage` (it dies with the tab; decision in
 * docs/frontend-stack.md) and mirrored in memory so React can subscribe to it.
 */
export function createSessionStore(
  storage: TokenStorage,
  now: () => number = Date.now,
): SessionStore {
  let token: string | null = null
  let session: Session = VISITOR
  const listeners = new Set<() => void>()

  function persist(value: string | null): void {
    safely(() => {
      if (value === null) storage.removeItem(STORAGE_KEY)
      else storage.setItem(STORAGE_KEY, value)
    }, undefined)
  }

  function commit(nextToken: string | null, nextSession: Session): void {
    token = nextToken
    session = nextSession
    persist(nextToken)
    listeners.forEach((listener) => {
      listener()
    })
  }

  // `mustBeLive`: a resumed token is checked against the clock; a fresh one was just vouched for by
  // the server, and a skewed device clock must not be able to refuse it.
  function memberFrom(candidate: string, mustBeLive: boolean): Member | null {
    const claims = readTokenClaims(candidate)
    if (claims === null || (mustBeLive && claims.expiresAt <= now())) return null
    const { username, userId, roles } = claims
    return { status: 'member', username, userId, roles }
  }

  // A token left by a previous page load is resumed only while it can still be used.
  const stored = safely(() => storage.getItem(STORAGE_KEY), null)
  if (stored !== null) {
    const resumed = memberFrom(stored, true)
    if (resumed === null) {
      persist(null)
    } else {
      token = stored
      session = resumed
    }
  }

  return {
    getSnapshot: () => session,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    getToken: () => token,
    signIn: (candidate) => {
      const member = memberFrom(candidate, false)
      if (member === null) {
        logger.warn('Sign-in refused: the token is not one the app can read')
        return false
      }
      commit(candidate, member)
      logger.info('Signed in', { roles: member.roles })
      return true
    },
    signOut: () => {
      if (token === null && session.status === 'visitor') return
      commit(null, VISITOR)
      logger.info('Signed out')
    },
    expire: (refusedToken) => {
      if (session.status !== 'member' || token !== refusedToken) return
      commit(null, EXPIRED)
      logger.warn('Session expired: the back end refused the token')
    },
  }
}

const NO_STORAGE: TokenStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
}

/** The tab's session. One per page, like the `sessionStorage` it is kept in. */
export const sessionStore = createSessionStore(safely(() => window.sessionStorage, NO_STORAGE))
