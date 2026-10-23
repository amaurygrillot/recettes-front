import { paths } from '../../../../app/paths'
import { strings as appStrings } from '../../../../app/strings'
import { AuthFrame } from '../../../../components/AuthFrame/AuthFrame'
import { Button } from '../../../../components/Button/Button'
import { ErrorBanner } from '../../../../components/ErrorBanner/ErrorBanner'
import { LinkButton } from '../../../../components/LinkButton/LinkButton'
import { StateBadge } from '../../../../components/StateBadge/StateBadge'
import { useFocusOnMount } from '../../../../lib/useFocusOnMount'
import { strings } from '../../strings'

export interface MailSentProps {
  /** Seconds before another e-mail may be asked for; 0 when it may be now. */
  resendIn: number
  resend: () => void
  /** The sentence of what went wrong when asking again, if it did. */
  failureText: string | undefined
  isPending: boolean
}

const { sent } = strings

/**
 * « Regarde ta boîte mail »: the same words for every address. Asking for another e-mail waits for
 * a written countdown (a timer, so a screen reader can read it but is not interrupted by it).
 */
export function MailSent({ resendIn, resend, failureText, isPending }: MailSentProps) {
  const waiting = resendIn > 0
  // The form that had the focus is gone: the confirmation starts from its title.
  const heading = useFocusOnMount<HTMLHeadingElement>()

  return (
    <AuthFrame layout="form" back={{ to: paths.login, label: appStrings.auth.back }}>
      <StateBadge tone="neutral" icon="mail" />
      <h1
        ref={heading}
        tabIndex={-1}
        className="text-center font-title text-auth-state-title outline-none"
      >
        {sent.title}
      </h1>
      <p role="status" className="text-center text-body text-ink-800">
        {sent.text}
      </p>
      {failureText && <ErrorBanner message={failureText} />}
      <Button
        variant="secondary"
        size="medium"
        fullWidth
        icon={waiting ? undefined : 'mail'}
        busy={isPending}
        disabled={waiting}
        onClick={resend}
      >
        {sent.resend}
        {waiting && (
          <>
            {' '}
            <span role="timer" className="font-normal">
              {sent.wait(resendIn)}
            </span>
          </>
        )}
      </Button>
      <LinkButton to={paths.login} variant="quiet" size="medium" fullWidth>
        {appStrings.auth.backToLogin}
      </LinkButton>
    </AuthFrame>
  )
}
