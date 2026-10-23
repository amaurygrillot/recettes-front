import { skipToken, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { components } from './schema'
import { sessionStore } from './sessionStore'
import { unwrap, unwrapEmpty } from './unwrap'

type Schemas = components['schemas']

/** An account as the back end sends it back after creating or changing it. */
export type Account = Schemas['UserResponse']

/** What this visit has learned about each account, by its id: never mixed up between members. */
export const accountKeys = {
  of: (userId: string) => ['account', userId] as const,
}

/**
 * What is known of the signed-in account beyond the token (address, first and last name): the
 * answer of the last registration or change made in this visit. **The back end has no way to read
 * a profile** (there is no `GET` for it), so after a page reload this is `undefined` until the next
 * change. When such an endpoint exists, this hook is the only thing that has to start fetching.
 */
export function useKnownAccount(userId: string): Account | undefined {
  return useQuery<Account | undefined>({
    queryKey: accountKeys.of(userId),
    queryFn: skipToken,
    staleTime: Infinity,
    gcTime: Infinity,
  }).data
}

/** Registers an account. It does not log in: the screen signs the new member in itself. */
export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (account: Schemas['CreateUserRequest']) =>
      unwrap(api.POST('/users/create', { body: account })),
    onSuccess: (created) => {
      if (created.id !== undefined) queryClient.setQueryData(accountKeys.of(created.id), created)
    },
  })
}

/**
 * Updates the calling account. Changing the password or the e-mail needs `currentPassword`; a
 * missing or wrong one is a `403`, not a `400`. What comes back is remembered (see
 * `useKnownAccount`), and a new username is shown from now on.
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (changes: Schemas['UpdateUserRequest']) =>
      unwrap(api.PUT('/users/update', { body: changes })),
    onSuccess: (updated) => {
      if (updated.id !== undefined) queryClient.setQueryData(accountKeys.of(updated.id), updated)
      const session = sessionStore.getSnapshot()
      if (session.status === 'member' && updated.id === session.userId && updated.username) {
        sessionStore.rename(updated.username)
      }
    },
  })
}

/** Completes a password reset with the token from the e-mail; every way to fail is the same `400`. */
export function useResetPassword() {
  return useMutation({
    mutationFn: (reset: Schemas['ResetPasswordRequest']) =>
      unwrapEmpty(api.PUT('/users/reinit-password', { body: reset })),
  })
}
