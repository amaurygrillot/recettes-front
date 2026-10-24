import { useEffect, useRef, type RefObject } from 'react'

/** Which of the two buttons of an item moves it: the one that goes back (up, left) or the one that goes forward. */
export type MoveDirection = 'back' | 'forward'

/**
 * Moving an item with its button puts the item somewhere else in the list: the button is the same
 * one, but the page has reordered it and the focus is gone. This puts the focus back on the button of
 * the item that moved (or on the other one when the item reached the end of the list and this one is
 * not usable any more), so that the same button can be pressed again.
 *
 * `ref` goes on the element that holds the items; each item has `data-sortable={id}` and its two
 * buttons `data-move="back"` and `data-move="forward"`. `items` is the list as rendered.
 */
export function useFollowedMove(items: readonly unknown[]): {
  ref: RefObject<HTMLDivElement | null>
  follow: (id: string, direction: MoveDirection) => void
} {
  const ref = useRef<HTMLDivElement>(null)
  const followed = useRef<{ id: string; direction: MoveDirection } | undefined>(undefined)

  useEffect(() => {
    const target = followed.current
    followed.current = undefined
    if (target === undefined) return
    const item = ref.current?.querySelector(`[data-sortable="${target.id}"]`)
    const button = (direction: MoveDirection) =>
      item?.querySelector<HTMLButtonElement>(`[data-move="${direction}"]`)
    const same = button(target.direction)
    const other = button(target.direction === 'back' ? 'forward' : 'back')
    ;(same?.disabled === false ? same : other)?.focus()
  }, [items])

  return {
    ref,
    follow: (id, direction) => {
      followed.current = { id, direction }
    },
  }
}
