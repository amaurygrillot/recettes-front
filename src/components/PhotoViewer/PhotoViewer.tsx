import { Dialog } from 'radix-ui'
import { useSwipe } from '../../lib/useSwipe'
import { Icon } from '../Icon/Icon'
import { IconButton } from '../IconButton/IconButton'
import { strings } from './strings'

export interface ViewerPhoto {
  id: string
  url: string
  alt: string
}

export interface PhotoViewerProps {
  photos: readonly ViewerPhoto[]
  /** The photo shown; none while the viewer is closed. */
  index: number | undefined
  onIndexChange: (index: number) => void
  onClose: () => void
}

const ARROW =
  'absolute top-1/2 grid size-14 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-2 border-ink-900 bg-paper-50 text-ink-900 focus-visible:outline-offset-3 focus-visible:outline-paper-50'

/**
 * A photo of a step at the size of the screen, over the page: a touch on one of the small ones
 * opens it here. Arrows (and the arrow keys) move between the photos of the step; Escape or the
 * cross closes it, and the focus returns to the photo that was touched.
 */
export function PhotoViewer({ photos, index, onIndexChange, onClose }: PhotoViewerProps) {
  const shown = index === undefined ? undefined : photos[index]
  const total = photos.length

  function move(step: number): void {
    if (index !== undefined) onIndexChange((index + step + total) % total)
  }

  // A finger that goes left brings the next photo, as turning a page does.
  const swipe = useSwipe((direction) => {
    if (total > 1) move(direction === 'left' ? 1 : -1)
  })

  return (
    <Dialog.Root
      open={shown !== undefined}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-900/90" />
        <Dialog.Content
          aria-describedby={undefined}
          onKeyDown={(event) => {
            if (total < 2) return
            if (event.key === 'ArrowLeft') move(-1)
            if (event.key === 'ArrowRight') move(1)
          }}
          {...swipe}
          className="fixed inset-0 z-50 grid touch-pan-y place-items-center p-4 outline-none"
        >
          <Dialog.Title className="sr-only">{strings.title((index ?? 0) + 1, total)}</Dialog.Title>
          {shown !== undefined && (
            <img
              src={shown.url}
              alt={shown.alt}
              className="max-h-full max-w-full rounded-l border-2 border-paper-50 object-contain"
            />
          )}
          {total > 1 && index !== undefined && (
            <span className="absolute top-5 left-4 rounded-pill border-2 border-ink-900 bg-paper-50 px-3.5 py-1 text-body font-bold text-ink-900">
              {strings.counter(index + 1, total)}
            </span>
          )}
          <div className="absolute top-4 right-4">
            <Dialog.Close asChild>
              <IconButton label={strings.close} icon="close" variant="outlined" />
            </Dialog.Close>
          </div>
          {total > 1 && (
            <>
              <button
                type="button"
                aria-label={strings.previous}
                onClick={() => {
                  move(-1)
                }}
                className={`${ARROW} left-3`}
              >
                <Icon name="chevron-left" size={26} strokeWidth={2.6} />
              </button>
              <button
                type="button"
                aria-label={strings.next}
                onClick={() => {
                  move(1)
                }}
                className={`${ARROW} right-3`}
              >
                <Icon name="chevron-right" size={26} strokeWidth={2.6} />
              </button>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
