import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useKeyboardInset } from './useKeyboardInset'

/** The part of `VisualViewport` the hook reads: its size and position, and the events that change them. */
function installViewport({ height, offsetTop = 0 }: { height: number; offsetTop?: number }) {
  const viewport = Object.assign(new EventTarget(), { height, offsetTop })
  Object.defineProperty(window, 'visualViewport', { configurable: true, value: viewport })
  return {
    resizeTo(next: number) {
      act(() => {
        viewport.height = next
        viewport.dispatchEvent(new Event('resize'))
      })
    },
  }
}

describe('useKeyboardInset', () => {
  afterEach(() => {
    Reflect.deleteProperty(window, 'visualViewport')
  })

  it('is 0 while nothing is being typed', () => {
    installViewport({ height: window.innerHeight - 300 })

    const { result } = renderHook(() => useKeyboardInset(false))

    expect(result.current).toBe(0)
  })

  it('is what the keyboard covers of the bottom of the page, while active', () => {
    installViewport({ height: window.innerHeight - 300 })

    const { result } = renderHook(() => useKeyboardInset(true))

    expect(result.current).toBe(300)
  })

  it('follows the keyboard as it grows and shrinks', () => {
    const viewport = installViewport({ height: window.innerHeight - 300 })
    const { result } = renderHook(() => useKeyboardInset(true))

    viewport.resizeTo(window.innerHeight - 120)

    expect(result.current).toBe(120)
  })

  it('does not count what the page was scrolled by while the viewport moved', () => {
    installViewport({ height: window.innerHeight - 300, offsetTop: 100 })

    const { result } = renderHook(() => useKeyboardInset(true))

    expect(result.current).toBe(200)
  })

  it('is never negative', () => {
    installViewport({ height: window.innerHeight + 50 })

    const { result } = renderHook(() => useKeyboardInset(true))

    expect(result.current).toBe(0)
  })

  it('goes back to 0 once the typing stops', () => {
    installViewport({ height: window.innerHeight - 300 })
    const { result, rerender } = renderHook(({ active }) => useKeyboardInset(active), {
      initialProps: { active: true },
    })
    expect(result.current).toBe(300)

    rerender({ active: false })

    expect(result.current).toBe(0)
  })

  it('is 0 where the browser has no visual viewport', () => {
    const { result } = renderHook(() => useKeyboardInset(true))

    expect(result.current).toBe(0)
  })
})
