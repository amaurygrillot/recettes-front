import { paths } from '../../../../app/paths'
import { AuthFrame } from '../../../../components/AuthFrame/AuthFrame'
import { Button } from '../../../../components/Button/Button'
import { ErrorBanner } from '../../../../components/ErrorBanner/ErrorBanner'
import { Icon } from '../../../../components/Icon/Icon'
import { LinkButton } from '../../../../components/LinkButton/LinkButton'
import { Spinner } from '../../../../components/Spinner/Spinner'
import { useFocusOnMount } from '../../../../lib/useFocusOnMount'
import type { WelcomeState } from '../../useRegistration'
import { strings } from '../../strings'

export interface WelcomeViewProps {
  username: string
  state: WelcomeState
}

const { welcome } = strings

/**
 * What a new member sees once the account exists: « Bienvenue, odile74 ! » while the app signs
 * them in with what they just typed, then the way into the recipes. If that sign-in fails, the
 * account is still theirs and the way in is the sign-in page.
 */
export function WelcomeView({ username, state }: WelcomeViewProps) {
  // The form that had the focus is gone: the welcome starts from its title.
  const heading = useFocusOnMount<HTMLHeadingElement>()

  return (
    <AuthFrame layout="welcome">
      <div className="flex flex-col gap-1.5">
        <h1 ref={heading} tabIndex={-1} className="font-title text-auth-state-title outline-none">
          {welcome.title(username)}
        </h1>
        <p
          aria-hidden="true"
          className="mt-1.5 origin-left -rotate-2 font-hand text-annotation-lg text-mustard-700"
        >
          {welcome.handwritten}
        </p>
      </div>
      <p className="text-body text-ink-800">{welcome.text}</p>
      <div role="status" className="text-body text-ink-800">
        {state === 'connecting' && (
          <p className="flex items-center gap-2.5">
            <Spinner size={22} />
            {welcome.connecting}
          </p>
        )}
        {state === 'connected' && (
          <p className="flex items-center gap-2 font-bold text-herb">
            <Icon name="check-circle" size={24} strokeWidth={2.4} />
            {welcome.connected}
          </p>
        )}
      </div>
      {state === 'failed' && <ErrorBanner message={welcome.notConnected} />}
      <div className="mt-1.5">
        {state === 'connecting' && (
          <Button fullWidth busy>
            {welcome.connectingButton}
          </Button>
        )}
        {state === 'connected' && (
          <LinkButton to={paths.home} fullWidth>
            {welcome.discover}
          </LinkButton>
        )}
        {state === 'failed' && (
          <LinkButton to={paths.login} fullWidth>
            {welcome.signIn}
          </LinkButton>
        )}
      </div>
    </AuthFrame>
  )
}
