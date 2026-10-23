import { useSession } from '../../api/session'
import { useCreateButtonMode, type CreateButtonMode } from '../../app/createButtonMode'
import { canCreateRecipes } from '../../app/navigation'
import { isNarrowed } from '../../app/searchCriteria'
import { DESKTOP_QUERY } from '../../lib/breakpoints'
import { useMediaQuery } from '../../lib/useMediaQuery'
import { DesktopLayout } from './components/DesktopLayout/DesktopLayout'
import { PhoneLayout } from './components/PhoneLayout/PhoneLayout'
import type { SearchScope } from './recipeFilters'
import { useSearchPage } from './useSearchPage'

/**
 * « Mes recettes » is where recipes are written: its « + » shows its label at the top of the list,
 * and gives way to the empty state's own button when there is nothing yet. Elsewhere it is round.
 */
function createButtonModeFor(scope: SearchScope, emptyAndUnfiltered: boolean): CreateButtonMode {
  if (scope.kind === 'all') return 'round'
  return emptyAndUnfiltered ? 'hidden' : 'extends-at-top'
}

export interface RecipeSearchProps {
  scope: SearchScope
}

/**
 * Search through the recipes, everybody's or the member's own: the same screen, with the same
 * criteria in the address, laid out for a desktop or for a phone and a tablet.
 */
export function RecipeSearch({ scope }: RecipeSearchProps) {
  const desktop = useMediaQuery(DESKTOP_QUERY)
  const mayCreate = canCreateRecipes(useSession())
  const page = useSearchPage(scope)

  const { feed, criteria } = page
  useCreateButtonMode(createButtonModeFor(scope, feed.status === 'empty' && !isNarrowed(criteria)))

  return desktop ? (
    <DesktopLayout page={page} scope={scope} mayCreate={mayCreate} />
  ) : (
    <PhoneLayout page={page} scope={scope} />
  )
}
