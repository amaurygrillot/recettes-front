import { Mascot } from '../Mascot/Mascot'
import { strings } from './strings'

/**
 * The 4:3 frame of a recipe that has no photo: the dejected mascot on calm stripes, with her words. Gentler than an
 * empty frame, and it makes one want to add the picture. Fills the frame it is put in.
 */
export function NoPhoto() {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-0.5 overflow-hidden bg-paper-stripes">
      {/* Her drawing has an empty margin below: pulling the words into it keeps both whole in the smallest cards. */}
      <div className="-mb-3">
        <Mascot mood="dejected" size="large" />
      </div>
      <p className="font-hand text-annotation text-mustard-700">{strings.message}</p>
    </div>
  )
}
