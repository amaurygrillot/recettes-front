import { useParams } from 'react-router'
import { useRecipe } from '../../api/recipes'
import { useCreateButtonMode } from '../../app/createButtonMode'
import { paths } from '../../app/paths'
import { RecipeProblem } from '../../app/RecipeProblem/RecipeProblem'
import { useGoBack } from '../../app/useGoBack'
import { IconButton } from '../../components/IconButton/IconButton'
import { ReadyRecipe } from './components/ReadyRecipe/ReadyRecipe'
import { RecipeSkeleton } from './components/RecipeSkeleton/RecipeSkeleton'
import { toRecipeView } from '../../app/recipeView'
import { strings } from './strings'

/**
 * `/recettes/:id`: a recipe, for whoever follows the link. Loading, a recipe that does not exist,
 * a failure and the recipe itself each have their own state; the way back is always there.
 */
export function RecipeScreen() {
  const { id = '' } = useParams()
  const recipe = useRecipe(id)
  const goBack = useGoBack(paths.search)
  // The page has its own actions; the shell's « + » would only cover the cook's tip.
  useCreateButtonMode('hidden')

  const backButton = (
    <IconButton label={strings.back} icon="chevron-left" variant="round" onClick={goBack} />
  )

  if (recipe.isPending) {
    return (
      <main className="mx-auto max-w-160 py-4 desktop:max-w-none desktop:py-8">
        <div className="mb-4">{backButton}</div>
        <RecipeSkeleton />
      </main>
    )
  }

  if (recipe.isError) {
    return (
      <main className="mx-auto flex max-w-140 flex-col gap-4 py-4 desktop:py-8">
        {backButton}
        <RecipeProblem
          failure={recipe.error.failure}
          retry={() => {
            void recipe.refetch()
          }}
        />
      </main>
    )
  }

  const view = toRecipeView(recipe.data)
  return (
    <main className="mx-auto max-w-160 py-4 pb-8 desktop:max-w-none desktop:py-8 desktop:pb-12">
      {view === undefined ? (
        <RecipeProblem
          failure={{ kind: 'unexpected', status: undefined, detail: undefined }}
          retry={() => {
            void recipe.refetch()
          }}
        />
      ) : (
        <ReadyRecipe recipe={view} backButton={backButton} />
      )}
    </main>
  )
}
