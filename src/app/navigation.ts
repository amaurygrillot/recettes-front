import type { Session } from '../api/sessionStore'
import type { NavigationItem } from '../components/TabBar/TabBar'
import { paths } from './paths'
import { strings } from './strings'

const { navigation } = strings

const HOME: NavigationItem = { to: paths.home, label: navigation.home, icon: 'home', end: true }
const SEARCH: NavigationItem = { to: paths.search, label: navigation.search, icon: 'search' }
const MY_RECIPES: NavigationItem = {
  to: paths.myRecipes,
  label: navigation.myRecipes,
  icon: 'book',
}
const ACCOUNT: NavigationItem = { to: paths.account, label: navigation.account, icon: 'user' }
const LOGIN: NavigationItem = { to: paths.login, label: navigation.login, icon: 'log-in' }

/**
 * The tabs, one list for the phone's bar and the desktop's: the same order, the same words, the
 * same icons. A member whose session just expired already sees the visitor's.
 */
export function navigationItems(session: Session): NavigationItem[] {
  if (session.status !== 'member') return [HOME, SEARCH, LOGIN]
  return [HOME, SEARCH, MY_RECIPES, { ...ACCOUNT, avatarName: session.username }]
}

/** Whether to offer the « + »: only an account allowed to write recipes. The server stays the authority. */
export function canCreateRecipes(session: Session): boolean {
  return session.status === 'member' && session.roles.includes('USER')
}

/**
 * Whether to offer to change or delete a recipe: its author, and an administrator. The server
 * stays the authority (a refused change answers 403).
 */
export function canManageRecipe(session: Session, authorId: string | undefined): boolean {
  if (session.status !== 'member') return false
  return session.roles.includes('ADMIN') || (authorId !== undefined && session.userId === authorId)
}
