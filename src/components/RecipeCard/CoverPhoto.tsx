import { useState } from 'react'
import { Icon } from '../Icon/Icon'
import { NoPhoto } from '../NoPhoto/NoPhoto'

export interface CoverPhotoProps {
  /** The picture's address; none for a recipe without a photo. */
  url: string | undefined
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

/**
 * The 4:3 frame of a card. A recipe without a photo gets the mascot, one whose photo cannot be loaded the butter
 * stripes and a cutlery: the same frame, never a gap or a broken-image icon. The picture is decoration (the
 * title says what the recipe is), so it has no text alternative.
 */
export function CoverPhoto({ url }: CoverPhotoProps) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="aspect-4/3 border-b-2 border-ink-900">
      {url === undefined && <NoPhoto />}
      {url !== undefined && failed && <BrokenPhoto />}
      {url !== undefined && !failed && (
        <img
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => {
            setFailed(true)
          }}
          className="size-full object-cover"
        />
      )}
    </div>
  )
}
