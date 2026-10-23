import { useMutation } from '@tanstack/react-query'
import { api } from './client'
import { ApiRequestError } from './failure'
import type { components } from './schema'
import { sessionStore } from './sessionStore'
import { unwrap, unwrapEmpty } from './unwrap'

export type Credentials = components['schemas']['AuthenticationRequest']

/** `POST /auth/login` answers the JWT as a bare `text/plain` body, not JSON: wrapped here, once. */
async function login(credentials: Credentials): Promise<void> {
  const token = await unwrap(api.POST('/auth/login', { body: credentials, parseAs: 'text' }))
  if (!sessionStore.signIn(token.trim())) {
    throw new ApiRequestError({
      kind: 'unexpected',
      status: 200,
      detail: 'The back end answered with a token the app cannot read',
    })
  }
}

/** Logs in and starts the session; the screen only needs to know whether it worked. */
export function useLogin() {
  return useMutation({ mutationFn: login })
}

/** Always succeeds with the same answer, whether or not the address has an account. */
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) =>
      unwrapEmpty(api.POST('/auth/reinit-password', { body: { email } })),
  })
}
