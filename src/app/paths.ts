import { generatePath } from 'react-router'
import { criteriaToParams, EMPTY_CRITERIA } from './searchCriteria'

/** What the search page can be opened with, from the home page or the bar. */
interface SearchPreset {
  /** Opens with this category already chosen. */
  categoryId?: string | undefined
  /** Opens with this text in the title search. */
  query?: string | undefined
}

/** The URL patterns of the routes that take a parameter. The reset path below is fixed by the back end. */
export const ROUTE_PATTERNS = {
  recipe: '/recettes/:id',
  cooking: '/recettes/:id/pas-a-pas',
  editRecipe: '/recettes/:id/modifier',
} as const

/** Every URL of the app, built in one place so that a link cannot drift from its route. */
export const paths = {
  home: '/',
  search: '/rechercher',
  myRecipes: '/mes-recettes',
  newRecipe: '/recettes/nouvelle',
  recipe: (id: string) => generatePath(ROUTE_PATTERNS.recipe, { id }),
  cooking: (id: string) => generatePath(ROUTE_PATTERNS.cooking, { id }),
  editRecipe: (id: string) => generatePath(ROUTE_PATTERNS.editRecipe, { id }),
  login: '/connexion',
  register: '/inscription',
  forgotPassword: '/mot-de-passe-oublie',
  // The password-reset e-mail links here: `app.password-reset.frontend-reset-url` on the back end.
  // Change both together or not at all.
  resetPassword: '/reset-password',
  account: '/compte',
} as const

/** The search page, opened on a text and/or a category when there is one. */
export function searchPath({ categoryId, query }: SearchPreset = {}): string {
  const queryString = criteriaToParams({
    ...EMPTY_CRITERIA,
    categoryId,
    query: query ?? '',
  }).toString()
  return queryString === '' ? paths.search : `${paths.search}?${queryString}`
}

/** Whether a page is one of the two that search: the plain search and « Mes recettes ». */
export function isSearchPage(pathname: string): boolean {
  return pathname === paths.search || pathname === paths.myRecipes
}

const RETURN_PARAMETER = 'retour'
// Only used to read a path with the URL parser; no request is ever made to it.
const PLACEHOLDER_ORIGIN = 'http://app.invalid'

/** The login screen, remembering where to come back to once the visitor is a member. */
export function loginPath(returnTo?: string): string {
  if (returnTo === undefined) return paths.login
  return `${paths.login}?${new URLSearchParams({ [RETURN_PARAMETER]: returnTo }).toString()}`
}

/**
 * The page to go back to after logging in, read from the login URL's query. Only a path inside the
 * app is accepted: anything else (another site, `//host`, the login screen itself) is the home page,
 * so a crafted link cannot turn the login into an open redirect.
 */
export function returnPathFrom(search: URLSearchParams): string {
  const raw = search.get(RETURN_PARAMETER)
  if (!raw?.startsWith('/')) return paths.home

  const url = new URL(raw, PLACEHOLDER_ORIGIN)
  // The router ignores case and a trailing slash, so the login screen has to be recognised the same way.
  const isLogin = url.pathname.replace(/\/+$/, '').toLowerCase() === paths.login
  if (url.origin !== PLACEHOLDER_ORIGIN || isLogin) return paths.home
  const target = `${url.pathname}${url.search}${url.hash}`
  // Dot segments can leave `//host` behind, which a browser reads as another site.
  return target.startsWith('//') ? paths.home : target
}
