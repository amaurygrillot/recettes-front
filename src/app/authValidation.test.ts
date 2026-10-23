import { describe, expect, it } from 'vitest'
import { emailSchema, keepsPasswordRule, newPasswordSchema } from './authValidation'

describe('emailSchema', () => {
  it.each(['odile@exemple.fr', 'odile+cuisine@exemple.fr', ' odile@exemple.fr '])(
    'accepts %s, without its stray spaces',
    (email) => {
      expect(emailSchema.parse(email)).toBe(email.trim())
    },
  )

  it('asks for an address when there is none', () => {
    const result = emailSchema.safeParse('   ')

    expect(result.error?.issues[0]?.message).toBe('Indique ton adresse e-mail.')
  })

  it.each(['odile', 'odile@exemple', '@exemple.fr', 'odile @exemple.fr'])(
    'says %s does not look like an address, with an example',
    (email) => {
      const result = emailSchema.safeParse(email)

      expect(result.error?.issues[0]?.message).toBe(
        "Cette adresse e-mail n'a pas l'air valide. Exemple : prenom@exemple.fr",
      )
    },
  )

  it('refuses an address longer than the back end accepts', () => {
    const tooLong = `${'a'.repeat(250)}@exemple.fr`

    expect(emailSchema.safeParse(tooLong).success).toBe(false)
  })
})

describe('newPasswordSchema', () => {
  it('accepts 8 to 50 characters, spaces included', () => {
    expect(newPasswordSchema.safeParse('huit car').success).toBe(true)
    expect(newPasswordSchema.safeParse('x'.repeat(50)).success).toBe(true)
  })

  it('says the rule itself when the password is empty or too short', () => {
    expect(newPasswordSchema.safeParse('').error?.issues[0]?.message).toBe('8 caractères minimum')
    expect(newPasswordSchema.safeParse('court').error?.issues[0]?.message).toBe(
      '8 caractères minimum',
    )
  })

  it('refuses more than 50 characters', () => {
    expect(newPasswordSchema.safeParse('x'.repeat(51)).error?.issues[0]?.message).toBe(
      '50 caractères au plus.',
    )
  })
})

describe('keepsPasswordRule', () => {
  it('is kept from the 8th character on', () => {
    expect(keepsPasswordRule('1234567')).toBe(false)
    expect(keepsPasswordRule('12345678')).toBe(true)
  })
})
