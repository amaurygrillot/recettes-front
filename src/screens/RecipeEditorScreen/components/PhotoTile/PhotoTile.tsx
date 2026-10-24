import type { ComponentProps, ReactNode } from 'react'
import { mediaUrl } from '../../../../api/media'
import { classNames } from '../../../../lib/classNames'
import { Icon } from '../../../../components/Icon/Icon'
import { strings } from '../../strings'

export interface PhotoTileProps {
  /** Counted from 1. */
  position: number
  total: number
  mediaId: string
  /** The first photo of the recipe's cover: told apart by its yellow label. */
  cover: boolean
  /** The grip of the drag, with what the drag needs on it. */
  handle: ComponentProps<'button'>
  /** Where the arrows of this photo lead, which is nowhere at either end. */
  canMoveBack: boolean
  canMoveForward: boolean
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
  /** Lifted by a drag: it is drawn tilted, over the page. */
  lifted?: boolean
  /** The field of its description. */
  children: ReactNode
}

const GESTURE_BUTTON =
  'inline-grid size-11 shrink-0 cursor-pointer place-items-center rounded-m border-2 border-ink-900 bg-paper-50 text-ink-900 enabled:active:bg-butter-200 disabled:cursor-not-allowed disabled:border-dashed disabled:border-disabled-border disabled:bg-disabled-bg disabled:text-disabled-text'

/**
 * One photo of a list (the cover, or a step): the picture in the 4:3 frame of the recipe page, what it
 * is called (« Couverture », « Photo 2 »), how to remove it and the three ways to move it (the grip to
 * drag, the two arrows), and under it the field of its description. A photo only leaves the form when
 * the recipe is saved: removing it here deletes nothing.
 */
export function PhotoTile({
  position,
  total,
  mediaId,
  cover,
  handle,
  canMoveBack,
  canMoveForward,
  onMove,
  onRemove,
  lifted = false,
  children,
}: PhotoTileProps) {
  const { photos } = strings
  return (
    <div
      role="group"
      aria-label={photos.group(position, total)}
      className={classNames(
        'flex flex-col overflow-hidden rounded-l border-2 border-ink-900',
        lifted ? 'rotate-2 bg-butter-100 shadow-sheet' : 'bg-paper-50',
        cover && !lifted && 'shadow-stamp',
      )}
    >
      <div className="relative aspect-4/3 border-b-2 border-ink-900 bg-paper-200">
        <img
          src={mediaUrl(mediaId, 'thumbnail')}
          alt=""
          className="size-full object-cover"
          draggable={false}
        />
        <span
          className={classNames(
            'absolute top-2 left-2 inline-flex h-8 items-center rounded-pill border-2 border-ink-900 px-2.5 text-detail font-bold',
            cover ? 'bg-butter-300 text-ink-900' : 'bg-ink-900 text-paper-50',
          )}
        >
          {cover ? photos.cover : photos.photo(position)}
        </span>
        <button
          type="button"
          aria-label={photos.remove(position)}
          onClick={onRemove}
          className="absolute top-1.5 right-1.5 grid size-11 cursor-pointer place-items-center rounded-full border-2 border-ink-900 bg-paper-50 text-ink-900 enabled:active:bg-butter-200"
        >
          <Icon name="close" size={22} strokeWidth={2.6} />
        </button>
      </div>
      <div className="flex flex-col gap-2.5 px-2 pt-2 pb-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={photos.handle(position)}
            {...handle}
            className="inline-grid size-11 shrink-0 cursor-grab touch-none place-items-center rounded-m border-2 border-transparent text-ink-700 focus-visible:text-ink-900 active:cursor-grabbing"
          >
            <Icon name="grip" size={22} />
          </button>
          <button
            type="button"
            aria-label={photos.moveLeft(position)}
            data-move="back"
            disabled={!canMoveBack}
            onClick={() => {
              onMove(-1)
            }}
            className={GESTURE_BUTTON}
          >
            <Icon name="chevron-left" size={22} strokeWidth={2.6} />
          </button>
          <button
            type="button"
            aria-label={photos.moveRight(position)}
            data-move="forward"
            disabled={!canMoveForward}
            onClick={() => {
              onMove(1)
            }}
            className={GESTURE_BUTTON}
          >
            <Icon name="chevron-right" size={22} strokeWidth={2.6} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
