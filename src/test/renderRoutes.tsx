import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { createMemoryRouter, type InitialEntry, type RouteObject } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { createQueryWrapper } from './queryWrapper'

/**
 * Mounts a route tree at `path` (an address, or an address with the state it was reached with), with a fresh query cache, as the app does. `prepare` may put
 * something in that cache first, so that the first render already finds it.
 */
export function renderRoutes(
  routes: RouteObject[],
  path: InitialEntry,
  prepare?: (client: QueryClient) => void,
) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const { client } = createQueryWrapper()
  prepare?.(client)
  const rendered = render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return { router, client, ...rendered }
}
