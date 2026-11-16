import { afterEach, describe, expect, it } from 'vitest'
import { forgetOtherMembers, memberKey } from './memberStorage'

afterEach(() => {
  window.localStorage.clear()
  window.sessionStorage.clear()
})

describe('memberKey', () => {
  it('puts the member in the key, so that two members never share one', () => {
    expect(memberKey('42', 'draft.new')).not.toBe(memberKey('43', 'draft.new'))
    expect(memberKey('42', 'draft.new')).toContain('42')
  })
})

describe('forgetOtherMembers', () => {
  it('forgets what the other members left, in the device and in the tab', () => {
    window.localStorage.setItem(memberKey('42', 'draft.new'), 'a')
    window.sessionStorage.setItem(memberKey('42', 'draft.new.interrupted'), '1')
    window.localStorage.setItem(memberKey('43', 'draft.new'), 'b')

    expect(forgetOtherMembers('43')).toBe(2)

    expect(window.localStorage.getItem(memberKey('42', 'draft.new'))).toBeNull()
    expect(window.sessionStorage.getItem(memberKey('42', 'draft.new.interrupted'))).toBeNull()
    expect(window.localStorage.getItem(memberKey('43', 'draft.new'))).toBe('b')
  })

  it('does not take a member for another whose id starts the same way', () => {
    window.localStorage.setItem(memberKey('4', 'draft.new'), 'a')
    window.localStorage.setItem(memberKey('42', 'draft.new'), 'b')

    forgetOtherMembers('42')

    expect(window.localStorage.getItem(memberKey('42', 'draft.new'))).toBe('b')
    expect(window.localStorage.getItem(memberKey('4', 'draft.new'))).toBeNull()
  })

  it('leaves what does not belong to a member alone', () => {
    window.localStorage.setItem('recettes.cooking.r-1', '3')

    forgetOtherMembers('42')

    expect(window.localStorage.getItem('recettes.cooking.r-1')).toBe('3')
  })

  it('does not fail when the storage is blocked', () => {
    const blocked = Object.getOwnPropertyDescriptor(window, 'localStorage')
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => {
        throw new Error('blocked')
      },
    })

    try {
      expect(forgetOtherMembers('42')).toBe(0)
    } finally {
      if (blocked !== undefined) Object.defineProperty(window, 'localStorage', blocked)
    }
  })
})
