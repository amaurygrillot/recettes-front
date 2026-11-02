import { describe, expect, it } from 'vitest'
import type { Session } from '../api/sessionStore'
import { canCreateRecipes, canManageRecipe, navigationLinks, phoneNavigation } from './navigation'

const visitor: Session = { status: 'visitor' }
const expired: Session = { status: 'expired' }
const user: Session = { status: 'member', username: 'camille', userId: '1', roles: ['USER'] }
const admin: Session = {
  status: 'member',
  username: 'amelie',
  userId: '2',
  roles: ['USER', 'ADMIN'],
}
const roleless: Session = { status: 'member', username: 'invite', userId: '3', roles: [] }

const search = {
  label: 'Rechercher',
  icon: 'search',
  onSelect: () => undefined,
  current: false,
} as const

const labels = (items: readonly { label: string }[]) => items.map((item) => item.label)

describe('navigationLinks', () => {
  it('gives a visitor two links, the second to log in: the search is a field, not a page', () => {
    expect(labels(navigationLinks(visitor))).toEqual(['Accueil', 'Se connecter'])
  })

  it('gives a member three links, ending on the account', () => {
    expect(labels(navigationLinks(user))).toEqual(['Accueil', 'Mes recettes', 'Compte'])
  })

  it('shows a member whose session expired what a visitor sees', () => {
    expect(labels(navigationLinks(expired))).toEqual(labels(navigationLinks(visitor)))
  })

  it('sends each link to a different page', () => {
    expect(navigationLinks(user).map((item) => item.to)).toEqual(['/', '/mes-recettes', '/compte'])
  })
})

describe('phoneNavigation', () => {
  it('puts « Rechercher » second for a visitor, in the same order as the links around it', () => {
    expect(labels(phoneNavigation(visitor, search))).toEqual([
      'Accueil',
      'Rechercher',
      'Se connecter',
    ])
  })

  it('puts « Rechercher » second for a member', () => {
    expect(labels(phoneNavigation(user, search))).toEqual([
      'Accueil',
      'Rechercher',
      'Mes recettes',
      'Compte',
    ])
  })

  it('brings the action it is given, not a link to a search page', () => {
    const items = phoneNavigation(user, search)

    expect(items[1]).toBe(search)
    expect(items.filter((item) => 'to' in item).map((item) => item.to)).toEqual([
      '/',
      '/mes-recettes',
      '/compte',
    ])
  })
})

describe('canCreateRecipes', () => {
  it.each([
    ['a visitor', visitor, false],
    ['an expired session', expired, false],
    ['a member', user, true],
    ['an administrator', admin, true],
    ['a member without the USER role', roleless, false],
  ])('is %s: %s', (_name, session, allowed) => {
    expect(canCreateRecipes(session)).toBe(allowed)
  })
})

describe('canManageRecipe', () => {
  it('lets the author change their own recipe', () => {
    expect(canManageRecipe(user, '1')).toBe(true)
  })

  it('lets an administrator change the recipe of anyone else', () => {
    expect(canManageRecipe(admin, '1')).toBe(true)
  })

  it('does not let another member', () => {
    expect(canManageRecipe(user, '2')).toBe(false)
  })

  it.each([
    ['a visitor', visitor],
    ['a member whose session expired', expired],
  ])('does not let %s', (_who, session) => {
    expect(canManageRecipe(session, '1')).toBe(false)
  })

  it('does not let a member on a recipe whose author is unknown', () => {
    expect(canManageRecipe(user, undefined)).toBe(false)
  })

  it('still lets an administrator when the author is unknown', () => {
    expect(canManageRecipe(admin, undefined)).toBe(true)
  })
})
