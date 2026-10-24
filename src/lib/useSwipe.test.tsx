import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useSwipe } from './useSwipe'

function Area({ onSwipe }: { onSwipe: (direction: 'left' | 'right') => void }) {
  const handlers = useSwipe(onSwipe)
  return <div data-testid="area" {...handlers} />
}

function drag(
  from: { x: number; y: number },
  to: { x: number; y: number },
  pointerType: 'touch' | 'mouse' | 'pen' = 'touch',
) {
  const area = screen.getByTestId('area')
  fireEvent.pointerDown(area, { clientX: from.x, clientY: from.y, pointerType })
  fireEvent.pointerUp(area, { clientX: to.x, clientY: to.y, pointerType })
}

describe('useSwipe', () => {
  it('says « left » for a finger that goes left, and « right » for one that goes right', () => {
    const onSwipe = vi.fn()
    render(<Area onSwipe={onSwipe} />)

    drag({ x: 300, y: 400 }, { x: 150, y: 410 })
    drag({ x: 100, y: 400 }, { x: 260, y: 395 })

    expect(onSwipe.mock.calls).toEqual([['left'], ['right']])
  })

  it('ignores a move that is too short', () => {
    const onSwipe = vi.fn()
    render(<Area onSwipe={onSwipe} />)

    drag({ x: 300, y: 400 }, { x: 260, y: 400 })

    expect(onSwipe).not.toHaveBeenCalled()
  })

  it('ignores a move that is mostly up or down: the page is being scrolled', () => {
    const onSwipe = vi.fn()
    render(<Area onSwipe={onSwipe} />)

    drag({ x: 300, y: 600 }, { x: 220, y: 300 })

    expect(onSwipe).not.toHaveBeenCalled()
  })

  it('ignores a mouse, which selects text', () => {
    const onSwipe = vi.fn()
    render(<Area onSwipe={onSwipe} />)

    drag({ x: 300, y: 400 }, { x: 100, y: 400 }, 'mouse')

    expect(onSwipe).not.toHaveBeenCalled()
  })

  it('ignores a move that was cancelled, and a release that no press began', () => {
    const onSwipe = vi.fn()
    render(<Area onSwipe={onSwipe} />)
    const area = screen.getByTestId('area')

    fireEvent.pointerDown(area, { clientX: 300, clientY: 400, pointerType: 'touch' })
    fireEvent.pointerCancel(area)
    fireEvent.pointerUp(area, { clientX: 100, clientY: 400, pointerType: 'touch' })

    expect(onSwipe).not.toHaveBeenCalled()
  })
})
