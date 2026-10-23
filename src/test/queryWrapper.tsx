import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

interface QueryWrapper {
  client: QueryClient
  wrapper: (props: { children: ReactNode }) => ReactNode
}

/** A fresh query cache for one test, without retries so that a failure shows up at once. */
export function createQueryWrapper(): QueryWrapper {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return {
    client,
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  }
}
