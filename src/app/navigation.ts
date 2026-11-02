import type { Session } from '../api/sessionStore'
import type { NavigationAction, NavigationItem, NavigationLink } from '../components/TabBar/TabBar'
import { paths } from './paths'
import { strings } from './strings'

const { navigation } = strings

const HOME: NavigationLink = { to: paths.home, label: navigation.home, icon: 'home', end: true }
const MY_RECIPES: NavigationLink = {
  to: paths.myRecipes,
  label: navigation.myRecipes,
  icon: 'book',
}
const ACCOUNT: NavigationLink = { to: paths.account, label: navigation.account, icon: 'user' }
const LOGIN: NavigationLink = { to: paths.login, label: navigation.login, icon: 'log-in' }

/**
 * The pages the navigation leads to, for a tablet's tabs and a desktop's bar: the search is not one of
 * them, it is the field. A member whose session just expired already sees the visitor's.
 */
export function navigationLinks(session: Session): NavigationLink[] {
  if (session.status !== 'member') return [HOME, LOGIN]
  return [HOME, MY_RECIPES, { ...ACCOUNT, avatarName: session.username }]
}

/** The phone's tabs: the same pages, with « Rechercher » second, which opens the search over the page. */
export function phoneNavigation(session: Session, search: NavigationAction): NavigationItem[] {
  return [HOME, search, ...navigationLinks(session).slice(1)]
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
