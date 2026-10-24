import { AlertDialog } from '../../../../components/AlertDialog/AlertDialog'
import { Button } from '../../../../components/Button/Button'
import { strings } from '../../strings'

export interface QuitDialogProps {
  open: boolean
  onStay: () => void
  onQuit: () => void
}

const { quitDialog } = strings

/**
 * Asked before leaving the step-by-step mode. Nothing is lost (the step is remembered), so there is no
 * brick button: « Rester », the safe answer, comes first and takes the focus, « Quitter » is the primary one.
 */
export function QuitDialog({ open, onStay, onQuit }: QuitDialogProps) {
  return (
    <AlertDialog open={open} icon="log-out" title={quitDialog.title} description={quitDialog.text}>
      <Button variant="secondary" fullWidth onClick={onStay}>
        {quitDialog.stay}
      </Button>
      <Button fullWidth onClick={onQuit}>
        {quitDialog.leave}
      </Button>
    </AlertDialog>
  )
}
