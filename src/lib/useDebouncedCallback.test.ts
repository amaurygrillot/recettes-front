import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedCallback } from './useDebouncedCallback'

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('runs the callback once, with the last arguments, after the calls have stopped', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 300))

    act(() => {
      result.current.schedule('t')
      vi.advanceTimersByTime(200)
      result.current.schedule('ta')
      vi.advanceTimersByTime(200)
    })
    expect(callback).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith('ta')
  })

  it('calls what the latest render passed, not what the one that scheduled it did', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { result, rerender } = renderHook(({ callback }) => useDebouncedCallback(callback, 300), {
      initialProps: { callback: first },
    })

    act(() => {
      result.current.schedule()
    })
    rerender({ callback: second })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledOnce()
  })

  it('runs at once with a delay of 0', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 0))

    act(() => {
      result.current.schedule('now')
    })

    expect(callback).toHaveBeenCalledWith('now')
  })

  it('drops a pending call when cancelled', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 300))

    act(() => {
      result.current.schedule()
      result.current.cancel()
      vi.advanceTimersByTime(1000)
    })

    expect(callback).not.toHaveBeenCalled()
  })

  it('drops a pending call when the component goes away', () => {
    const callback = vi.fn()
    const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 300))
    act(() => {
      result.current.schedule()
    })

    unmount()
    vi.advanceTimersByTime(1000)

    expect(callback).not.toHaveBeenCalled()
  })
})
