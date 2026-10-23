import { useLocation, useNavigate } from 'react-router'
import { signOut, useSession } from '../api/session'
import { AlertDialog } from '../components/AlertDialog/AlertDialog'
import { Button } from '../components/Button/Button'
import { logger } from '../lib/logger'
import { loginPath } from './paths'
import { strings } from './strings'

const { sessionExpired } = strings

/**
 * Tells a member that the back end refused their token, and takes them to the login screen with
 * the page they were on as the way back. It has one answer and no way out: without a session
 * nothing they could do here would be saved. The page stays mounted behind it, so nothing typed is lost.
 */
export function SessionExpiredDialog() {
  const session = useSession()
  const location = useLocation()
  const navigate = useNavigate()

  function reconnect() {
    logger.info('Sending the member to log in again', { path: location.pathname })
    signOut()
    void navigate(loginPath(`${location.pathname}${location.search}${location.hash}`))
  }

  return (
    <AlertDialog
      open={session.status === 'expired'}
      icon="lock"
      title={sessionExpired.title}
      description={sessionExpired.description}
    >
      <Button fullWidth onClick={reconnect}>
        {sessionExpired.reconnect}
      </Button>
    </AlertDialog>
  )
}
