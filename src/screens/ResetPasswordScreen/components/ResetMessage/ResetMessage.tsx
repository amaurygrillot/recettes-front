import { paths } from '../../../../app/paths'
import { AuthFrame } from '../../../../components/AuthFrame/AuthFrame'
import { LinkButton } from '../../../../components/LinkButton/LinkButton'
import { StateBadge } from '../../../../components/StateBadge/StateBadge'
import { useFocusOnMount } from '../../../../lib/useFocusOnMount'
import { strings } from '../../strings'

export interface ResetMessageProps {
  /** `done`: the password is changed. `invalid-link`: the link cannot be used, whatever the reason. */
  kind: 'done' | 'invalid-link'
}

/**
 * The two screens that end the reset: the success (no automatic sign-in: the member signs in
 * themselves) and the one state for every link that does not work. Neither has a way back: the
 * member came from an e-mail.
 */
export function ResetMessage({ kind }: ResetMessageProps) {
  // The form that had the focus is gone: the message starts from its title.
  const heading = useFocusOnMount<HTMLHeadingElement>()
  const titleProps = {
    ref: heading,
    tabIndex: -1,
    className: 'text-center font-title text-auth-state-title outline-none',
  }

  if (kind === 'done') {
    return (
      <AuthFrame layout="form">
        <StateBadge tone="success" icon="check-circle" />
        <h1 {...titleProps}>{strings.done.title}</h1>
        <p role="status" className="text-center text-body text-ink-800">
          {strings.done.text}
        </p>
        <LinkButton to={paths.login} fullWidth>
          {strings.done.signIn}
        </LinkButton>
      </AuthFrame>
    )
  }

  return (
    <AuthFrame layout="form">
      <StateBadge tone="error" icon="warning" />
      <h1 {...titleProps}>{strings.invalidLink.title}</h1>
      <p role="alert" className="text-center text-body text-ink-800">
        {strings.invalidLink.text}
      </p>
      <LinkButton to={paths.forgotPassword} fullWidth>
        {strings.invalidLink.askAgain}
      </LinkButton>
    </AuthFrame>
  )
}
