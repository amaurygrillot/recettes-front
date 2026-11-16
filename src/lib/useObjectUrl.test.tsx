import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useObjectUrl } from './useObjectUrl'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useObjectUrl', () => {
  it('gives an address to a picture held in memory', () => {
    const blob = new Blob(['a'])
    const { result } = renderHook(() => useObjectUrl(blob))

    expect(result.current).toMatch(/^blob:/)
  })

  it('has no address for no picture', () => {
    expect(renderHook(() => useObjectUrl(undefined)).result.current).toBeUndefined()
    expect(renderHook(() => useObjectUrl(null)).result.current).toBeUndefined()
  })

  it('revokes the address when the picture stops being shown', () => {
    const revoke = vi.spyOn(URL, 'revokeObjectURL')
    const blob = new Blob(['a'])
    const { result, unmount } = renderHook(() => useObjectUrl(blob))
    const shown = result.current

    unmount()

    expect(revoke).toHaveBeenCalledExactlyOnceWith(shown)
  })

  it('revokes the old address when another picture takes its place', () => {
    const revoke = vi.spyOn(URL, 'revokeObjectURL')
    const first = new Blob(['a'])
    const second = new Blob(['b'])
    const { result, rerender } = renderHook(({ blob }) => useObjectUrl(blob), {
      initialProps: { blob: first },
    })
    const firstUrl = result.current

    rerender({ blob: second })

    expect(revoke).toHaveBeenCalledWith(firstUrl)
    expect(result.current).not.toBe(firstUrl)
  })

  it('shares one address between the components showing the same picture, and revokes it with the last', () => {
    const revoke = vi.spyOn(URL, 'revokeObjectURL')
    const blob = new Blob(['a'])
    const first = renderHook(() => useObjectUrl(blob))
    const second = renderHook(() => useObjectUrl(blob))
    expect(second.result.current).toBe(first.result.current)

    first.unmount()
    expect(revoke).not.toHaveBeenCalled()

    second.unmount()
    expect(revoke).toHaveBeenCalledOnce()
  })
})
