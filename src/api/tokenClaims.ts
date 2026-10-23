import { z } from 'zod'

export type Role = 'USER' | 'ADMIN'

export interface TokenClaims {
  readonly username: string
  readonly userId: string
  readonly roles: readonly Role[]
  /** Epoch milliseconds. */
  readonly expiresAt: number
}

function isRole(value: string): value is Role {
  return value === 'USER' || value === 'ADMIN'
}

// What the back puts in the JWT (AuthenticationController.login): `sub` is the username, `roles`
// the role names without the Spring `ROLE_` prefix, `exp` in seconds. Unknown roles are dropped.
const claimsSchema = z.object({
  sub: z.string().min(1),
  userId: z.union([z.string(), z.number()]).transform(String),
  roles: z.array(z.string()).default([]),
  exp: z.number(),
})

function decodeBase64Url(segment: string): string | null {
  try {
    const base64 = segment.replaceAll('-', '+').replaceAll('_', '/')
    const bytes = Uint8Array.from(atob(base64), (char) => char.codePointAt(0) ?? 0)
    return new TextDecoder().decode(bytes)
  } catch {
    return null
  }
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/**
 * Reads the claims of a JWT, or null when it is not one the app understands. The signature is not
 * checked: the front only reads the token to adapt the interface, the server stays the authority.
 */
export function readTokenClaims(token: string): TokenClaims | null {
  const payload = token.split('.')[1]
  const json = payload === undefined ? null : decodeBase64Url(payload)
  const parsed = claimsSchema.safeParse(json === null ? null : parseJson(json))
  if (!parsed.success) return null

  const { sub, userId, roles, exp } = parsed.data
  return { username: sub, userId, roles: roles.filter(isRole), expiresAt: exp * 1000 }
}
