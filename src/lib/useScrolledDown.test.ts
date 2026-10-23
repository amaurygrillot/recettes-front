import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useScrolledDown } from './useScrolledDown'

function scrollTo(y: number) {
  act(() => {
    window.scrollY = y
    window.dispatchEvent(new Event('scroll'))
  })
}

describe('useScrolledDown', () => {
  afterEach(() => {
    window.scrollY = 0
  })

  it('is false at the top of the page', () => {
    const { result } = renderHook(() => useScrolledDown())

    expect(result.current).toBe(false)
  })

  it('stays false for a nudge near the top', () => {
    const { result } = renderHook(() => useScrolledDown())

    scrollTo(20)

    expect(result.current).toBe(false)
  })

  it('becomes true when the reader goes down, and false again when they come back up', () => {
    const { result } = renderHook(() => useScrolledDown())

    scrollTo(200)
    expect(result.current).toBe(true)

    scrollTo(150)
    expect(result.current).toBe(false)
  })

  it('stays true as the reader keeps going down', () => {
    const { result } = renderHook(() => useScrolledDown())

    scrollTo(200)
    scrollTo(400)
    scrollTo(401)

    expect(result.current).toBe(true)
  })

  it('ignores a movement of a few pixels', () => {
    const { result } = renderHook(() => useScrolledDown())
    scrollTo(300)

    scrollTo(296)

    expect(result.current).toBe(true)
  })

  it('is false once the reader is back at the top', () => {
    const { result } = renderHook(() => useScrolledDown())
    scrollTo(500)

    scrollTo(0)

    expect(result.current).toBe(false)
  })

  it('stops listening when the component goes away', () => {
    const { result, unmount } = renderHook(() => useScrolledDown())

    unmount()
    scrollTo(500)

    expect(result.current).toBe(false)
  })
})
