import { z } from 'zod'
import { emailSchema, newPasswordSchema, USERNAME_LENGTH } from '../../app/authValidation'
import { strings } from './strings'

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, strings.usernameRequired)
    .min(USERNAME_LENGTH.min, strings.usernameTooShort)
    .max(USERNAME_LENGTH.max, strings.usernameTooLong),
  email: emailSchema,
  password: newPasswordSchema,
  // Both may stay empty: an empty one is simply not sent.
  firstname: z.string().trim(),
  lastname: z.string().trim(),
})

export type RegisterForm = z.infer<typeof registerSchema>
