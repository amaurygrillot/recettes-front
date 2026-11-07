import type { ReactNode } from 'react'

/** How the items lie: a grid of tiles, a row that scrolls sideways, or a stack of cards. */
export type ItemListLayout = 'grid' | 'row' | 'stack'

const LAYOUTS: Record<ItemListLayout, string> = {
  grid: 'grid grid-cols-2 gap-3 tablet:grid-cols-3 desktop:grid-cols-4',
  // Out to the edge of the card it is in, so that what overflows can be seen to.
  row: '-mx-3.5 flex gap-3 overflow-x-auto px-3.5 pt-0.5 pb-1.5 *:w-43.25 *:shrink-0',
  stack: 'flex flex-col gap-3.5',
}

export interface ItemListProps {
  layout: ItemListLayout
  /** The items, each one an `Item`, and what follows them inside the list without being one (a tile that adds one). */
  children: ReactNode
}

/**
 * The items of a list of the editor (photos, steps, lines of a group), laid out as tiles, a row or a stack. They are
 * moved with their own buttons, not by dragging (R7): nothing here catches a finger, so the page scrolls freely.
 */
export function ItemList({ layout, children }: ItemListProps) {
  return <ul className={LAYOUTS[layout]}>{children}</ul>
}

export interface ItemProps {
  /** The identity of the item, so that the focus can follow it when its buttons move it (`useFollowedMove`). */
  id: string
  children: ReactNode
}

/** One item of an `ItemList`. */
export function Item({ id, children }: ItemProps) {
  return (
    <li data-item={id} className="min-w-0">
      {children}
    </li>
  )
}
