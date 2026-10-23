import { describe, expect, it } from 'vitest'
import { readResetLink } from './resetLink'

const params = (query: string) => new URLSearchParams(query)

describe('readResetLink', () => {
  it('reads the token and the address of a complete link', () => {
    expect(readResetLink(params('token=abc-123&email=odile%40exemple.fr'))).toEqual({
      token: 'abc-123',
      email: 'odile@exemple.fr',
    })
  })

  it('keeps the plus sign of an address', () => {
    expect(readResetLink(params('token=abc&email=odile%2Bcuisine%40exemple.fr'))?.email).toBe(
      'odile+cuisine@exemple.fr',
    )
  })

  it.each([
    ['no token', 'email=odile%40exemple.fr'],
    ['an empty token', 'token=&email=odile%40exemple.fr'],
    ['a blank token', 'token=%20&email=odile%40exemple.fr'],
    ['no address', 'token=abc'],
    ['an address that is not one', 'token=abc&email=odile'],
    ['nothing at all', ''],
  ])('reads nothing from a link with %s', (_what, query) => {
    expect(readResetLink(params(query))).toBeUndefined()
  })
})
