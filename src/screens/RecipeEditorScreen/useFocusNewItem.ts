import { useEffect, useRef, type RefObject } from 'react'

/**
 * After a button added an item to the end of a list, the typing starts in it: the focus goes to the
 * field of the new item that `selector` names (`[role="combobox"]` for a line's ingredient).
 *
 * `ref` is the element that holds the items, each marked `data-sortable={id}`; `items` is the list as
 * rendered. Call the function this returns right before adding.
 */
export function useFocusNewItem(
  ref: RefObject<HTMLElement | null>,
  items: readonly { id: string }[],
  selector: string,
): () => void {
  const asked = useRef(false)

  useEffect(() => {
    if (!asked.current) return
    asked.current = false
    const added = items.at(-1)
    if (added === undefined) return
    ref.current?.querySelector<HTMLElement>(`[data-sortable="${added.id}"] ${selector}`)?.focus()
  }, [items, ref, selector])

  return () => {
    asked.current = true
  }
}
