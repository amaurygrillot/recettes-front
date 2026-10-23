interface FakeTokenOptions {
  username?: string
  userId?: string
  roles?: readonly string[]
  /** Negative for a token that has already expired. */
  expiresInSeconds?: number
}

function base64Url(value: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(value))
  const binary = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('')
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

/**
 * A JWT shaped like the back end's (`sub`, `userId`, `roles`, `exp`), signed with nothing: the
 * front only reads the claims, so the signature is a placeholder.
 */
export function fakeToken({
  username = 'camille',
  userId = '42',
  roles = ['USER'],
  expiresInSeconds = 3600,
}: FakeTokenOptions = {}): string {
  const payload = {
    iss: 'self',
    sub: username,
    userId,
    roles,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  }
  return [base64Url({ alg: 'RS256', typ: 'JWT' }), base64Url(payload), 'signature'].join('.')
}
