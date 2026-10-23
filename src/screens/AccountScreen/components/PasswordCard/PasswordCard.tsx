import { strings as appStrings } from '../../../../app/strings'
import { PasswordField } from '../../../../components/PasswordField/PasswordField'
import { SubmitButton } from '../../../../components/SubmitButton/SubmitButton'
import { strings } from '../../strings'
import { usePasswordChange } from '../../usePasswordChange'
import { AccountCard } from '../AccountCard/AccountCard'

export interface PasswordCardProps {
  /** On a desktop the button is as wide as its words and the two new passwords share a row. */
  wide: boolean
}

const { password } = strings

/** « Mot de passe »: the current one, the new one twice. All three can be shown, none is kept once changed. */
export function PasswordCard({ wide }: PasswordCardProps) {
  const { register, errors, isDirty, isPending, ruleKept, submit } = usePasswordChange()

  return (
    <AccountCard id="mdp" title={password.title} unsaved={isDirty}>
      <form onSubmit={(event) => void submit(event)} noValidate className="flex flex-col gap-3.5">
        <PasswordField
          label={strings.currentPassword.label}
          autoComplete="current-password"
          disabled={isPending}
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />
        <div className="grid gap-3.5 desktop:grid-cols-2 desktop:gap-4">
          <PasswordField
            label={password.new}
            hint={appStrings.auth.passwordRule}
            hintMet={ruleKept}
            autoComplete="new-password"
            disabled={isPending}
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordField
            label={password.confirmation}
            autoComplete="new-password"
            disabled={isPending}
            error={errors.confirmation?.message}
            {...register('confirmation')}
          />
        </div>
        <div>
          <SubmitButton
            pending={isPending}
            disabled={!isDirty}
            fullWidth={!wide}
            label={password.submit}
            pendingLabel={password.submitting}
          />
        </div>
      </form>
    </AccountCard>
  )
}
