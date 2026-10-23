import { describe, expect, it } from 'vitest'
import type { ApiFailure } from '../api/failure'
import { conflictedField } from './conflictedField'

const conflict = (detail: string | undefined): ApiFailure => ({
  kind: 'conflict',
  status: 409,
  detail,
})

describe('conflictedField', () => {
  it.each([
    ['Username already exists', 'username'],
    ['Email already exists', 'email'],
    ['EMAIL ALREADY EXISTS', 'email'],
  ] as const)('reads « %s » as the %s', (detail, field) => {
    expect(conflictedField(conflict(detail))).toBe(field)
  })

  it.each([['Something already exists'], [undefined]])(
    'names no field for a conflict whose detail is %s',
    (detail) => {
      expect(conflictedField(conflict(detail))).toBeUndefined()
    },
  )

  it('names no field for a failure that is not a conflict', () => {
    expect(conflictedField({ kind: 'network' })).toBeUndefined()
    expect(
      conflictedField({ kind: 'invalid-request', status: 400, detail: 'Username is blank' }),
    ).toBeUndefined()
  })
})
