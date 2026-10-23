import { z } from 'zod'
import { emailSchema, newPasswordSchema, usernameSchema } from '../../app/authValidation'
import { strings } from './strings'

export const profileSchema = z.object({
  username: usernameSchema,
  // Both may be empty: an empty one that was not changed is not sent.
  firstname: z.string().trim(),
  lastname: z.string().trim(),
})
export type ProfileForm = z.infer<typeof profileSchema>

export const emailChangeSchema = z.object({
  email: emailSchema,
  currentPassword: z.string().min(1, strings.currentPassword.required),
})
export type EmailChangeForm = z.infer<typeof emailChangeSchema>

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, strings.currentPassword.required),
    password: newPasswordSchema,
    confirmation: z.string(),
  })
  .refine(({ password, confirmation }) => password === confirmation, {
    path: ['confirmation'],
    message: strings.password.mismatch,
  })
export type PasswordChangeForm = z.infer<typeof passwordChangeSchema>
