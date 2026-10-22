import { describe, expect, it } from 'vitest'
import { classNames } from './classNames'

type Part = string | false | null | undefined

const CASES: readonly (readonly [parts: readonly Part[], joined: string])[] = [
  [['a', 'b'], 'a b'],
  [['a', false, 'b'], 'a b'],
  [['a', undefined, null, ''], 'a'],
  [[], ''],
]

describe('classNames', () => {
  it.each(CASES)('joins %j into %j', (parts, joined) => {
    expect(classNames(...parts)).toBe(joined)
  })
})
