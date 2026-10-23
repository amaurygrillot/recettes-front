import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useDeleteRecipe } from '../../api/recipes'
import { failureMessage } from '../../app/failureMessage'
import { paths } from '../../app/paths'
import { logger } from '../../lib/logger'

/**
 * Deleting a recipe: ask first, then delete, then leave the page that no longer has anything to
 * show. The question stays up while the request is on its way, so it cannot be sent twice. A recipe
 * that is already gone (404) counts as deleted; any other failure keeps the page and says why, with
 * a way to try again.
 */
export function useRecipeDeletion(recipeId: string) {
  const navigate = useNavigate()
  const deletion = useDeleteRecipe()
  const [asking, setAsking] = useState(false)

  function leave(): void {
    void navigate(paths.search, { replace: true })
  }

  function confirm(): void {
    logger.info('Deleting a recipe')
    deletion.mutate(recipeId, {
      onSuccess: leave,
      onError: (error) => {
        setAsking(false)
        if (error.failure.kind === 'not-found') leave()
      },
    })
  }

  return {
    /** The question (or the request it led to) is on the screen. */
    dialogOpen: asking || deletion.isPending,
    pending: deletion.isPending,
    ask: () => {
      deletion.reset()
      setAsking(true)
    },
    cancel: () => {
      setAsking(false)
    },
    confirm,
    /** What went wrong, once the delete failed and the dialog is closed. */
    failure: deletion.error === null ? undefined : failureMessage(deletion.error.failure),
  }
}
