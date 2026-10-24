import { useRef, type PointerEvent } from 'react'

export type SwipeDirection = 'left' | 'right'

/** How far a finger has to go sideways, and how much more sideways than up or down, to count as a swipe. */
const MIN_DISTANCE_PX = 60
const MIN_SIDEWAYS_RATIO = 1.5

export interface SwipeHandlers {
  onPointerDown: (event: PointerEvent) => void
  onPointerUp: (event: PointerEvent) => void
  onPointerCancel: () => void
}

/**
 * A swipe of a finger (or a pen) to the left or to the right, for the handlers it returns to go on
 * an element. A mostly vertical move is the page being scrolled, and a mouse is never a swipe (it
 * would fight with selecting text): both are ignored. The element keeps `touch-action: pan-y`,
 * so the browser still scrolls it up and down.
 */
export function useSwipe(onSwipe: (direction: SwipeDirection) => void): SwipeHandlers {
  const start = useRef<{ x: number; y: number } | undefined>(undefined)

  return {
    onPointerDown: (event) => {
      start.current =
        event.pointerType === 'mouse' ? undefined : { x: event.clientX, y: event.clientY }
    },
    onPointerUp: (event) => {
      const from = start.current
      start.current = undefined
      if (from === undefined) return
      const sideways = event.clientX - from.x
      const vertical = event.clientY - from.y
      if (
        Math.abs(sideways) >= MIN_DISTANCE_PX &&
        Math.abs(sideways) > Math.abs(vertical) * MIN_SIDEWAYS_RATIO
      ) {
        onSwipe(sideways < 0 ? 'left' : 'right')
      }
    },
    onPointerCancel: () => {
      start.current = undefined
    },
  }
}
