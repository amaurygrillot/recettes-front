import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { sessionStore } from '../api/sessionStore'
import { server } from './server'

// jsdom has no layout, so it has no scrolling into view, and nothing to resize or observe: the
// popovers of Radix measure what they anchor to, and only need these not to be missing.
if (typeof window !== 'undefined' && typeof window.ResizeObserver === 'undefined') {
  window.ResizeObserver = class {
    observe = () => undefined
    unobserve = () => undefined
    disconnect = () => undefined
  }
}

// jsdom has no layout, so it has no scrolling into view either.
if (typeof Element !== 'undefined') Element.prototype.scrollIntoView = () => undefined

// ...nor the boxes of a text selection, which the rich text editor measures to keep its caret in view.
if (typeof Range !== 'undefined') {
  const nowhere = new DOMRect(0, 0, 0, 0)
  Range.prototype.getBoundingClientRect = () => nowhere
  Range.prototype.getClientRects = () => {
    const noRectangle: DOMRect[] = []
    return Object.assign(noRectangle, { item: () => null })
  }
}

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
