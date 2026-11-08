import { useEffect, useEffectEvent, useLayoutEffect, type RefObject } from 'react'

export type ListPlacement = 'below' | 'above'

/** The room a list has under a field and over it, in pixels, within what the person can see. */
export interface ListRoom {
  below: number
  above: number
}

/**
 * The styles of a list that `useListPlacement` put over its field: it is fixed to the screen (so no box that scrolls
 * or hides what overflows can cut it), over the bars fixed to the page (z-index 40: over them, under the sheets and
 * dialogs), and scrolls inside when it is taller than the room. Its place is written by the hook.
 */
export const LIST_ABOVE_FIELD =
  'data-[placement=above]:fixed data-[placement=above]:z-40 data-[placement=above]:m-0 data-[placement=above]:overflow-y-auto'

/** Kept between a list and the edge of what is visible, and between the list and its field. */
const MARGIN = 8

/**
 * Under the field, where a list opens, unless there is not room for it there and there is more over the field:
 * with the keyboard up, what is under a field is the keyboard.
 */
export function choosePlacement({ below, above }: ListRoom, wanted: number): ListPlacement {
  return below >= wanted || below >= above ? 'below' : 'above'
}

function scrollParentOf(element: HTMLElement): HTMLElement | null {
  for (let parent = element.parentElement; parent !== null; parent = parent.parentElement) {
    const { overflowY } = getComputedStyle(parent)
    if (overflowY === 'auto' || overflowY === 'scroll') return parent
  }
  return null
}

/**
 * What is visible around a field. Under it: down to the visual viewport (the keyboard is not part of it, whether or
 * not the browser shrinks the page for it) and to the foot of the box that scrolls the field, if there is one (a
 * sheet), since the list is then in that box. Over it: up to the visual viewport, since a list over the field is
 * fixed to the screen and may cover what is above the field, the title of a sheet included.
 */
function roomAround(field: DOMRect, scroller: HTMLElement | null): ListRoom {
  const viewport = window.visualViewport
  const top = viewport?.offsetTop ?? 0
  const bottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight
  const box = scroller?.getBoundingClientRect()
  return {
    below: Math.min(bottom, box?.bottom ?? bottom) - field.bottom - MARGIN,
    above: field.top - top - MARGIN,
  }
}

function putBelow(list: HTMLElement): void {
  delete list.dataset.placement
  for (const property of ['maxHeight', 'width', 'left', 'top'] as const) {
    list.style[property] = ''
  }
}

/**
 * Over the field, as wide as it, ending just above it and no taller than the room there is. A fixed element is placed
 * from the corner of its containing block, which is the screen unless a parent is transformed (a sheet centered on a
 * tablet): where that corner is, is read from the list itself, laid at 0 0.
 */
function putAbove(list: HTMLElement, field: DOMRect, room: number): void {
  list.dataset.placement = 'above'
  const full = list.scrollHeight + list.offsetHeight - list.clientHeight
  const height = Math.max(0, Math.floor(Math.min(full, room)))
  list.style.maxHeight = `${height}px`
  list.style.width = `${field.width}px`
  list.style.left = '0px'
  list.style.top = '0px'
  const corner = list.getBoundingClientRect()
  list.style.left = `${field.left - corner.left}px`
  list.style.top = `${field.top - MARGIN - height - corner.top}px`
}

/**
 * Keeps the list of a field in view: under it, as designed, or over it when the keyboard leaves no room under it
 * (the list then carries `data-placement="above"`, see `LIST_ABOVE_FIELD`). It is read again after every render (the
 * answers to what is typed change the height of the list) and whenever the visible part of the page moves or changes
 * size. It writes to the DOM and not to state: nothing is drawn twice.
 */
export function useListPlacement(
  open: boolean,
  field: RefObject<HTMLElement | null>,
  list: RefObject<HTMLElement | null>,
): void {
  const place = useEffectEvent(() => {
    const fieldElement = field.current
    const listElement = list.current
    if (listElement === null) return
    if (!open || fieldElement === null) {
      putBelow(listElement)
      return
    }
    const rect = fieldElement.getBoundingClientRect()
    const room = roomAround(rect, scrollParentOf(fieldElement))
    if (choosePlacement(room, listElement.scrollHeight) === 'below') {
      putBelow(listElement)
      return
    }
    putAbove(listElement, rect, room.above)
  })

  useLayoutEffect(() => {
    place()
  })

  useEffect(() => {
    if (!open) return undefined
    const viewport = window.visualViewport
    const replace = (): void => {
      place()
    }
    viewport?.addEventListener('resize', replace)
    viewport?.addEventListener('scroll', replace)
    window.addEventListener('resize', replace)
    // A scroll of the sheet that holds the field does not bubble: it is listened to on the way down.
    document.addEventListener('scroll', replace, true)
    return () => {
      viewport?.removeEventListener('resize', replace)
      viewport?.removeEventListener('scroll', replace)
      window.removeEventListener('resize', replace)
      document.removeEventListener('scroll', replace, true)
    }
  }, [open])
}
