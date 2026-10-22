import type { RouteObject } from 'react-router'
import { HomePlaceholder } from './HomePlaceholder'

// Only exists in development: `import.meta.env.DEV` is a build-time constant, so the dynamic
// import below (and the whole screen) is left out of the production bundle.
const styleguideRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: '/styleguide',
        lazy: async () => {
          const { StyleguideScreen } = await import('../screens/StyleguideScreen/StyleguideScreen')
          return { Component: StyleguideScreen }
        },
      },
    ]
  : []

export const routes: RouteObject[] = [
  { path: '/', element: <HomePlaceholder /> },
  ...styleguideRoutes,
]
