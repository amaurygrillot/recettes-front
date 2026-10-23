import { AlertDialog } from '../../../../components/AlertDialog/AlertDialog'
import { Button } from '../../../../components/Button/Button'
import { strings } from '../../strings'

export interface LogoutDialogProps {
  open: boolean
  onStay: () => void
  onConfirm: () => void
}

const { logout } = strings

/**
 * Asks before signing out. Signing out destroys nothing, so the badge is butter, not brick, and the
 * safe answer, « Rester connecté », is the primary button and takes the focus.
 */
export function LogoutDialog({ open, onStay, onConfirm }: LogoutDialogProps) {
  return (
    <AlertDialog open={open} icon="log-out" title={logout.title} description={logout.description}>
      <Button fullWidth onClick={onStay}>
        {logout.stay}
      </Button>
      <Button variant="secondary" fullWidth onClick={onConfirm}>
        {logout.confirm}
      </Button>
    </AlertDialog>
  )
}
