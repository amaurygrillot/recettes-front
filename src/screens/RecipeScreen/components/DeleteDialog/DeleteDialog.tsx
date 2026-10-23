import { AlertDialog } from '../../../../components/AlertDialog/AlertDialog'
import { Button } from '../../../../components/Button/Button'
import { strings } from '../../strings'

export interface DeleteDialogProps {
  open: boolean
  /** Named in the text, so nobody deletes the wrong recipe. */
  recipeTitle: string
  /** The request is on its way: the answer cannot change any more. */
  busy: boolean
  onCancel: () => void
  onConfirm: () => void
}

/**
 * Asks once before a recipe goes for good. « Annuler » comes first and takes the focus, so Enter
 * on a dialog that just opened never deletes anything; « Supprimer la recette » is the brick button
 * that only a confirmation uses.
 */
export function DeleteDialog({ open, recipeTitle, busy, onCancel, onConfirm }: DeleteDialogProps) {
  return (
    <AlertDialog
      open={open}
      icon="trash"
      title={strings.deletion.title}
      description={strings.deletion.description(recipeTitle)}
    >
      <Button variant="secondary" fullWidth disabled={busy} onClick={onCancel}>
        {strings.deletion.cancel}
      </Button>
      <Button variant="danger" fullWidth busy={busy} onClick={onConfirm}>
        {strings.deletion.confirm}
      </Button>
    </AlertDialog>
  )
}
