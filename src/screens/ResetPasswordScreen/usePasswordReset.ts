import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import type { ApiFailure } from '../../api/failure'
import { useResetPassword } from '../../api/users'
import { keepsPasswordRule, newPasswordSchema } from '../../app/authValidation'
import { failureMessage } from '../../app/failureMessage'
import { logger } from '../../lib/logger'
import type { ResetLink } from './resetLink'
import { strings } from './strings'

const resetSchema = z
  .object({ password: newPasswordSchema, confirmation: z.string() })
  .refine(({ password, confirmation }) => password === confirmation, {
    path: ['confirmation'],
    message: strings.mismatch,
  })

type ResetForm = z.infer<typeof resetSchema>

/** How the reset ended, once it has: changed, or a link the server will not take. */
function outcomeOf(
  succeeded: boolean,
  failure: ApiFailure | undefined,
): 'done' | 'invalid-link' | undefined {
  if (succeeded) return 'done'
  return failure?.kind === 'invalid-request' ? 'invalid-link' : undefined
}

/**
 * Choosing the new password with the link of the e-mail. Every way the link can be wrong (unknown,
 * expired, already used) is the same `400`, and the screen says only that the link is not valid.
 */
export function usePasswordReset({ email, token }: ResetLink) {
  const form = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmation: '' },
  })
  const password = useWatch({ control: form.control, name: 'password' })
  const reset = useResetPassword()

  const submit = form.handleSubmit(({ password: newPassword }) => {
    logger.info('Choosing a new password')
    reset.mutate(
      { email, token, newPassword },
      {
        onSuccess: () => {
          logger.info('Password changed')
        },
        onError: (error) => {
          if (error.failure.kind === 'invalid-request') logger.info('The reset link was refused')
        },
      },
    )
  })

  const failure = reset.error?.failure
  return {
    register: form.register,
    errors: form.formState.errors,
    passwordRuleKept: keepsPasswordRule(password),
    isPending: reset.isPending,
    submit,
    outcome: outcomeOf(reset.isSuccess, failure),
    /** A failure that says nothing about the link (no network, a server error): try again. */
    failureText:
      failure === undefined || failure.kind === 'invalid-request'
        ? undefined
        : failureMessage(failure),
  } as const
}
