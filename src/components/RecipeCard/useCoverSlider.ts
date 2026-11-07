import { useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react'
import { strings } from './strings'

/** A finger has to go this far (or a fifth of the photo, if that is less) for the next photo to take over. */
const SWIPE_PX = 60
/** Under this the gesture has no direction yet: a tap trembles. */
const DIRECTION_PX = 8
/** Pulled past the first or the last photo, the track gives only a third of the way: it is not going anywhere. */
const RESISTANCE = 3

interface Gesture {
  pointerId: number
  x: number
  y: number
  /** The width of the photo, to know what a fifth of it is. */
  width: number
  /** Known once the finger has moved: sideways is the photo's, up or down is the list's. */
  axis: 'sideways' | 'vertical' | undefined
}

/**
 * Which photo a recipe card shows, and the ways to change it: a finger that drags the photos sideways (they follow it,
 * and the next one takes over on release), the two arrows of a desktop and the arrow keys. Each card has its own. It
 * is automatic never, and a vertical movement is always the list scrolling: the direction is decided by the first
 * movement, so a diagonal one goes on scrolling the list rather than changing a photo by accident. A mouse never
 * drags (it would fight with selecting text): it has the arrows.
 */
export function useCoverSlider(count: number) {
  const [chosen, setChosen] = useState(0)
  const [pull, setPull] = useState<number | undefined>()
  const [announcement, setAnnouncement] = useState('')
  const gesture = useRef<Gesture | undefined>(undefined)
  // A drag ends in a click that must not open the recipe; the next touch forgets it.
  const dragged = useRef(false)

  // The list behind may change under a card (fewer photos): the one shown is never past the last.
  const index = Math.min(chosen, Math.max(count - 1, 0))
  const last = count - 1

  function show(next: number, announce: boolean): void {
    setChosen(next)
    if (announce) setAnnouncement(strings.photoShown(next + 1, count))
  }

  /** The buttons and the keys go round: there is no dead end for them. */
  function step(by: -1 | 1): void {
    show((index + by + count) % count, true)
  }

  function release(): void {
    gesture.current = undefined
    setPull(undefined)
  }

  return {
    index,
    /** How far a finger holds the photos from their place, in px, or none when they are at rest. */
    pull,
    announcement,
    previous: () => {
      step(-1)
    },
    next: () => {
      step(1)
    },
    /** For the photo's frame. The frame keeps `touch-action: pan-y`, so the browser still scrolls the page. */
    frame: {
      onPointerDown: (event: PointerEvent<HTMLElement>) => {
        dragged.current = false
        if (count < 2 || event.pointerType === 'mouse') return
        gesture.current = {
          pointerId: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          width: event.currentTarget.getBoundingClientRect().width,
          axis: undefined,
        }
      },
      onPointerMove: (event: PointerEvent<HTMLElement>) => {
        const current = gesture.current
        if (current?.pointerId !== event.pointerId || current.axis === 'vertical') return
        const sideways = event.clientX - current.x
        const vertical = event.clientY - current.y
        if (current.axis === undefined) {
          if (Math.max(Math.abs(sideways), Math.abs(vertical)) < DIRECTION_PX) return
          current.axis = Math.abs(sideways) > Math.abs(vertical) ? 'sideways' : 'vertical'
          if (current.axis === 'vertical') {
            gesture.current = undefined
            return
          }
          // The photos follow the finger even if it leaves the frame.
          event.currentTarget.setPointerCapture(event.pointerId)
        }
        dragged.current = true
        const pastTheEnd = (index === 0 && sideways > 0) || (index === last && sideways < 0)
        setPull(pastTheEnd ? sideways / RESISTANCE : sideways)
      },
      onPointerUp: (event: PointerEvent<HTMLElement>) => {
        const current = gesture.current
        if (current?.pointerId !== event.pointerId) return
        const sideways = event.clientX - current.x
        const needed = Math.min(SWIPE_PX, current.width / 5)
        if (current.axis === 'sideways' && Math.abs(sideways) >= needed) {
          const next = Math.min(Math.max(index + (sideways < 0 ? 1 : -1), 0), last)
          if (next !== index) show(next, true)
        }
        release()
      },
      onPointerCancel: release,
      /** The click that follows a drag is not a tap on the card. */
      onClickCapture: (event: MouseEvent<HTMLElement>) => {
        if (!dragged.current) return
        dragged.current = false
        event.preventDefault()
        event.stopPropagation()
      },
    },
    /** For the card's link: ← and → change the photo while the card has the focus. */
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (count < 2 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        step(-1)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        step(1)
      }
    },
  }
}

export type CoverSlider = ReturnType<typeof useCoverSlider>
