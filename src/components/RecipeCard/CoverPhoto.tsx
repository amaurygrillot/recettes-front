import { useState } from 'react'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import { NoPhoto } from '../NoPhoto/NoPhoto'
import { strings } from './strings'
import type { CoverSlider } from './useCoverSlider'

export interface CoverPhotoProps {
  /** The pictures' addresses, in order; none for a recipe without a photo. */
  urls: readonly string[]
  /** Which one is shown, and how to change it: used from two pictures on. */
  slider: CoverSlider
}

/** A photo that cannot be loaded: the butter stripes and a cutlery, the same frame, never a broken-image icon. */
function BrokenPhoto() {
  return (
    <div className="grid size-full place-items-center bg-butter-stripes">
      <span className="grid size-21 place-items-center rounded-full border-2 border-ink-900 bg-paper-50 text-ink-900 shadow-stamp-sm">
        <Icon name="cutlery" size={40} />
      </span>
    </div>
  )
}

/** One picture, or the stripes if it fails: the picture is decoration (the title says what the recipe is). */
function Picture({ url }: { url: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <BrokenPhoto />
  return (
    <img
      src={url}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => {
        setFailed(true)
      }}
      className="size-full object-cover"
    />
  )
}

/** The dots under the photos, the filled one being the photo shown, and the counter above them. Decoration: the card says nothing of them. */
function Position({ index, total }: { index: number; total: number }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1.75 rounded-pill border-thin border-ink-900 bg-paper-50/92 px-2.25 py-1.25"
      >
        {Array.from({ length: total }, (_, dot) => (
          <span
            key={dot}
            className={classNames(
              'size-2.25 rounded-full border-thin border-ink-900',
              dot === index ? 'bg-ink-900' : 'bg-paper-50',
            )}
          />
        ))}
      </div>
      <span
        aria-hidden="true"
        className="absolute top-2.5 right-2.5 inline-flex h-7 items-center rounded-pill bg-ink-900 px-2.5 text-caption font-bold text-paper-50"
      >
        {strings.counter(index + 1, total)}
      </span>
    </>
  )
}

/**
 * The 4:3 frame of a card. A recipe without a photo gets the mascot, one whose photo cannot be loaded the butter
 * stripes and a cutlery: the same frame, never a gap or a broken-image icon. With several photos the frame is a small
 * slider: they lie side by side and slide, with dots and a counter (R8). One photo looks as it always did.
 */
export function CoverPhoto({ urls, slider }: CoverPhotoProps) {
  const [only] = urls
  if (only === undefined) {
    return (
      <div className="aspect-4/3 border-b-2 border-ink-900">
        <NoPhoto />
      </div>
    )
  }
  if (urls.length === 1) {
    return (
      <div className="aspect-4/3 border-b-2 border-ink-900">
        <Picture url={only} />
      </div>
    )
  }

  const { index, pull } = slider
  return (
    <div
      {...slider.frame}
      className="relative aspect-4/3 touch-pan-y overflow-hidden border-b-2 border-ink-900"
    >
      <div
        className={classNames(
          'flex size-full',
          // Following a finger it must not lag; letting go, it settles on the photo.
          pull === undefined &&
            'transition-transform duration-200 ease-out motion-reduce:transition-none',
        )}
        style={{ transform: `translateX(calc(${-index * 100}% + ${pull ?? 0}px))` }}
      >
        {urls.map((url, position) => (
          <div key={position} className="size-full shrink-0">
            <Picture url={url} />
          </div>
        ))}
      </div>
      <Position index={index} total={urls.length} />
    </div>
  )
}
