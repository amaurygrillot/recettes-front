import { describe, expect, it } from 'vitest'
import { maskEmail } from './maskEmail'

describe('maskEmail', () => {
  it.each([
    ['odile@exemple.fr', 'o***@exemple.fr'],
    ['o@exemple.fr', 'o***@exemple.fr'],
    ['élodie.martin@gmail.com', 'é***@gmail.com'],
    ['a+b@c.d', 'a***@c.d'],
  ])('hides the name of %s', (email, masked) => {
    expect(maskEmail(email)).toBe(masked)
  })

  it('leaves alone what is not an address', () => {
    expect(maskEmail('pas une adresse')).toBe('pas une adresse')
    expect(maskEmail('@exemple.fr')).toBe('@exemple.fr')
  })
})
