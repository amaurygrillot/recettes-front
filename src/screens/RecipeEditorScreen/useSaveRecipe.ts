import { useState } from 'react'
import { isTransient, type ApiRequestError } from '../../api/failure'
import { useCreateRecipe, useUpdateRecipe } from '../../api/recipes'
import { failureMessage } from '../../app/failureMessage'
import { useToasts } from '../../app/useToasts'
import { logger } from '../../lib/logger'
import type { EditorValues } from './editorModel'
import { createRequestFrom, updateRequestFrom } from './editorRequest'
import { strings } from './strings'

/**
 * Why the recipe cannot be saved at all, which is a page and not a message: the member may not
 * change it (`forbidden`, a 403) or it is not there any more (`gone`, a 404 on an update).
 */
export type Refusal = 'forbidden' | 'gone'

export interface SaveRecipe {
  save: (values: EditorValues) => void
  pending: boolean
  /** The id of the recipe once it is stored: the editor then leaves for it. */
  savedId: string | undefined
  refusal: Refusal | undefined
}

/**
 * Sends the recipe: creates it, or replaces what an existing one holds. A refusal that no
 * message could mend is a `refusal`; any other failure is a notification that stays until closed,
 * with « Réessayer » when sending the same thing again can work. The form is never emptied.
 */
export function useSaveRecipe(recipeId: string | undefined): SaveRecipe {
  const toasts = useToasts()
  const createRecipe = useCreateRecipe()
  const updateRecipe = useUpdateRecipe()
  const [savedId, setSavedId] = useState<string | undefined>()
  const [refusal, setRefusal] = useState<Refusal | undefined>()

  function save(values: EditorValues): void {
    logger.info(recipeId === undefined ? 'Creating a recipe' : 'Updating a recipe')

    const onSaved = (recipe: { id?: string }) => {
      logger.info('Recipe saved')
      toasts.success(strings.saved)
      setSavedId(recipe.id ?? recipeId)
    }
    const onFailed = ({ failure }: ApiRequestError) => {
      if (recipeId !== undefined && failure.kind === 'forbidden') {
        setRefusal('forbidden')
      } else if (recipeId !== undefined && failure.kind === 'not-found') {
        setRefusal('gone')
      } else {
        toasts.failure({
          message: strings.saveFailure,
          detail: failureMessage(failure),
          retry: isTransient(failure)
            ? () => {
                save(values)
              }
            : undefined,
        })
      }
    }

    if (recipeId === undefined) {
      createRecipe.mutate(createRequestFrom(values), { onSuccess: onSaved, onError: onFailed })
    } else {
      updateRecipe.mutate(
        { id: recipeId, changes: updateRequestFrom(values) },
        { onSuccess: onSaved, onError: onFailed },
      )
    }
  }

  return {
    save,
    pending: createRecipe.isPending || updateRecipe.isPending,
    savedId,
    refusal,
  }
}
