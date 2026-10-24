import { BottomSheet } from '../../../../components/BottomSheet/BottomSheet'
import { Button } from '../../../../components/Button/Button'
import { Icon } from '../../../../components/Icon/Icon'
import { strings } from '../../strings'
import type { PhotoPick } from '../PhotoPicker/usePhotoPicker'

const { photos } = strings

export interface EmptyPhotosProps {
  pick: PhotoPick
  /** A recipe's cover says that its first photo is the cover; a step's photos do not. */
  coverNote: boolean
}

/**
 * Where a list of photos starts, while it has none: the same dashed frame as the rest of the app's
 * upload, a round badge with a camera, what is accepted, and the two ways to give a picture.
 */
export function EmptyPhotos({ pick, coverNote }: EmptyPhotosProps) {
  return (
    <div className="flex flex-col items-center gap-2.5 rounded-xl border-2 border-dashed border-ink-500 bg-paper-50 px-4.5 py-5.5 text-center">
      <span className="grid size-16 place-items-center rounded-full border-2 border-ink-900 bg-butter-200 text-ink-900">
        <Icon name="camera" size={30} strokeWidth={2.2} />
      </span>
      <p className="text-step font-bold">{photos.add}</p>
      <p className="text-detail text-ink-800">
        {photos.formats}
        {coverNote && ` ${photos.coverNote}`}
      </p>
      <div className="mt-1.5 flex w-full gap-3">
        <div className="flex-1">
          <Button icon="camera" size="medium" fullWidth onClick={pick.takePhoto}>
            {photos.takePhoto}
          </Button>
        </div>
        <div className="flex-1">
          <Button
            variant="secondary"
            icon="image"
            size="medium"
            fullWidth
            onClick={pick.chooseFromGallery}
          >
            {photos.gallery}
          </Button>
        </div>
      </div>
    </div>
  )
}

export interface AddPhotoTileProps {
  onClick: () => void
}

/** At the end of the photos: the tile that adds one more. */
export function AddPhotoTile({ onClick }: AddPhotoTileProps) {
  return (
    <button
      type="button"
      aria-label={photos.add}
      onClick={onClick}
      className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-l border-2 border-dashed border-ink-500 bg-paper-50 px-2.5 py-4 text-ink-900 enabled:active:bg-butter-100"
    >
      <span className="grid size-14 place-items-center rounded-full border-2 border-ink-900 bg-butter-200">
        <Icon name="plus" size={28} strokeWidth={2.6} />
      </span>
      <span className="text-center text-body leading-tight font-bold">{photos.add}</span>
    </button>
  )
}

export interface AddPhotoSheetProps {
  open: boolean
  onClose: () => void
  pick: PhotoPick
}

/** The two ways to give a picture, in the sheet from the bottom: it closes as soon as one is chosen. */
export function AddPhotoSheet({ open, onClose, pick }: AddPhotoSheetProps) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
      title={photos.add}
    >
      <div className="flex flex-col gap-3.5 pt-1 pb-2">
        <p className="text-body text-ink-800">{photos.formats}</p>
        <Button
          icon="camera"
          fullWidth
          onClick={() => {
            onClose()
            pick.takePhoto()
          }}
        >
          {photos.takePhoto}
        </Button>
        <Button
          variant="secondary"
          icon="image"
          fullWidth
          onClick={() => {
            onClose()
            pick.chooseFromGallery()
          }}
        >
          {photos.chooseFromGallery}
        </Button>
      </div>
    </BottomSheet>
  )
}
