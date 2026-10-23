import { paths } from '../../app/paths'
import { Button } from '../../components/Button/Button'
import { ErrorBanner } from '../../components/ErrorBanner/ErrorBanner'
import { LinkButton } from '../../components/LinkButton/LinkButton'
import { Logo } from '../../components/Logo/Logo'
import { TextField } from '../../components/TextField/TextField'
import { strings } from './strings'
import { useLoginForm } from './useLoginForm'

/**
 * Logs in, then returns to the page that asked for it. A working stand-in: the look of the
 * « Marque-ecrans » board (seal on a butter band, desktop panel) comes with the auth screens.
 */
export function LoginScreen() {
  const { register, errors, isPending, failureText, submit } = useLoginForm()

  return (
    <main className="max-w-md mx-auto flex min-h-dvh flex-col justify-center gap-6 px-4 py-10">
      <div className="flex flex-col items-center gap-4">
        <Logo variant="seal" size={160} decorative />
        <h1 className="font-title text-title-1">{strings.title}</h1>
      </div>
      <form onSubmit={(event) => void submit(event)} noValidate className="flex flex-col gap-5">
        {failureText && <ErrorBanner message={failureText} />}
        <TextField
          label={strings.username}
          autoComplete="username"
          autoCapitalize="none"
          error={errors.username?.message}
          {...register('username')}
        />
        <TextField
          label={strings.password}
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" fullWidth disabled={isPending}>
          {strings.submit}
        </Button>
      </form>
      <div className="flex flex-col gap-3">
        <LinkButton to={paths.forgotPassword} variant="quiet" size="medium" fullWidth>
          {strings.forgotPassword}
        </LinkButton>
        <LinkButton to={paths.register} variant="secondary" fullWidth>
          {strings.register}
        </LinkButton>
      </div>
    </main>
  )
}
