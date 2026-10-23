import createClient, { type Middleware } from 'openapi-fetch'
import { logger } from '../lib/logger'
import { API_BASE_URL } from './apiConfig'
import type { paths } from './schema'
import { sessionStore, type SessionStore } from './sessionStore'

type SessionTokens = Pick<SessionStore, 'getToken' | 'expire'>

const BEARER_PREFIX = 'Bearer '

/**
 * The routes whose purpose is to obtain a credential (`JwtAuthenticationFilter.CREDENTIAL_ENDPOINTS`
 * on the back end). They never carry the stored token: a stale one must not be able to get in the
 * way of logging in again.
 */
function isCredentialEndpoint(method: string, schemaPath: string): boolean {
  if (method === 'POST') return schemaPath.startsWith('/auth/') || schemaPath === '/users/create'
  return method === 'PUT' && schemaPath === '/users/reinit-password'
}

function describe(request: Request): { method: string; path: string } {
  return { method: request.method, path: new URL(request.url).pathname }
}

/** Attaches the token, and ends the session when the back end refuses it. */
function createAuthMiddleware(session: SessionTokens): Middleware {
  return {
    onRequest({ request, schemaPath }) {
      const token = session.getToken()
      if (token === null || isCredentialEndpoint(request.method, schemaPath)) return undefined
      request.headers.set('Authorization', `${BEARER_PREFIX}${token}`)
      return request
    },

    async onResponse({ request, response, options }) {
      const sentToken = request.headers.get('Authorization')?.replace(BEARER_PREFIX, '')
      if (response.status !== 401 || sentToken === undefined) return undefined

      session.expire(sentToken)
      // Every read is public, so a refused token must not break one: the app tells the member their
      // session is over, and the page they asked for still loads, as for a visitor.
      if (request.method !== 'GET') return undefined
      const headers = new Headers(request.headers)
      headers.delete('Authorization')
      return await options.fetch(new Request(request, { headers }))
    },
  }
}

/** Reports calls that fail, without ever looking at what they carry. */
const loggingMiddleware: Middleware = {
  onResponse({ request, response }) {
    if (response.ok) logger.debug('API call', { ...describe(request), status: response.status })
    else logger.warn('API call refused', { ...describe(request), status: response.status })
    return undefined
  },

  onError({ request }) {
    logger.warn('API unreachable', describe(request))
    return undefined
  },
}

export interface ApiClientOptions {
  baseUrl: string
  session: SessionTokens
}

export function createApiClient({ baseUrl, session }: ApiClientOptions) {
  const client = createClient<paths>({
    baseUrl,
    // openapi-fetch keeps the `fetch` it finds when the client is created, which would bypass
    // anything that patches it later (MSW in tests): look it up at call time instead.
    fetch: (request) => globalThis.fetch(request),
  })
  // onResponse runs in reverse order: the auth middleware sees the raw answer first (and may
  // replay it), the logger then reports the one the caller actually gets.
  client.use(loggingMiddleware, createAuthMiddleware(session))
  return client
}

/** The typed client of the back end. Screens do not use it directly: they use the hooks next to it. */
export const api = createApiClient({ baseUrl: API_BASE_URL, session: sessionStore })
