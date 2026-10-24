import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from './useDebouncedValue'

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with the value it is given', () => {
    const { result } = renderHook(() => useDebouncedValue('far', 200))

    expect(result.current).toBe('far')
  })

  it('follows the value only once it has stopped changing', () => {
    const { result, rerender } = renderHook(({ typed }) => useDebouncedValue(typed, 200), {
      initialProps: { typed: 'f' },
    })

    rerender({ typed: 'fa' })
    act(() => {
      vi.advanceTimersByTime(150)
    })
    rerender({ typed: 'far' })
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(result.current).toBe('f')

    act(() => {
      vi.advanceTimersByTime(60)
    })
    expect(result.current).toBe('far')
  })
})
