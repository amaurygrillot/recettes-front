import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// The browser only talks to the front's own origin; `/api/...` is forwarded to the back end with the
// prefix removed. That keeps the app usable from another device on the Wi-Fi (no CORS, and
// `localhost` never has to mean the phone) — see docs/frontend-stack.md.
const apiProxy = {
  '/api': {
    target: 'http://localhost:8080',
    rewrite: (path: string) => path.replace(/^\/api/, ''),
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // The back end's CORS origin and the password-reset e-mail link are both fixed to this port:
    // fail loudly instead of silently moving to 5174.
    port: 5173,
    strictPort: true,
    // Listen on every interface so that devices on the local network can open the app.
    host: true,
    proxy: apiProxy,
  },
  preview: { proxy: apiProxy },
  build: {
    rolldownOptions: {
      output: {
        // The libraries change far less often than the app: their own files stay cached across
        // releases, and none is the 500 kB lump that Vite warns about. A module goes to the first
        // group that matches, so React's narrower pattern comes before the catch-all.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules\/(?:react|react-dom|scheduler)\// },
            { name: 'vendor', test: /node_modules/ },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
