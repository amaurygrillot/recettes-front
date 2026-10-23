import { act } from '@testing-library/react'
import { vi } from 'vitest'

export interface FakeIntersection {
  /** Tells every observer where its element is now. `bottom` is the element's bottom edge in the screen. */
  report: (position: { visible: boolean; bottom: number }) => void
  observedCount: () => number
}

// The two fields of an entry that the app reads; the real one has more, a fake does not need them.
interface FakeEntry {
  target: Element
  isIntersecting: boolean
  boundingClientRect: { bottom: number }
}

interface Registration {
  callback: (entries: readonly FakeEntry[]) => void
  elements: Set<Element>
}

/**
 * An `IntersectionObserver` that tests drive by hand, since jsdom has no layout to observe.
 * Remove it with `vi.unstubAllGlobals()`.
 */
export function installIntersectionObserver(): FakeIntersection {
  const registrations = new Set<Registration>()

  class FakeObserver {
    private readonly registration: Registration

    constructor(callback: Registration['callback']) {
      this.registration = { callback, elements: new Set() }
      registrations.add(this.registration)
    }

    observe(element: Element) {
      this.registration.elements.add(element)
    }

    unobserve(element: Element) {
      this.registration.elements.delete(element)
    }

    disconnect() {
      registrations.delete(this.registration)
    }
  }
  vi.stubGlobal('IntersectionObserver', FakeObserver)

  return {
    report({ visible, bottom }) {
      act(() => {
        registrations.forEach(({ callback, elements }) => {
          callback(
            [...elements].map((target) => ({
              target,
              isIntersecting: visible,
              boundingClientRect: { bottom },
            })),
          )
        })
      })
    },
    observedCount: () => registrations.size,
  }
}
