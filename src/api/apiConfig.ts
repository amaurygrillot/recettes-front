/**
 * Where the back end listens. Local development only for now: the back's CORS origin is fixed to
 * http://localhost:5173 and the deployment layout is still to be decided (docs/frontend-stack.md,
 * « Open items »), so there is no environment variable to read yet.
 */
export const API_BASE_URL = 'http://localhost:8080'
