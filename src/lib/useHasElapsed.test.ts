import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useHasElapsed } from './useHasElapsed'

describe('useHasElapsed', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('is false until the delay has passed, then true', () => {
    const { result } = renderHook(() => useHasElapsed(300))

    expect(result.current).toBe(false)
    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(result.current).toBe(false)
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe(true)
  })

  it('is true at once for a delay of 0, without scheduling anything', () => {
    const { result } = renderHook(() => useHasElapsed(0))

    expect(result.current).toBe(true)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not update after it was unmounted', () => {
    const { unmount } = renderHook(() => useHasElapsed(300))

    unmount()

    expect(vi.getTimerCount()).toBe(0)
  })
})
