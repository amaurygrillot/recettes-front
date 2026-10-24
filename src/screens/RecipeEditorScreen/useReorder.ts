import { useState } from 'react'

export interface ReorderOptions {
  /** How many items the list holds. */
  count: number
  /** Puts the item at `from` where `to` is (both count from 0). */
  move: (from: number, to: number) => void
  /** What is said once an item moved: the position it left and the one it reached (counted from 1). */
  announce: (position: number, newPosition: number, total: number) => string
}

/**
 * Moving an item of a list one step at a time (the arrows of a photo, « Monter » and « Descendre »
 * of a step), the way the drag does it, and saying so: a screen reader hears where it went. A move
 * out of the list is not one.
 */
export function useReorder({ count, move, announce }: ReorderOptions): {
  moveItem: (from: number, to: number) => void
  /** What was last said: to put in a polite live region. */
  announcement: string
} {
  const [announcement, setAnnouncement] = useState('')

  return {
    announcement,
    moveItem: (from, to) => {
      if (from === to || to < 0 || to >= count) return
      move(from, to)
      setAnnouncement(announce(from + 1, to + 1, count))
    },
  }
}
