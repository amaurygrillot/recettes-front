import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useLogin } from '../../api/auth'
import type { ApiFailure } from '../../api/failure'
import { useCreateUser } from '../../api/users'
import { failureMessage } from '../../app/failureMessage'
import { strings as appStrings } from '../../app/strings'
import { keepsPasswordRule } from '../../app/authValidation'
import { logger } from '../../lib/logger'
import { conflictedField } from '../../app/conflictedField'
import { registerSchema, type RegisterForm } from './registerSchema'
import { strings } from './strings'

/** Where the sign-in that follows the registration stands, for the welcome screen. */
export type WelcomeState = 'connecting' | 'connected' | 'failed'

/** An optional field left empty is not sent at all. */
function accountFrom({ firstname, lastname, ...required }: RegisterForm) {
  return {
    ...required,
    ...(firstname === '' ? {} : { firstname }),
    ...(lastname === '' ? {} : { lastname }),
  }
}

/** How the sign-in that follows the registration stands. */
function welcomeStateOf({
  isSuccess,
  isError,
}: {
  isSuccess: boolean
  isError: boolean
}): WelcomeState {
  if (isSuccess) return 'connected'
  return isError ? 'failed' : 'connecting'
}

/** What to say on top of the form: nothing for a conflict a field already says, the cause otherwise. */
function bannerText(failure: ApiFailure | undefined): string | undefined {
  if (failure === undefined || conflictedField(failure) !== undefined) return undefined
  return failure.kind === 'conflict' ? strings.conflictUnknown : failureMessage(failure)
}

/**
 * The registration: validates, creates the account, then signs the new member in with what was
 * just typed (the welcome screen shows it happening). A `409` goes to the field it is about.
 */
export function useRegistration() {
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', firstname: '', lastname: '' },
  })
  const password = useWatch({ control: form.control, name: 'password' })
  const createUser = useCreateUser()
  const login = useLogin()
  const [newMember, setNewMember] = useState<string | undefined>()

  const submit = form.handleSubmit((values) => {
    logger.info('Registering an account')
    createUser.mutate(accountFrom(values), {
      onSuccess: () => {
        logger.info('Account created, signing the new member in')
        setNewMember(values.username)
        login.mutate({ username: values.username, password: values.password })
      },
      onError: (error) => {
        const field = conflictedField(error.failure)
        if (field === undefined) return
        logger.info('Registration refused: that field is already taken', { field })
        form.setError(
          field,
          { type: 'server', message: appStrings.auth.conflict[field] },
          { shouldFocus: true },
        )
      },
    })
  })

  return {
    register: form.register,
    errors: form.formState.errors,
    passwordRuleKept: keepsPasswordRule(password),
    isPending: createUser.isPending,
    failureText: bannerText(createUser.error?.failure),
    submit,
    /** Set once the account exists: who to welcome, and how the sign-in is going. */
    welcome:
      newMember === undefined ? undefined : { username: newMember, state: welcomeStateOf(login) },
  }
}
