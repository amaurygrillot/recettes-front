import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { installMatchMedia, removeMatchMedia } from '../test/matchMedia'
import { useMediaQuery } from './useMediaQuery'

describe('useMediaQuery', () => {
  afterEach(() => {
    removeMatchMedia()
  })

  it('says whether the query matches now', () => {
    installMatchMedia(1280)

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'))

    expect(result.current).toBe(true)
  })

  it('follows the screen as it changes size', () => {
    const screen = installMatchMedia(768)
    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'))
    expect(result.current).toBe(false)

    screen.resizeTo(1280)
    expect(result.current).toBe(true)

    screen.resizeTo(600)
    expect(result.current).toBe(false)
  })

  it('stops listening when the component goes away, and listens once while it stays', () => {
    const screen = installMatchMedia(768)
    const { rerender, unmount } = renderHook(() => useMediaQuery('(min-width: 1024px)'))
    rerender()
    expect(screen.listenerCount()).toBe(1)

    unmount()

    expect(screen.listenerCount()).toBe(0)
  })

  it('matches nothing where the browser has no matchMedia', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'))

    expect(result.current).toBe(false)
  })
})
