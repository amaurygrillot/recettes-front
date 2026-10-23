import { useMutation } from '@tanstack/react-query'
import { api } from './client'
import type { components } from './schema'
import { unwrap, unwrapEmpty } from './unwrap'

type Schemas = components['schemas']

/** Registers an account. It does not log in: the screen sends the new member to the login. */
export function useCreateUser() {
  return useMutation({
    mutationFn: (account: Schemas['CreateUserRequest']) =>
      unwrap(api.POST('/users/create', { body: account })),
  })
}

/**
 * Updates the calling account. Changing the password or the e-mail needs `currentPassword`; a
 * missing or wrong one is a `403`, not a `400`.
 */
export function useUpdateUser() {
  return useMutation({
    mutationFn: (changes: Schemas['UpdateUserRequest']) =>
      unwrap(api.PUT('/users/update', { body: changes })),
  })
}

/** Completes a password reset with the token from the e-mail; every way to fail is the same `400`. */
export function useResetPassword() {
  return useMutation({
    mutationFn: (reset: Schemas['ResetPasswordRequest']) =>
      unwrapEmpty(api.PUT('/users/reinit-password', { body: reset })),
  })
}
