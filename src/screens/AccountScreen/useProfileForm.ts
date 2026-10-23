import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { components } from '../../api/schema'
import type { Member } from '../../api/sessionStore'
import { useUpdateUser, type Account } from '../../api/users'
import { conflictedField } from '../../app/conflictedField'
import { strings as appStrings } from '../../app/strings'
import { useToasts } from '../../app/useToasts'
import { logger } from '../../lib/logger'
import { profileSchema, type ProfileForm } from './accountSchemas'
import { failureNotice } from './failureNotice'
import { strings } from './strings'

type ProfileChanges = Pick<
  components['schemas']['UpdateUserRequest'],
  'username' | 'firstname' | 'lastname'
>

/** Only what differs from what the card showed is sent: an absent field is left alone by the back end. */
function changesFrom(values: ProfileForm, initial: ProfileForm): ProfileChanges {
  const changes: { -readonly [Field in keyof ProfileChanges]: string } = {}
  if (values.username !== initial.username) changes.username = values.username
  if (values.firstname !== initial.firstname) changes.firstname = values.firstname
  if (values.lastname !== initial.lastname) changes.lastname = values.lastname
  return changes
}

/**
 * The profile card: username, first name and last name, saved together when something changed. A
 * taken username is said on its field; anything else is a notification that can be retried.
 */
export function useProfileForm(member: Member, known: Account | undefined) {
  const toasts = useToasts()
  const updateUser = useUpdateUser()
  // What the card showed when it was last saved: the reference for « changed » and for what is sent.
  const [initial, setInitial] = useState<ProfileForm>({
    username: member.username,
    firstname: known?.firstname ?? '',
    lastname: known?.lastname ?? '',
  })
  // Whether the card showed the real names. If they became known after (another card was saved), the
  // fields stay as they are: an empty one is still left alone, so the note is still true.
  const [namesKnown, setNamesKnown] = useState(known !== undefined)
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: initial,
  })

  const submit = form.handleSubmit((values) => {
    const changes = changesFrom(values, initial)
    logger.info('Saving the profile', { fields: Object.keys(changes) })
    updateUser.mutate(changes, {
      onSuccess: (updated) => {
        const saved: ProfileForm = {
          username: updated.username ?? values.username,
          firstname: updated.firstname ?? '',
          lastname: updated.lastname ?? '',
        }
        setInitial(saved)
        setNamesKnown(true)
        form.reset(saved)
        toasts.success(strings.profile.saved)
      },
      onError: ({ failure }) => {
        if (conflictedField(failure) === 'username') {
          form.setError(
            'username',
            { type: 'server', message: appStrings.auth.conflict.username },
            { shouldFocus: true },
          )
          return
        }
        toasts.failure(failureNotice(failure, () => void submit()))
      },
    })
  })

  return {
    register: form.register,
    errors: form.formState.errors,
    isDirty: form.formState.isDirty,
    isPending: updateUser.isPending,
    namesKnown,
    submit,
  }
}
