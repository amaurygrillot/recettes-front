import { AlertDialog } from '../../../../components/AlertDialog/AlertDialog'
import { Button } from '../../../../components/Button/Button'
import { strings } from '../../strings'

export interface DiscardDraftDialogProps {
  open: boolean
  onKeep: () => void
  onDiscard: () => void
}

const { draft } = strings

/**
 * « Recommencer » erases the draft of the device, the only thing of the editor that cannot be
 * undone: so it is asked, and the brick button is the second one. The first, the safe one, takes the focus.
 */
export function DiscardDraftDialog({ open, onKeep, onDiscard }: DiscardDraftDialogProps) {
  return (
    <AlertDialog
      open={open}
      icon="trash"
      title={draft.discardTitle}
      description={draft.discardText}
    >
      <Button variant="secondary" fullWidth onClick={onKeep}>
        {draft.keep}
      </Button>
      <Button variant="danger" fullWidth onClick={onDiscard}>
        {draft.discard}
      </Button>
    </AlertDialog>
  )
}
