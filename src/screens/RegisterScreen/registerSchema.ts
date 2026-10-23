import { z } from 'zod'
import { emailSchema, newPasswordSchema, usernameSchema } from '../../app/authValidation'

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: newPasswordSchema,
  // Both may stay empty: an empty one is simply not sent.
  firstname: z.string().trim(),
  lastname: z.string().trim(),
})

export type RegisterForm = z.infer<typeof registerSchema>
