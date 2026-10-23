import type { Member } from '../../../../api/sessionStore'
import type { Account } from '../../../../api/users'
import { strings as appStrings } from '../../../../app/strings'
import { SubmitButton } from '../../../../components/SubmitButton/SubmitButton'
import { TextField } from '../../../../components/TextField/TextField'
import { strings } from '../../strings'
import { useProfileForm } from '../../useProfileForm'
import { AccountCard } from '../AccountCard/AccountCard'

export interface ProfileCardProps {
  member: Member
  known: Account | undefined
  /** On a desktop the button is as wide as its words and the two names share a row. */
  wide: boolean
}

const { auth } = appStrings
const { profile } = strings

/** « Profil »: username, first name and last name, saved together. */
export function ProfileCard({ member, known, wide }: ProfileCardProps) {
  const { register, errors, isDirty, isPending, namesKnown, submit } = useProfileForm(member, known)

  return (
    <AccountCard id="profil" title={profile.title} unsaved={isDirty}>
      <form onSubmit={(event) => void submit(event)} noValidate className="flex flex-col gap-3.5">
        {!namesKnown && <p className="text-detail text-ink-700">{profile.unknownNames}</p>}
        <TextField
          label={auth.usernameLabel}
          hint={auth.usernameHint}
          autoComplete="username"
          autoCapitalize="none"
          disabled={isPending}
          error={errors.username?.message}
          {...register('username')}
        />
        <div className="grid gap-3.5 desktop:grid-cols-2 desktop:gap-4">
          <TextField
            label={profile.firstname}
            note={profile.optional}
            autoComplete="given-name"
            disabled={isPending}
            {...register('firstname')}
          />
          <TextField
            label={profile.lastname}
            note={profile.optional}
            autoComplete="family-name"
            disabled={isPending}
            {...register('lastname')}
          />
        </div>
        <div>
          <SubmitButton
            pending={isPending}
            disabled={!isDirty}
            fullWidth={!wide}
            label={profile.save}
            pendingLabel={profile.saving}
          />
        </div>
      </form>
    </AccountCard>
  )
}
