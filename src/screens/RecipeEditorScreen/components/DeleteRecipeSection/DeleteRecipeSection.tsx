import { useRecipeDeletion } from '../../../../app/useRecipeDeletion'
import { DeleteRecipeDialog } from '../../../../components/DeleteRecipeDialog/DeleteRecipeDialog'
import { DeletionFailureBanner } from '../../../../components/DeletionFailureBanner/DeletionFailureBanner'
import { Icon } from '../../../../components/Icon/Icon'
import { strings } from '../../strings'

export interface DeleteRecipeSectionProps {
  recipeId: string
  /** The title the recipe is stored with: named in the question, so nobody deletes the wrong one. */
  recipeTitle: string
}

/**
 * The end of the page of a recipe being changed: a link in brick, underlined, far from « Enregistrer ».
 * It is not a button: deleting is not offered as an ordinary action, and it asks before anything goes.
 */
export function DeleteRecipeSection({ recipeId, recipeTitle }: DeleteRecipeSectionProps) {
  const deletion = useRecipeDeletion(recipeId)

  return (
    <div className="flex flex-col items-start gap-3 pb-2">
      {deletion.failure !== undefined && (
        <DeletionFailureBanner cause={deletion.failure} onRetry={deletion.confirm} />
      )}
      <button
        type="button"
        onClick={deletion.ask}
        className="inline-flex min-h-14 cursor-pointer items-center gap-2 rounded-m text-label font-bold text-brick underline decoration-2 underline-offset-4 focus-visible:outline-offset-2"
      >
        <Icon name="trash" size={24} strokeWidth={2.4} />
        {strings.deleteLink}
      </button>
      <DeleteRecipeDialog
        open={deletion.dialogOpen}
        recipeTitle={recipeTitle}
        busy={deletion.pending}
        onCancel={deletion.cancel}
        onConfirm={deletion.confirm}
      />
    </div>
  )
}
