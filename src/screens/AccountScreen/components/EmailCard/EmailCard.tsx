import type { Account } from '../../../../api/users'
import { Button } from '../../../../components/Button/Button'
import { PasswordField } from '../../../../components/PasswordField/PasswordField'
import { SubmitButton } from '../../../../components/SubmitButton/SubmitButton'
import { TextField } from '../../../../components/TextField/TextField'
import { strings } from '../../strings'
import { useEmailChange } from '../../useEmailChange'
import { AccountCard } from '../AccountCard/AccountCard'

export interface EmailCardProps {
  known: Account | undefined
  /** On a desktop the buttons are as wide as their words. */
  wide: boolean
}

const { email } = strings

/**
 * « Adresse e-mail »: the current address and « Modifier ». The fields for the new address and the
 * current password open only on request, so that the address is not changed by accident.
 */
export function EmailCard({ known, wide }: EmailCardProps) {
  const { editing, open, cancel, register, errors, isDirty, isPending, submit } = useEmailChange()

  return (
    <AccountCard id="email" title={email.title} unsaved={editing && isDirty}>
      <div className="flex flex-col gap-0.5">
        {known?.email === undefined ? (
          <p className="text-detail text-ink-700">{email.unknownCurrent}</p>
        ) : (
          <>
            <p className="text-body font-bold">{email.current}</p>
            <p className="text-label [overflow-wrap:anywhere]">{known.email}</p>
          </>
        )}
      </div>
      {editing ? (
        <form onSubmit={(event) => void submit(event)} noValidate className="flex flex-col gap-3.5">
          <TextField
            label={email.newAddress}
            type="email"
            inputMode="email"
            autoComplete="email"
            disabled={isPending}
            error={errors.email?.message}
            {...register('email')}
          />
          <PasswordField
            label={strings.currentPassword.label}
            autoComplete="current-password"
            disabled={isPending}
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center">
            <SubmitButton
              pending={isPending}
              fullWidth={!wide}
              label={email.submit}
              pendingLabel={email.submitting}
            />
            <Button variant="quiet" size="medium" fullWidth={!wide} onClick={cancel}>
              {email.cancel}
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <Button variant="secondary" size="medium" icon="edit" onClick={open}>
            {email.change}
          </Button>
        </div>
      )}
    </AccountCard>
  )
}
