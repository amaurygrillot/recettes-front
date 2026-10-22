import { describe, expect, it } from 'vitest'
import { getInitials } from './initials'

const CASES: readonly [name: string, initials: string][] = [
  ['Anne Girard', 'AG'],
  ['anne girard', 'AG'],
  ['  Anne   Girard  ', 'AG'],
  ['Jean-Pierre Dupont', 'JD'],
  ['Marie de la Tour', 'MT'],
  ['Éloïse Çelik', 'EC'],
  ['Madonna', 'M'],
  ['\u{20BB7}野 Taro', '\u{20BB7}T'],
  ['amaury', 'A'],
  ['', ''],
  ['   ', ''],
  ['42 18', ''],
]

describe('getInitials', () => {
  it.each(CASES)('turns %j into %j', (name, initials) => {
    expect(getInitials(name)).toBe(initials)
  })
})
