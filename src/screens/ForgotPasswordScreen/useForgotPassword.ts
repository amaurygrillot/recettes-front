import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRequestPasswordReset } from '../../api/auth'
import { isTransient, type ApiFailure } from '../../api/failure'
import { emailSchema } from '../../app/authValidation'
import { failureMessage } from '../../app/failureMessage'
import { logger } from '../../lib/logger'
import { useCountdown } from '../../lib/useCountdown'
import { strings } from './strings'

const forgotSchema = z.object({ email: emailSchema })
type ForgotForm = z.infer<typeof forgotSchema>

/** How long before another e-mail may be asked for: a pause, not a rule of the back end. */
const RESEND_AFTER_SECONDS = 60

function failureText(failure: ApiFailure): string {
  return failure.kind === 'network' ? strings.networkFailure : failureMessage(failure)
}

/**
 * Asking for the reset link: validates the shape of the address, asks, then shows the same
 * confirmation whatever the answer says about the account (the back end answers the same). The
 * link can be asked for again after a pause.
 */
export function useForgotPassword() {
  const form = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })
  const request = useRequestPasswordReset()
  const countdown = useCountdown(RESEND_AFTER_SECONDS)
  // The address a link was asked for, once the back end has taken the request.
  const [sentTo, setSentTo] = useState<string | undefined>()

  function ask(email: string): void {
    logger.info('Asking for a password reset link')
    request.mutate(email, {
      onSuccess: () => {
        setSentTo(email)
        countdown.start()
      },
    })
  }

  const submit = form.handleSubmit(({ email }) => {
    ask(email)
  })

  const failure = request.error?.failure
  return {
    register: form.register,
    errors: form.formState.errors,
    isPending: request.isPending,
    failureText: failure === undefined ? undefined : failureText(failure),
    /** Whether asking again can work: not for a refusal that would be repeated. */
    canRetry: failure !== undefined && isTransient(failure),
    submit,
    sent:
      sentTo === undefined
        ? undefined
        : {
            resendIn: countdown.remaining,
            resend: () => {
              ask(sentTo)
            },
          },
  }
}
