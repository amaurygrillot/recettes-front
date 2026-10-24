import type { ReactNode } from 'react'
import { useParams } from 'react-router'
import { useRecipe } from '../../api/recipes'
import { paths } from '../../app/paths'
import { RecipeProblem } from '../../app/RecipeProblem/RecipeProblem'
import { toRecipeView } from '../../app/recipeView'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { LinkButton } from '../../components/LinkButton/LinkButton'
import { BowlIllustration } from '../../components/BowlIllustration/BowlIllustration'
import { LoadingRegion } from '../../components/LoadingRegion/LoadingRegion'
import { Skeleton } from '../../components/Skeleton/Skeleton'
import { Cooking } from './components/Cooking/Cooking'
import { strings } from './strings'

/** A page of its own, in the colours of the recipe page, for what is not the cooking itself. */
function Plain({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-140 flex-col justify-center gap-4 px-4 py-6">
      {children}
    </main>
  )
}

/**
 * `/recettes/:id/pas-a-pas`: a recipe cooked one step at a time, open to anyone who has the link (like
 * the recipe). It loads the recipe and shows the mode; a recipe that is not there, that cannot be
 * loaded or that has no step is said on a page of its own, since the mode is never opened empty.
 */
export function CookingScreen() {
  const { id = '' } = useParams()
  const recipe = useRecipe(id)

  if (recipe.isPending) {
    return (
      <Plain>
        <LoadingRegion label={strings.loading}>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-14 w-1/2 rounded-l" />
            <Skeleton className="size-26 rounded-full" />
            <Skeleton className="h-32 w-full rounded-l" />
          </div>
        </LoadingRegion>
      </Plain>
    )
  }

  if (recipe.isError) {
    return (
      <Plain>
        <RecipeProblem
          failure={recipe.error.failure}
          retry={() => {
            void recipe.refetch()
          }}
        />
      </Plain>
    )
  }

  const view = toRecipeView(recipe.data)
  if (view === undefined) {
    return (
      <Plain>
        <RecipeProblem
          failure={{ kind: 'unexpected', status: undefined, detail: undefined }}
          retry={() => {
            void recipe.refetch()
          }}
        />
      </Plain>
    )
  }

  if (view.steps.length === 0) {
    return (
      <Plain>
        <EmptyState
          illustration={<BowlIllustration variant="no-result" size="compact" />}
          title={strings.noSteps.title}
          description={strings.noSteps.description}
          size="compact"
          headingLevel={1}
        >
          <LinkButton to={paths.recipe(view.id)} fullWidth>
            {strings.noSteps.action}
          </LinkButton>
        </EmptyState>
      </Plain>
    )
  }

  // Keyed by the recipe: another address starts again from its own step.
  return <Cooking key={view.id} recipe={view} />
}
