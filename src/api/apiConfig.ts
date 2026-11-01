/**
 * Where the API is reached: the front's own origin, under `/api`. Vite's dev and preview servers
 * forward that prefix to the back end on port 8080 (vite.config.ts), so the app works from any
 * device that can open it and the back's CORS origin is never involved. The origin is absolute
 * because `fetch` outside a browser (tests) cannot resolve a relative URL; in a Node test, which has no
 * `location`, the dev server's origin stands in. The deployment layout is still to be decided
 * (docs/frontend-stack.md, « Open items »).
 */
const origin = 'location' in globalThis ? globalThis.location.origin : 'http://localhost:5173'

export const API_BASE_URL = `${origin}/api`
