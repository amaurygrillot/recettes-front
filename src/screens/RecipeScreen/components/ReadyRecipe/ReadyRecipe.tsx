import type { ReactNode } from 'react'
import { useSession } from '../../../../api/session'
import { canManageRecipe } from '../../../../app/navigation'
import { useRecipeDeletion } from '../../../../app/useRecipeDeletion'
import { AdviceNote } from '../../../../components/AdviceNote/AdviceNote'
import { DeleteRecipeDialog } from '../../../../components/DeleteRecipeDialog/DeleteRecipeDialog'
import { DeletionFailureBanner } from '../../../../components/DeletionFailureBanner/DeletionFailureBanner'
import { PhotoSlider } from '../../../../components/PhotoSlider/PhotoSlider'
import { DESKTOP_QUERY } from '../../../../lib/breakpoints'
import { useMediaQuery } from '../../../../lib/useMediaQuery'
import type { RecipeView } from '../../../../app/recipeView'
import { strings } from '../../strings'
import { CookingEntry } from '../CookingEntry/CookingEntry'
import { IngredientsSection } from '../IngredientsSection/IngredientsSection'
import { ManageButtons } from '../ManageRecipe/ManageButtons'
import { ManageMenu } from '../ManageRecipe/ManageMenu'
import { RecipeHeading } from '../RecipeHeading/RecipeHeading'
import { StepsSection } from '../StepsSection/StepsSection'

export interface ReadyRecipeProps {
  recipe: RecipeView
  /** The way back, drawn over the photo. */
  backButton: ReactNode
}

/**
 * A recipe that has arrived: the photos, the title block, the ingredients with the way into
 * step-by-step cooking, the preparation and the cook's tip. The same content for everybody; only
 * the author and an administrator also see how to change or delete it.
 */
export function ReadyRecipe({ recipe, backButton }: ReadyRecipeProps) {
  const desktop = useMediaQuery(DESKTOP_QUERY)
  const mayManage = canManageRecipe(useSession(), recipe.authorId)
  const deletion = useRecipeDeletion(recipe.id)

  return (
    <>
      {deletion.failure !== undefined && (
        <div className="mb-5.5">
          <DeletionFailureBanner cause={deletion.failure} onRetry={deletion.confirm} />
        </div>
      )}
      <div className="flex flex-col gap-5.5 desktop:gap-9">
        <div className="grid gap-5.5 desktop:grid-cols-12 desktop:gap-x-6">
          <div className="desktop:col-span-7">
            <PhotoSlider
              photos={recipe.photos}
              label={strings.gallery}
              leading={backButton}
              trailing={
                mayManage && !desktop ? (
                  <ManageMenu recipeId={recipe.id} onDelete={deletion.ask} />
                ) : undefined
              }
            />
          </div>
          <div className="desktop:col-span-5">
            <RecipeHeading
              recipe={recipe}
              actions={
                mayManage && desktop ? (
                  <ManageButtons recipeId={recipe.id} onDelete={deletion.ask} />
                ) : undefined
              }
            />
          </div>
        </div>
        <div className="grid gap-5.5 desktop:grid-cols-12 desktop:gap-x-6">
          <div className="flex flex-col gap-4.5 desktop:sticky desktop:top-6 desktop:col-span-5 desktop:self-start">
            {recipe.ingredientGroups.length > 0 && (
              <IngredientsSection groups={recipe.ingredientGroups} />
            )}
            <CookingEntry recipeId={recipe.id} stepCount={recipe.steps.length} />
          </div>
          <div className="max-w-reading desktop:col-span-7">
            <StepsSection steps={recipe.steps} />
            {recipe.advice !== undefined && (
              <div className="mt-5.5">
                <AdviceNote
                  html={recipe.advice}
                  title={strings.advice.title}
                  label={strings.advice.label}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <DeleteRecipeDialog
        open={deletion.dialogOpen}
        recipeTitle={recipe.title}
        busy={deletion.pending}
        onCancel={deletion.cancel}
        onConfirm={deletion.confirm}
      />
    </>
  )
}
