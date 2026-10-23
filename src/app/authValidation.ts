import { z } from 'zod'
import { strings } from './strings'

/** The limits of the contract (`CreateUserRequest`, `ResetPasswordRequest`), mirrored for an early answer. */
export const USERNAME_LENGTH = { min: 3, max: 50 } as const
export const PASSWORD_LENGTH = { min: 8, max: 50 } as const
export const EMAIL_MAX_LENGTH = 254

/** The shape of an address and nothing else: whether an account exists is the server's secret. */
export const emailSchema = z
  .string()
  .trim()
  .min(1, strings.auth.emailRequired)
  .pipe(z.email(strings.auth.emailInvalid))
  .pipe(z.string().max(EMAIL_MAX_LENGTH, strings.auth.emailInvalid))

/** 8 to 50 characters, as typed (spaces count). Too short and empty say the rule itself. */
export const newPasswordSchema = z
  .string()
  .min(PASSWORD_LENGTH.min, strings.auth.passwordRule)
  .max(PASSWORD_LENGTH.max, strings.auth.passwordTooLong)

/** Whether the rule « 8 caractères minimum » is kept by what has been typed so far. */
export function keepsPasswordRule(password: string): boolean {
  return password.length >= PASSWORD_LENGTH.min
}
