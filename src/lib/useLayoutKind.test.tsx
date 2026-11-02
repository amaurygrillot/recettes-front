import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { installMatchMedia, removeMatchMedia } from '../test/matchMedia'
import { useLayoutKind } from './useLayoutKind'

describe('useLayoutKind', () => {
  afterEach(() => {
    removeMatchMedia()
  })

  it.each([
    [390, 'phone'],
    [599, 'phone'],
    [600, 'tablet'],
    [1023, 'tablet'],
    [1024, 'desktop'],
    [1280, 'desktop'],
  ] as const)('is %i px: a %s', (width, kind) => {
    installMatchMedia(width)

    const { result } = renderHook(() => useLayoutKind())

    expect(result.current).toBe(kind)
  })

  it('follows the screen as it is turned', () => {
    const screen = installMatchMedia(390)
    const { result } = renderHook(() => useLayoutKind())
    expect(result.current).toBe('phone')

    screen.resizeTo(800)

    expect(result.current).toBe('tablet')
  })
})
