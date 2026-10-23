import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { installIntersectionObserver } from '../test/intersectionObserver'
import { useScrolledPast } from './useScrolledPast'

function Probe({ targetShown = true }: { targetShown?: boolean }) {
  const { past, ref } = useScrolledPast()
  return (
    <div>
      {targetShown && (
        <button ref={ref} type="button">
          cible
        </button>
      )}
      <p>{past ? 'dépassé' : 'pas dépassé'}</p>
    </div>
  )
}

describe('useScrolledPast', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('is not past while the element is on the screen', () => {
    const intersection = installIntersectionObserver()
    render(<Probe />)

    intersection.report({ visible: true, bottom: 300 })

    expect(screen.getByText('pas dépassé')).toBeVisible()
  })

  it('is past once the element has gone out of the top of the screen', () => {
    const intersection = installIntersectionObserver()
    render(<Probe />)

    intersection.report({ visible: false, bottom: -20 })

    expect(screen.getByText('dépassé')).toBeVisible()
  })

  it('is not past while the element still waits below the screen', () => {
    const intersection = installIntersectionObserver()
    render(<Probe />)

    intersection.report({ visible: false, bottom: 1500 })

    expect(screen.getByText('pas dépassé')).toBeVisible()
  })

  it('is not past any more once the reader scrolls back up to it', () => {
    const intersection = installIntersectionObserver()
    render(<Probe />)
    intersection.report({ visible: false, bottom: -20 })

    intersection.report({ visible: true, bottom: 100 })

    expect(screen.getByText('pas dépassé')).toBeVisible()
  })

  it('stops observing when the component goes away', () => {
    const intersection = installIntersectionObserver()
    const { unmount } = render(<Probe />)
    expect(intersection.observedCount()).toBe(1)

    unmount()

    expect(intersection.observedCount()).toBe(0)
  })

  it('observes an element that only appears after the component did', () => {
    const intersection = installIntersectionObserver()
    const { rerender } = render(<Probe targetShown={false} />)
    expect(intersection.observedCount()).toBe(0)

    rerender(<Probe />)
    intersection.report({ visible: false, bottom: -20 })

    expect(intersection.observedCount()).toBe(1)
    expect(screen.getByText('dépassé')).toBeVisible()
  })

  it('is never past where the browser cannot observe', () => {
    render(<Probe />)

    expect(screen.getByText('pas dépassé')).toBeVisible()
  })
})
