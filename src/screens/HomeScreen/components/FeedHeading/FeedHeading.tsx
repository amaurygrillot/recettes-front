import { paths } from '../../../../app/paths'
import { strings as appStrings } from '../../../../app/strings'
import { CreateLink } from '../../../../components/CreateLink/CreateLink'
import { strings } from '../../strings'

export interface FeedHeadingProps {
  /** Offer « Nouvelle recette » beside the title (a desktop; on a phone the shell's « + » does it). */
  mayCreate: boolean
}

/** « Fraîchement ajoutées » with its handwritten note, and on a desktop the way to add a recipe. */
export function FeedHeading({ mayCreate }: FeedHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <h2 className="font-title text-page-title desktop:text-page-title-lg">
          {strings.feed.title}
        </h2>
        <p className="mt-0.5 font-hand text-annotation-sm text-mustard-700">
          {strings.feed.subtitle}
        </p>
      </div>
      {mayCreate && (
        <div className="hidden flex-none desktop:block">
          <CreateLink to={paths.newRecipe} label={appStrings.navigation.newRecipe} expanded />
        </div>
      )}
    </div>
  )
}
