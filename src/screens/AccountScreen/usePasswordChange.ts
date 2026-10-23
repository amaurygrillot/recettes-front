import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useUpdateUser } from '../../api/users'
import { keepsPasswordRule } from '../../app/authValidation'
import { useToasts } from '../../app/useToasts'
import { logger } from '../../lib/logger'
import { passwordChangeSchema, type PasswordChangeForm } from './accountSchemas'
import { failureNotice } from './failureNotice'
import { strings } from './strings'

const EMPTY: PasswordChangeForm = { currentPassword: '', password: '', confirmation: '' }

/**
 * The password card: the current password proves who asks (wrong or missing: a `403`, said on its
 * field), the new one has the rule of the registration. Once changed the fields are emptied: no
 * password stays on the screen, and the session goes on.
 */
export function usePasswordChange() {
  const toasts = useToasts()
  const updateUser = useUpdateUser()
  const form = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: EMPTY,
  })
  const password = useWatch({ control: form.control, name: 'password' })

  const submit = form.handleSubmit(({ currentPassword, password: newPassword }) => {
    logger.info('Changing the password')
    updateUser.mutate(
      { password: newPassword, currentPassword },
      {
        onSuccess: () => {
          form.reset(EMPTY)
          toasts.success(strings.password.changed)
        },
        onError: ({ failure }) => {
          if (failure.kind === 'forbidden') {
            form.setError(
              'currentPassword',
              { type: 'server', message: strings.currentPassword.wrong },
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
    register: form.register,
    errors: form.formState.errors,
    isDirty: form.formState.isDirty,
    isPending: updateUser.isPending,
    ruleKept: keepsPasswordRule(password),
    submit,
  }
}
