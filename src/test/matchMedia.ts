import { act } from '@testing-library/react'
import { vi } from 'vitest'

export interface FakeScreen {
  /** Changes the width and tells whoever listens to a media query. */
  resizeTo: (width: number) => void
  listenerCount: () => number
}

/**
 * A `matchMedia` for a screen of this width, which answers `(min-width: Npx)` queries and tells
 * its listeners when the width changes. jsdom has none; remove it with `removeMatchMedia`.
 */
export function installMatchMedia(initialWidth: number): FakeScreen {
  let width = initialWidth
  const listeners = new Set<() => void>()
  const matchMedia = vi.fn((query: string) => ({
    get matches() {
      const minimum = Number(/min-width:\s*(\d+)px/.exec(query)?.[1] ?? 0)
      return width >= minimum
    },
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
  }))
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: matchMedia,
  })
  return {
    resizeTo(next) {
      width = next
      act(() => {
        listeners.forEach((listener) => {
          listener()
        })
      })
    },
    listenerCount: () => listeners.size,
  }
}

export function removeMatchMedia(): void {
  Reflect.deleteProperty(window, 'matchMedia')
}
