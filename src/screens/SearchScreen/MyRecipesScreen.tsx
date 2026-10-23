import { useSession } from '../../api/session'
import { RecipeSearch } from './RecipeSearch'

/**
 * `/mes-recettes`: the same search, with the author fixed to the member. Nothing is shown without
 * a member (a session that has just ended): the list would otherwise be everybody's under this title.
 */
export function MyRecipesScreen() {
  const session = useSession()
  if (session.status !== 'member') return null
  return <RecipeSearch scope={{ kind: 'mine', authorId: session.userId }} />
}
