import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCountdown } from './useCountdown'

/** One second at a time, each in its own act: a tick is rendered before the next one is set. */
function pass(seconds: number) {
  for (let second = 0; second < seconds; second += 1) {
    act(() => {
      vi.advanceTimersByTime(1000)
    })
  }
}

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('is idle until it is started', () => {
    const { result } = renderHook(() => useCountdown(3))

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.remaining).toBe(0)
  })

  it('goes down a second at a time from the start, then stays at 0', () => {
    const { result } = renderHook(() => useCountdown(3))

    act(() => {
      result.current.start()
    })
    expect(result.current.remaining).toBe(3)
    pass(1)
    expect(result.current.remaining).toBe(2)
    pass(5)
    expect(result.current.remaining).toBe(0)
  })

  it('starts over when it is started again', () => {
    const { result } = renderHook(() => useCountdown(3))
    act(() => {
      result.current.start()
    })
    pass(3)
    expect(result.current.remaining).toBe(0)

    act(() => {
      result.current.start()
    })

    expect(result.current.remaining).toBe(3)
  })

  it('stops counting when the component goes away', () => {
    const { result, unmount } = renderHook(() => useCountdown(3))
    act(() => {
      result.current.start()
    })

    unmount()

    expect(vi.getTimerCount()).toBe(0)
  })
})
