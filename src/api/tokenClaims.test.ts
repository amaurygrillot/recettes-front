import { describe, expect, it } from 'vitest'
import { fakeToken } from '../test/fakeToken'
import { readTokenClaims } from './tokenClaims'

describe('readTokenClaims', () => {
  it('reads the claims the back end puts in its tokens', () => {
    const before = Date.now()
    const claims = readTokenClaims(
      fakeToken({
        username: 'camille',
        userId: '42',
        roles: ['USER', 'ADMIN'],
        expiresInSeconds: 3600,
      }),
    )

    expect(claims).toMatchObject({ username: 'camille', userId: '42', roles: ['USER', 'ADMIN'] })
    expect(claims?.expiresAt).toBeGreaterThanOrEqual(before + 3_599_000)
  })

  it('reads a username with accents', () => {
    expect(readTokenClaims(fakeToken({ username: 'Amélie' }))?.username).toBe('Amélie')
  })

  it('keeps the roles it knows and drops the others', () => {
    expect(readTokenClaims(fakeToken({ roles: ['USER', 'TEAPOT'] }))?.roles).toEqual(['USER'])
  })

  it('reads a numeric user id as text', () => {
    const token = fakeToken()
    const [header, , signature] = token.split('.')
    const payload = btoa(
      JSON.stringify({ sub: 'camille', userId: 42, roles: [], exp: 4_000_000_000 }),
    )

    expect(readTokenClaims(`${header}.${payload}.${signature}`)?.userId).toBe('42')
  })

  it.each([
    ['an empty string', ''],
    ['text that is not a JWT', 'not-a-token'],
    ['a payload that is not base64', 'a.%%%.c'],
    ['a payload that is not JSON', `a.${btoa('plain text')}.c`],
    ['a payload without expiry', `a.${btoa(JSON.stringify({ sub: 'camille' }))}.c`],
    ['a payload without subject', `a.${btoa(JSON.stringify({ exp: 4_000_000_000 }))}.c`],
  ])('rejects %s', (_name, token) => {
    expect(readTokenClaims(token)).toBeNull()
  })
})
