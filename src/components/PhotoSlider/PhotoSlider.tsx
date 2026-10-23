import { useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import { strings } from './strings'

export interface SliderPhoto {
  id: string
  /** The picture at full size. */
  url: string
  /** The small one, for the strip under the picture. */
  thumbnailUrl: string
  /** What it shows, when the author said; empty when the picture only decorates. */
  alt: string
}

export interface PhotoSliderProps {
  photos: readonly SliderPhoto[]
  /** The name of the gallery: « Photos de la recette ». */
  label: string
  /** Over the top-left corner of the photo: the way back. */
  leading?: ReactNode
  /** Over the top-right corner: the author's menu. With it, the counter sits at the bottom right. */
  trailing?: ReactNode
}

/** A horizontal movement of this many pixels is a swipe, not a finger resting. */
const SWIPE_PX = 48

const ROUND_BUTTON =
  'absolute grid size-14 cursor-pointer place-items-center rounded-full border-2 border-ink-900 bg-paper-50 text-ink-900 shadow-paper focus-visible:outline-offset-3 active:bg-butter-200'

function Placeholder() {
  return (
    <div className="grid size-full place-items-center bg-butter-stripes">
      <span className="grid size-21 place-items-center rounded-full border-2 border-ink-900 bg-paper-50 text-ink-900 shadow-stamp-sm">
        <Icon name="cutlery" size={40} />
      </span>
    </div>
  )
}

/**
 * The photos of a recipe in a 4:3 frame: arrows, a counter, dots and thumbnails, all leading to
 * the same picture, and a swipe. One photo shows no controls; none shows the butter stand-in,
 * never an empty square. Arrow keys move through the photos when the gallery has the focus.
 */
export function PhotoSlider({ photos, label, leading, trailing }: PhotoSliderProps) {
  const [index, setIndex] = useState(0)
  const [pressedAt, setPressedAt] = useState<number | undefined>()
  const total = photos.length
  const current = Math.min(index, Math.max(total - 1, 0))
  const shown = photos[current]

  function go(step: number): void {
    setIndex((current + step + total) % total)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (total < 2) return
    if (event.key === 'ArrowLeft') go(-1)
    if (event.key === 'ArrowRight') go(1)
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>): void {
    if (pressedAt !== undefined && total > 1) {
      const travel = event.clientX - pressedAt
      if (Math.abs(travel) >= SWIPE_PX) go(travel < 0 ? 1 : -1)
    }
    setPressedAt(undefined)
  }

  return (
    // The arrow keys are caught here, on the group, from the controls inside it that hold the focus.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      role="group"
      aria-roledescription="carrousel"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="overflow-hidden rounded-xl border-2 border-ink-900 bg-paper-50"
    >
      <div
        className="relative touch-pan-y"
        onPointerDown={(event) => {
          setPressedAt(event.clientX)
        }}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          setPressedAt(undefined)
        }}
      >
        <div className="aspect-4/3">
          {shown === undefined ? (
            <Placeholder />
          ) : (
            <img
              src={shown.url}
              alt={shown.alt}
              decoding="async"
              draggable={false}
              className="size-full object-cover"
            />
          )}
        </div>
        {leading && <div className="absolute top-3 left-3">{leading}</div>}
        {trailing && <div className="absolute top-3 right-3">{trailing}</div>}
        {total > 1 && (
          <>
            <button
              type="button"
              aria-label={strings.previous}
              onClick={() => {
                go(-1)
              }}
              className={classNames(ROUND_BUTTON, 'top-1/2 left-2.5 -mt-7')}
            >
              <Icon name="chevron-left" size={26} strokeWidth={2.6} />
            </button>
            <button
              type="button"
              aria-label={strings.next}
              onClick={() => {
                go(1)
              }}
              className={classNames(ROUND_BUTTON, 'top-1/2 right-2.5 -mt-7')}
            >
              <Icon name="chevron-right" size={26} strokeWidth={2.6} />
            </button>
            <span
              role="status"
              className="absolute right-3 bottom-3 inline-flex h-8 items-center rounded-pill bg-ink-900 px-3 text-detail font-bold text-paper-50"
            >
              {strings.counter(current + 1, total)}
            </span>
          </>
        )}
      </div>
      {total > 1 && (
        <div className="flex flex-col items-center gap-3.5 border-t-2 border-ink-900 bg-paper-50 px-4 pt-3.5 pb-4">
          <div aria-hidden="true" className="flex items-center gap-2">
            {photos.map((photo, position) => (
              <span
                key={photo.id}
                className={classNames(
                  'h-3 rounded-pill border-2 border-ink-900',
                  position === current ? 'w-8 bg-ink-900' : 'w-3',
                )}
              />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {photos.map((photo, position) => (
              <button
                key={photo.id}
                type="button"
                aria-label={strings.photo(position + 1, total, position === current)}
                aria-current={position === current ? 'true' : undefined}
                onClick={() => {
                  setIndex(position)
                }}
                className={classNames(
                  'size-13 cursor-pointer overflow-hidden rounded-m border-2 border-ink-900 p-0 focus-visible:outline-offset-3',
                  position === current && 'outline-3 outline-offset-2 outline-ink-900',
                )}
              >
                <img src={photo.thumbnailUrl} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
