import { describe, expect, it } from 'vitest'
import { messageOf } from './fieldError'

describe('messageOf', () => {
  it('reads the message of a field’s error', () => {
    expect(messageOf({ type: 'custom', message: 'Le titre est obligatoire.' })).toBe(
      'Le titre est obligatoire.',
    )
  })

  it('reads the message a list carries under root', () => {
    expect(messageOf({ root: { type: 'too_small', message: 'Ajoute au moins une étape.' } })).toBe(
      'Ajoute au moins une étape.',
    )
  })

  it('reads the message a list carries on itself', () => {
    expect(messageOf(Object.assign([], { message: 'Ajoute au moins une étape.' }))).toBe(
      'Ajoute au moins une étape.',
    )
  })

  it.each([[undefined], [null], ['texte'], [{}], [{ message: '' }], [{ message: 3 }], [[]]])(
    'says nothing for %j',
    (error) => {
      expect(messageOf(error)).toBeUndefined()
    },
  )
})
