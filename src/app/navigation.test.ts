import { describe, expect, it } from 'vitest'
import type { Session } from '../api/sessionStore'
import { canCreateRecipes, canManageRecipe, navigationItems } from './navigation'

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

const labels = (session: Session) => navigationItems(session).map((item) => item.label)

describe('navigationItems', () => {
  it('gives a visitor three tabs, ending on the way to log in', () => {
    expect(labels(visitor)).toEqual(['Accueil', 'Rechercher', 'Se connecter'])
  })

  it('gives a member four tabs, ending on the account', () => {
    expect(labels(user)).toEqual(['Accueil', 'Rechercher', 'Mes recettes', 'Compte'])
  })

  it('shows a member whose session expired what a visitor sees', () => {
    expect(labels(expired)).toEqual(labels(visitor))
  })

  it('sends each tab to a different page', () => {
    const targets = navigationItems(user).map((item) => item.to)

    expect(targets).toEqual(['/', '/rechercher', '/mes-recettes', '/compte'])
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
