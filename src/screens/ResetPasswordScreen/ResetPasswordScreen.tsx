import { useSearchParams } from 'react-router'
import { strings as appStrings } from '../../app/strings'
import { AuthFrame } from '../../components/AuthFrame/AuthFrame'
import { ErrorBanner } from '../../components/ErrorBanner/ErrorBanner'
import { Icon } from '../../components/Icon/Icon'
import { PasswordField } from '../../components/PasswordField/PasswordField'
import { SubmitButton } from '../../components/SubmitButton/SubmitButton'
import { TextField } from '../../components/TextField/TextField'
import { maskEmail } from '../../lib/maskEmail'
import { ResetMessage } from './components/ResetMessage/ResetMessage'
import { readResetLink, type ResetLink } from './resetLink'
import { strings } from './strings'
import { usePasswordReset } from './usePasswordReset'

const { auth } = appStrings

/**
 * `/reset-password?token=…&email=…` (the path is fixed by the back end's e-mail link): two fields
 * for the new password. A link that is cut short is the same « Ce lien n'est plus valable » as one
 * the server refuses: no empty form.
 */
export function ResetPasswordScreen() {
  const [search] = useSearchParams()
  const link = readResetLink(search)

  if (link === undefined) return <ResetMessage kind="invalid-link" />
  return <NewPasswordForm link={link} />
}

function NewPasswordForm({ link }: { link: ResetLink }) {
  const { register, errors, passwordRuleKept, isPending, submit, outcome, failureText } =
    usePasswordReset(link)

  if (outcome !== undefined) return <ResetMessage kind={outcome} />

  return (
    <AuthFrame layout="form" onSubmit={(event) => void submit(event)}>
      <h1 className="font-title text-page-title-lg">{strings.title}</h1>
      {/* The account is named, not asked: it is the link's, and it cannot be changed here. */}
      <p className="flex items-center gap-2 rounded-m border-2 border-paper-300 bg-paper-200 px-3.5 py-2.5 text-label">
        <Icon name="user" size={22} strokeWidth={2.4} />
        <span>
          {strings.account} <b>{maskEmail(link.email)}</b>
        </span>
      </p>
      {failureText && <ErrorBanner message={failureText} />}
      <PasswordField
        label={strings.newPassword}
        hint={auth.passwordRule}
        hintMet={passwordRuleKept}
        autoComplete="new-password"
        disabled={isPending}
        error={errors.password?.message}
        {...register('password')}
      />
      <TextField
        label={strings.confirmation}
        type="password"
        autoComplete="new-password"
        disabled={isPending}
        error={errors.confirmation?.message}
        {...register('confirmation')}
      />
      <div className="mt-1.5">
        <SubmitButton
          pending={isPending}
          label={strings.submit}
          pendingLabel={strings.submitting}
        />
      </div>
    </AuthFrame>
  )
}
