import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router'
import { useLogin } from '../../api/auth'
import type { ApiFailure } from '../../api/failure'
import { failureMessage } from '../../app/failureMessage'
import { returnPathFrom } from '../../app/paths'
import { logger } from '../../lib/logger'
import { loginSchema, type LoginForm } from './loginSchema'
import { strings } from './strings'

/** A refused login is the one thing a 401 means here; every other cause keeps its own sentence. */
function loginFailureText(failure: ApiFailure): string {
  return failure.kind === 'unauthorized' ? strings.rejected : failureMessage(failure)
}

/** The login form: validates, logs in, then goes back to the page that asked for a login. */
export function useLoginForm() {
  const navigate = useNavigate()
  const [search] = useSearchParams()
  const login = useLogin()
  const form = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const submit = form.handleSubmit((credentials) => {
    login.mutate(credentials, {
      onSuccess: () => {
        const destination = returnPathFrom(search)
        logger.info('Logged in, going back', { path: destination })
        void navigate(destination, { replace: true })
      },
    })
  })

  return {
    register: form.register,
    errors: form.formState.errors,
    isPending: login.isPending,
    failureText: login.error === null ? null : loginFailureText(login.error.failure),
    submit,
  }
}
