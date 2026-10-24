import { useRef, type ChangeEvent, type ReactNode } from 'react'
import { ACCEPT } from '../../photoUpload'
import { strings } from '../../strings'

export interface PhotoPick {
  /** Opens the camera of the phone (a desktop opens its file chooser instead). */
  takePhoto: () => void
  /** Opens the gallery, where several pictures can be chosen at once. */
  chooseFromGallery: () => void
}

/**
 * The two file choosers behind « Prendre une photo » and « Galerie ». A browser can only open one
 * from a real input, which has to stay on the page until the file is handed over: `inputs` goes
 * where it will not be removed (not in a sheet that closes as soon as a choice is made).
 */
export function usePhotoPicker(onFiles: (files: readonly File[]) => void): {
  pick: PhotoPick
  inputs: ReactNode
} {
  const camera = useRef<HTMLInputElement>(null)
  const gallery = useRef<HTMLInputElement>(null)

  function handOver(event: ChangeEvent<HTMLInputElement>): void {
    const files = Array.from(event.target.files ?? [])
    // Emptied, so that choosing the same picture again (after removing it) is heard.
    event.target.value = ''
    if (files.length > 0) onFiles(files)
  }

  return {
    pick: {
      takePhoto: () => camera.current?.click(),
      chooseFromGallery: () => gallery.current?.click(),
    },
    inputs: (
      <>
        <input
          ref={camera}
          type="file"
          accept={ACCEPT}
          capture="environment"
          aria-label={strings.photos.cameraInput}
          tabIndex={-1}
          className="hidden"
          onChange={handOver}
        />
        <input
          ref={gallery}
          type="file"
          accept={ACCEPT}
          multiple
          aria-label={strings.photos.galleryInput}
          tabIndex={-1}
          className="hidden"
          onChange={handOver}
        />
      </>
    ),
  }
}
