import { AlertDialog } from '../../../../components/AlertDialog/AlertDialog'
import { Button } from '../../../../components/Button/Button'
import { strings } from '../../strings'

export interface LeaveDialogProps {
  open: boolean
  onStay: () => void
  onLeave: () => void
}

const { leave } = strings

/**
 * Asked when the editor is closed with changes that were not saved. Nothing is destroyed either
 * way (the draft stays on the device), so the answer that goes on writing is the primary one and
 * takes the focus, and « Quitter » is only secondary.
 */
export function LeaveDialog({ open, onStay, onLeave }: LeaveDialogProps) {
  return (
    <AlertDialog open={open} icon="edit" title={leave.title} description={leave.text}>
      <Button fullWidth onClick={onStay}>
        {leave.stay}
      </Button>
      <Button variant="secondary" fullWidth onClick={onLeave}>
        {leave.leave}
      </Button>
    </AlertDialog>
  )
}
