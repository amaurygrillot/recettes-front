import { paths } from '../../app/paths'
import { strings as appStrings } from '../../app/strings'
import { AuthFrame } from '../../components/AuthFrame/AuthFrame'
import { ErrorBanner } from '../../components/ErrorBanner/ErrorBanner'
import { LinkButton } from '../../components/LinkButton/LinkButton'
import { PasswordField } from '../../components/PasswordField/PasswordField'
import { SubmitButton } from '../../components/SubmitButton/SubmitButton'
import { TextField } from '../../components/TextField/TextField'
import { strings } from './strings'
import { useLoginForm } from './useLoginForm'

const { auth } = appStrings

/**
 * Logs in, then returns to the page that asked for it. A task of its own: the seal on a butter
 * band (beside the form on a desktop), no tabs, and one message on top when the login is refused.
 */
export function LoginScreen() {
  const { register, errors, isPending, failureText, rejected, submit } = useLoginForm()

  return (
    <AuthFrame layout="login" onSubmit={(event) => void submit(event)}>
      <h1 className="font-title text-page-title-lg desktop:text-auth-title-lg">{strings.title}</h1>
      {failureText && <ErrorBanner message={failureText} />}
      <TextField
        label={auth.usernameLabel}
        autoComplete="username"
        autoCapitalize="none"
        disabled={isPending}
        error={errors.username?.message}
        {...register('username')}
      />
      <PasswordField
        label={auth.passwordLabel}
        autoComplete="current-password"
        disabled={isPending}
        // A refused login frames the password, the field the person will retype; the banner says why.
        invalid={rejected}
        error={errors.password?.message}
        {...register('password')}
      />
      <div className="mt-1.5 flex flex-col gap-4 desktop:flex-row desktop:items-center desktop:gap-3">
        <div className="desktop:flex-1">
          <SubmitButton
            pending={isPending}
            label={strings.submit}
            pendingLabel={strings.submitting}
          />
        </div>
        <LinkButton to={paths.forgotPassword} variant="quiet" size="medium">
          {auth.forgotPassword}
        </LinkButton>
      </div>
      <hr className="border-t-2 border-dashed border-ink-500" />
      <LinkButton to={paths.register} variant="secondary" size="medium" fullWidth>
        {strings.register}
      </LinkButton>
    </AuthFrame>
  )
}
