import { useSyncExternalStore } from 'react'
import { sessionStore, type Session } from './sessionStore'

/** Who is using the app, re-rendering the component when that changes. */
export function useSession(): Session {
  return useSyncExternalStore(sessionStore.subscribe, sessionStore.getSnapshot)
}

/** The same, outside React (a route loader). */
export function getSession(): Session {
  return sessionStore.getSnapshot()
}

/** Ends the session on this device. The back end keeps no session: forgetting the token is all there is. */
export function signOut(): void {
  sessionStore.signOut()
}
