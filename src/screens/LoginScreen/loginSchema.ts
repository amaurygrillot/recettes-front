import { z } from 'zod'
import { strings } from './strings'

// The server decides what a good login is (a wrong one is a 401): this only spares a round trip
// for a field left empty.
export const loginSchema = z.object({
  username: z.string().trim().min(1, strings.usernameRequired),
  password: z.string().min(1, strings.passwordRequired),
})

export type LoginForm = z.infer<typeof loginSchema>
