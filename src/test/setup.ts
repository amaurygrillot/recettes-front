import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { sessionStore } from '../api/sessionStore'
import { server } from './server'

// jsdom has no layout, so it has no scrolling into view either.
if (typeof Element !== 'undefined') Element.prototype.scrollIntoView = () => undefined

beforeAll(() => {
  // MSW 3 calls it a « frame »: an unanswered request fails loudly instead of reaching the network.
  server.listen({ onUnhandledFrame: 'error' })
})

// Vitest runs without globals, so Testing Library cannot register its own cleanup.
afterEach(() => {
  cleanup()
  server.resetHandlers()
  // The session is a module singleton backed by the tab's storage: no test may leak a member.
  sessionStore.signOut()
  if (typeof window !== 'undefined') window.sessionStorage.clear()
})

afterAll(() => {
  server.close()
})
