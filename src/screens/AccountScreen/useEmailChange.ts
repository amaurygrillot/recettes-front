import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useUpdateUser } from '../../api/users'
import { conflictedField } from '../../app/conflictedField'
import { strings as appStrings } from '../../app/strings'
import { useToasts } from '../../app/useToasts'
import { logger } from '../../lib/logger'
import { emailChangeSchema, type EmailChangeForm } from './accountSchemas'
import { failureNotice } from './failureNotice'
import { strings } from './strings'

/**
 * The e-mail card: the address is not changed by accident, so the fields only open on « Modifier ».
 * The current password proves who asks (a wrong or missing one is a `403`, said on its field); an
 * address already used is said on the address; anything else is a notification that can be retried.
 */
export function useEmailChange() {
  const toasts = useToasts()
  const updateUser = useUpdateUser()
  const [editing, setEditing] = useState(false)
  const form = useForm<EmailChangeForm>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: { email: '', currentPassword: '' },
  })

  function close(): void {
    form.reset()
    setEditing(false)
  }

  const submit = form.handleSubmit(({ email, currentPassword }) => {
    logger.info('Changing the e-mail address')
    updateUser.mutate(
      { email, currentPassword },
      {
        onSuccess: () => {
          toasts.success(strings.email.changed)
          close()
        },
        onError: ({ failure }) => {
          if (failure.kind === 'forbidden') {
            form.setError(
              'currentPassword',
              { type: 'server', message: strings.currentPassword.wrong },
              { shouldFocus: true },
            )
          } else if (conflictedField(failure) === 'email') {
            form.setError(
              'email',
              { type: 'server', message: appStrings.auth.conflict.email },
              { shouldFocus: true },
            )
          } else {
            toasts.failure(failureNotice(failure, () => void submit()))
          }
        },
      },
    )
  })

  return {
    editing,
    open: () => {
      setEditing(true)
    },
    cancel: close,
    register: form.register,
    errors: form.formState.errors,
    isDirty: form.formState.isDirty,
    isPending: updateUser.isPending,
    submit,
  }
}
