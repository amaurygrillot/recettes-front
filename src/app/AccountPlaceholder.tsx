import { useNavigate } from 'react-router'
import { signOut } from '../api/session'
import { Button } from '../components/Button/Button'
import { paths } from './paths'
import { ScreenPlaceholder } from './ScreenPlaceholder'
import { strings } from './strings'

/** The account page is not built yet, but a member must be able to log out: that part is real. */
export function AccountPlaceholder() {
  const navigate = useNavigate()

  return (
    <ScreenPlaceholder title={strings.placeholder.account}>
      <Button
        variant="secondary"
        icon="log-out"
        onClick={() => {
          signOut()
          void navigate(paths.home)
        }}
      >
        {strings.placeholder.logout}
      </Button>
    </ScreenPlaceholder>
  )
}
