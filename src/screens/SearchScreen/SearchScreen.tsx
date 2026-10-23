import { RecipeSearch } from './RecipeSearch'
import type { SearchScope } from './recipeFilters'

const EVERYBODY: SearchScope = { kind: 'all' }

/** `/rechercher`: search through everybody's recipes. */
export function SearchScreen() {
  return <RecipeSearch scope={EVERYBODY} />
}
