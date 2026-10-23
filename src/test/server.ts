import { setupServer } from 'msw/node'

/**
 * The fake back end of every test. It starts with no handler on purpose: a test declares the
 * answers it needs with `server.use(...)`, and a request nobody answered fails the test.
 */
export const server = setupServer()
