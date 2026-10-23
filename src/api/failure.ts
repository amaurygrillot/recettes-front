/** What a failed API call means, as a small union the screens can switch on (`failure.kind`). */

/** What the back's `application/problem+json` body adds to the status. */
interface ProblemInfo {
  readonly status: number
  /** The back's own explanation, for a `400` the field that was wrong. English: for logs and fine print, not for the title. */
  readonly detail: string | undefined
}

/** Seconds to wait before asking again; absent when the back did not say. */
interface RetryHint {
  readonly retryAfterSeconds: number | undefined
}

export type ApiFailure =
  /** No answer at all: offline, server down, or a request the browser blocked (CORS). */
  | { readonly kind: 'network' }
  /** 400: the input is wrong; `detail` names the field. */
  | (ProblemInfo & { readonly kind: 'invalid-request' })
  /** 401: no token, a broken or expired token, or (on login) wrong credentials. */
  | (ProblemInfo & { readonly kind: 'unauthorized' })
  /** 403: authenticated but not allowed (also a wrong current password on account updates). */
  | (ProblemInfo & { readonly kind: 'forbidden' })
  /** 404: the resource in the path does not exist. */
  | (ProblemInfo & { readonly kind: 'not-found' })
  /** 409: duplicate username, e-mail or name; a row still in use. */
  | (ProblemInfo & { readonly kind: 'conflict' })
  /** 413: the upload is over the size limit. */
  | (ProblemInfo & { readonly kind: 'payload-too-large' })
  /** 429: too many uploads from this caller. */
  | (ProblemInfo & RetryHint & { readonly kind: 'rate-limited' })
  /** 503: the server is momentarily at capacity. */
  | (ProblemInfo & RetryHint & { readonly kind: 'unavailable' })
  /** Any other 5xx. */
  | (ProblemInfo & { readonly kind: 'server-error' })
  /** Anything the contract does not describe: 406, 415, a redirect, an empty success where a body was due, a bug. */
  | {
      readonly kind: 'unexpected'
      /** Absent when no HTTP answer is involved (a bug on our side). */
      readonly status: number | undefined
      readonly detail: string | undefined
    }

export type ApiFailureKind = ApiFailure['kind']

/** The error TanStack Query hands to screens: the failure travels in `failure`. */
export class ApiRequestError extends Error {
  readonly failure: ApiFailure

  constructor(failure: ApiFailure) {
    super(`API call failed: ${failure.kind}`)
    this.name = 'ApiRequestError'
    this.failure = failure
  }
}

/** Whether asking again later can succeed, as opposed to a request that will keep being refused. */
export function isTransient(failure: ApiFailure): boolean {
  return (
    failure.kind === 'network' ||
    failure.kind === 'unavailable' ||
    failure.kind === 'server-error' ||
    failure.kind === 'rate-limited'
  )
}

function readDetail(body: unknown): string | undefined {
  if (typeof body !== 'object' || body === null || !('detail' in body)) return undefined
  return typeof body.detail === 'string' && body.detail !== '' ? body.detail : undefined
}

/** `Retry-After` is whole seconds on this back end; an HTTP date or garbage reads as « not said ». */
function readRetryAfter(response: Response): number | undefined {
  const raw = response.headers.get('Retry-After')
  if (raw === null || !/^\d+$/.test(raw.trim())) return undefined
  return Number(raw)
}

/**
 * The one place that turns a non-2xx answer into a failure. `body` is what openapi-fetch parsed
 * (the problem+json object, or the raw text when the body was not JSON, or nothing).
 */
export function failureFromResponse(response: Response, body: unknown): ApiFailure {
  const info: ProblemInfo = { status: response.status, detail: readDetail(body) }

  switch (response.status) {
    case 400:
      return { kind: 'invalid-request', ...info }
    case 401:
      return { kind: 'unauthorized', ...info }
    case 403:
      return { kind: 'forbidden', ...info }
    case 404:
      return { kind: 'not-found', ...info }
    case 409:
      return { kind: 'conflict', ...info }
    case 413:
      return { kind: 'payload-too-large', ...info }
    case 429:
      return { kind: 'rate-limited', ...info, retryAfterSeconds: readRetryAfter(response) }
    case 503:
      return { kind: 'unavailable', ...info, retryAfterSeconds: readRetryAfter(response) }
    default:
      return response.status >= 500
        ? { kind: 'server-error', ...info }
        : { kind: 'unexpected', ...info }
  }
}
