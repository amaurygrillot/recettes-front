import { redirect, type LoaderFunctionArgs } from 'react-router'
import { getSession } from '../api/session'
import { logger } from '../lib/logger'
import { loginPath } from './paths'

/**
 * Loader of the pages that need a login: a visitor is sent to the login screen, which brings them
 * back to the page they asked for. It runs when a page is entered, not while it is open, so a
 * member whose session expires on a page stays on it (the dialog takes over).
 */
export function requireMember({ request }: LoaderFunctionArgs): Response | null {
  if (getSession().status !== 'visitor') return null

  const { pathname, search } = new URL(request.url)
  logger.info('A visitor asked for a page that needs a login', { path: pathname })
  return redirect(loginPath(`${pathname}${search}`))
}
