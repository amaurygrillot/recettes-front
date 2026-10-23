import { QueryClient } from '@tanstack/react-query'
import { isTransient, type ApiRequestError } from './failure'

// Every query and mutation of the app fails with an ApiRequestError (see unwrap.ts), so screens
// read `error.failure` without checking what they were handed.
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiRequestError
  }
}

const MAX_QUERY_RETRIES = 2

/** A hiccup is worth another try; a 404 or a 400 will answer the same way next time. */
export function shouldRetryQuery(failureCount: number, error: ApiRequestError): boolean {
  return failureCount < MAX_QUERY_RETRIES && isTransient(error.failure)
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: shouldRetryQuery },
      // A mutation is not repeated behind the user's back: they decide whether to retry.
      mutations: { retry: false },
    },
  })
}
