import { emailSchema } from '../../app/authValidation'

/** What the e-mail's link carries: the one-time token and the address of the account. */
export interface ResetLink {
  token: string
  email: string
}

/**
 * The link of the e-mail (`/reset-password?token=…&email=…`, a path the back end fixes), or nothing
 * when it is cut short: no token, or no address that looks like one. Nothing is asked of the server
 * for such a link: it could not work.
 */
export function readResetLink(search: URLSearchParams): ResetLink | undefined {
  const token = search.get('token')?.trim()
  const email = emailSchema.safeParse(search.get('email') ?? '')
  if (token === undefined || token === '' || !email.success) return undefined
  return { token, email: email.data }
}
