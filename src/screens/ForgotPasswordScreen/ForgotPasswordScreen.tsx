import { paths } from '../../app/paths'
import { strings as appStrings } from '../../app/strings'
import { AuthFrame } from '../../components/AuthFrame/AuthFrame'
import { Button } from '../../components/Button/Button'
import { ErrorBanner } from '../../components/ErrorBanner/ErrorBanner'
import { LinkButton } from '../../components/LinkButton/LinkButton'
import { SubmitButton } from '../../components/SubmitButton/SubmitButton'
import { TextField } from '../../components/TextField/TextField'
import { MailSent } from './components/MailSent/MailSent'
import { strings } from './strings'
import { useForgotPassword } from './useForgotPassword'

const { auth } = appStrings

/**
 * `/mot-de-passe-oublie`: one sentence, one field. Only the shape of the address is checked, and the
 * confirmation that follows is the same for every address.
 */
export function ForgotPasswordScreen() {
  const { register, errors, isPending, failureText, canRetry, submit, sent } = useForgotPassword()

  if (sent !== undefined) {
    return (
      <MailSent
        resendIn={sent.resendIn}
        resend={sent.resend}
        failureText={failureText}
        isPending={isPending}
      />
    )
  }

  return (
    <AuthFrame
      layout="form"
      back={{ to: paths.login, label: auth.back }}
      onSubmit={(event) => void submit(event)}
    >
      <h1 className="font-title text-page-title-lg">{strings.title}</h1>
      <p className="text-body text-ink-800">{strings.intro}</p>
      {failureText && (
        <ErrorBanner message={failureText}>
          {canRetry && (
            <Button variant="secondary" size="medium" onClick={() => void submit()}>
              {strings.retry}
            </Button>
          )}
        </ErrorBanner>
      )}
      <TextField
        label={auth.emailLabel}
        type="email"
        inputMode="email"
        placeholder={strings.emailPlaceholder}
        autoComplete="email"
        disabled={isPending}
        error={errors.email?.message}
        {...register('email')}
      />
      <div className="mt-1.5">
        <SubmitButton
          pending={isPending}
          label={strings.submit}
          pendingLabel={strings.submitting}
        />
      </div>
      <LinkButton to={paths.login} variant="quiet" size="medium" fullWidth>
        {auth.backToLogin}
      </LinkButton>
    </AuthFrame>
  )
}
