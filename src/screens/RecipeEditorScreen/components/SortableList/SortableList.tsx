import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, type ComponentProps, type ReactNode } from 'react'

/** How the items lie: a grid of tiles, a row that scrolls sideways, or a stack of cards. */
export type SortableLayout = 'grid' | 'row' | 'stack'

const LIST_LAYOUTS: Record<SortableLayout, string> = {
  grid: 'grid grid-cols-2 gap-3 tablet:grid-cols-3 desktop:grid-cols-4',
  // Out to the edge of the card it is in, so that what overflows can be seen to.
  row: '-mx-3.5 flex gap-3 overflow-x-auto px-3.5 pt-0.5 pb-1.5 *:w-43.25 *:shrink-0',
  stack: 'flex flex-col gap-3.5',
}

const STRATEGIES = {
  grid: rectSortingStrategy,
  row: rectSortingStrategy,
  stack: verticalListSortingStrategy,
} satisfies Record<SortableLayout, unknown>

/** What a screen reader is told while an item is dragged, in the words of what the items are. */
export interface ReorderWords {
  /** The item that is taken, by its position (counted from 1). */
  lifted: (position: number, total: number) => string
  moved: (position: number, newPosition: number, total: number) => string
  dropped: (position: number, total: number) => string
  cancelled: string
  /** How to drag with the keyboard. */
  instructions: string
  /** What the grip is, for those who hear it: « photo à déplacer ». */
  grip: string
}

export interface SortableListProps {
  layout: SortableLayout
  /** The identity of every item, in order. */
  ids: readonly string[]
  words: ReorderWords
  /** An item was dropped somewhere else: `from` and `to` count from 0. */
  onReorder: (from: number, to: number) => void
  /** The item that follows the pointer while it is carried. */
  renderLifted: (id: string) => ReactNode
  /** What follows the items inside the list and is not one of them (a tile that adds one). */
  after?: ReactNode
  /** The items, each one a `SortableItem`. */
  children: ReactNode
}

/**
 * A list whose items can be reordered by dragging (the mouse, a finger, or the keyboard: space to take,
 * the arrows to move, space to drop). Only the grip starts a drag, so that the page can still be scrolled
 * with a finger; the arrows of each item do the same without any drag, for those who cannot.
 */
export function SortableList({
  layout,
  ids,
  words,
  onReorder,
  renderLifted,
  after,
  children,
}: SortableListProps) {
  const [liftedId, setLiftedId] = useState<string | null>(null)
  const sensors = useSensors(
    // A few pixels first, so that a tap on the grip is not a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const total = ids.length
  const positionOf = (id: string | number) => ids.indexOf(String(id)) + 1
  const announcements: Announcements = {
    onDragStart: ({ active }) => words.lifted(positionOf(active.id), total),
    onDragOver: ({ active, over }) =>
      over === null ? undefined : words.moved(positionOf(active.id), positionOf(over.id), total),
    onDragEnd: ({ over, active }) => words.dropped(positionOf(over?.id ?? active.id), total),
    onDragCancel: () => words.cancelled,
  }

  function onDragStart({ active }: DragStartEvent): void {
    setLiftedId(String(active.id))
  }

  function onDragEnd({ active, over }: DragEndEvent): void {
    setLiftedId(null)
    if (over === null || active.id === over.id) return
    onReorder(ids.indexOf(String(active.id)), ids.indexOf(String(over.id)))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      accessibility={{
        announcements,
        screenReaderInstructions: { draggable: words.instructions },
      }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => {
        setLiftedId(null)
      }}
    >
      <SortableContext items={[...ids]} strategy={STRATEGIES[layout]}>
        <ul className={LIST_LAYOUTS[layout]}>
          {children}
          {after}
        </ul>
      </SortableContext>
      <DragOverlay>{liftedId === null ? null : renderLifted(liftedId)}</DragOverlay>
    </DndContext>
  )
}

export interface SortableItemProps {
  id: string
  /** What the grip is, for those who hear it. */
  grip: string
  /** Said in the place the carried item leaves: « Déposer ici ». */
  dropHere: string
  /** Receives what the grip needs, and whether this item is the one being carried. */
  children: (item: { handle: ComponentProps<'button'>; carried: boolean }) => ReactNode
}

/**
 * One item of a `SortableList`. While it is carried its place keeps its size (the others move around
 * it) and says where it will land.
 */
export function SortableItem({ id, grip, dropHere, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, attributes: { roleDescription: grip } })

  return (
    <li
      ref={setNodeRef}
      data-sortable={id}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className="relative min-w-0"
    >
      <div className={isDragging ? 'invisible' : undefined}>
        {children({
          handle: { ...attributes, ...listeners, ref: setActivatorNodeRef },
          carried: isDragging,
        })}
      </div>
      {isDragging && (
        <div
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center rounded-l border-2 border-dashed border-ink-500 bg-paper-200 text-detail font-bold text-ink-800"
        >
          {dropHere}
        </div>
      )}
    </li>
  )
}
