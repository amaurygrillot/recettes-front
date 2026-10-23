import { paths } from '../../app/paths'
import { strings as appStrings } from '../../app/strings'
import { AuthFrame } from '../../components/AuthFrame/AuthFrame'
import { ErrorBanner } from '../../components/ErrorBanner/ErrorBanner'
import { LinkButton } from '../../components/LinkButton/LinkButton'
import { PasswordField } from '../../components/PasswordField/PasswordField'
import { SubmitButton } from '../../components/SubmitButton/SubmitButton'
import { TextField } from '../../components/TextField/TextField'
import { WelcomeView } from './components/WelcomeView/WelcomeView'
import { strings } from './strings'
import { useRegistration } from './useRegistration'

const { auth } = appStrings

/**
 * `/inscription`: five fields on one page (the last two optional), the two conflicts said by the
 * field they are about, then a welcome that signs the new member in.
 */
export function RegisterScreen() {
  const { register, errors, passwordRuleKept, isPending, failureText, submit, welcome } =
    useRegistration()

  if (welcome !== undefined) return <WelcomeView {...welcome} />

  return (
    <AuthFrame
      layout="form"
      back={{ to: paths.login, label: auth.back }}
      onSubmit={(event) => void submit(event)}
    >
      <h1 className="font-title text-page-title-lg">{strings.title}</h1>
      {failureText && <ErrorBanner message={failureText} />}
      <TextField
        label={auth.usernameLabel}
        placeholder={strings.usernamePlaceholder}
        hint={auth.usernameHint}
        autoComplete="username"
        autoCapitalize="none"
        disabled={isPending}
        error={errors.username?.message}
        {...register('username')}
      />
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
      {errors.email?.type === 'server' && (
        <LinkButton to={paths.forgotPassword} variant="quiet" size="medium" fullWidth>
          {auth.forgotPassword}
        </LinkButton>
      )}
      <PasswordField
        label={auth.passwordLabel}
        hint={auth.passwordRule}
        hintMet={passwordRuleKept}
        autoComplete="new-password"
        disabled={isPending}
        error={errors.password?.message}
        {...register('password')}
      />
      <TextField
        label={strings.firstname}
        note={strings.optional}
        placeholder={strings.firstnamePlaceholder}
        autoComplete="given-name"
        disabled={isPending}
        {...register('firstname')}
      />
      <TextField
        label={strings.lastname}
        note={strings.optional}
        placeholder={strings.lastnamePlaceholder}
        autoComplete="family-name"
        disabled={isPending}
        {...register('lastname')}
      />
      <div className="mt-1.5">
        <SubmitButton
          pending={isPending}
          label={strings.submit}
          pendingLabel={strings.submitting}
        />
      </div>
      <LinkButton to={paths.login} variant="quiet" size="medium" fullWidth>
        {strings.hasAccount}
      </LinkButton>
    </AuthFrame>
  )
}
