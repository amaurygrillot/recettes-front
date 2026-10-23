import type { RouteObject } from 'react-router'
import { HomeScreen } from '../screens/HomeScreen/HomeScreen'
import { RecipeScreen } from '../screens/RecipeScreen/RecipeScreen'
import { MyRecipesScreen } from '../screens/SearchScreen/MyRecipesScreen'
import { SearchScreen } from '../screens/SearchScreen/SearchScreen'
import { NotFoundScreen } from '../screens/NotFoundScreen/NotFoundScreen'
import { AccountPlaceholder } from './AccountPlaceholder'
import { AppShell } from './AppShell'
import { paths, ROUTE_PATTERNS } from './paths'
import { requireMember } from './requireMember'
import { RootFallback } from './RootFallback'
import { RootLayout } from './RootLayout'
import { RouteError } from './RouteError'
import { ScreenPlaceholder } from './ScreenPlaceholder'
import { strings } from './strings'

const { placeholder } = strings

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

// Pages with the navigation around them.
const pagesWithNavigation: RouteObject[] = [
  { index: true, element: <HomeScreen /> },
  { path: paths.search, element: <SearchScreen /> },
  { path: ROUTE_PATTERNS.recipe, element: <RecipeScreen /> },
  {
    loader: requireMember,
    children: [
      { path: paths.myRecipes, element: <MyRecipesScreen /> },
      { path: paths.account, element: <AccountPlaceholder /> },
    ],
  },
  { path: '*', element: <NotFoundScreen /> },
]

// Full-screen tasks: no navigation, the screen has the whole page.
const fullScreenPages: RouteObject[] = [
  {
    path: paths.login,
    lazy: async () => {
      const { LoginScreen } = await import('../screens/LoginScreen/LoginScreen')
      return { Component: LoginScreen }
    },
  },
  { path: paths.register, element: <ScreenPlaceholder title={placeholder.register} /> },
  { path: paths.forgotPassword, element: <ScreenPlaceholder title={placeholder.forgotPassword} /> },
  { path: paths.resetPassword, element: <ScreenPlaceholder title={placeholder.resetPassword} /> },
  { path: ROUTE_PATTERNS.cooking, element: <ScreenPlaceholder title={placeholder.cooking} /> },
  {
    loader: requireMember,
    children: [
      { path: paths.newRecipe, element: <ScreenPlaceholder title={placeholder.newRecipe} /> },
      {
        path: ROUTE_PATTERNS.editRecipe,
        element: <ScreenPlaceholder title={placeholder.editRecipe} />,
      },
    ],
  },
  ...styleguideRoutes,
]

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    HydrateFallback: RootFallback,
    errorElement: <RouteError />,
    children: [
      {
        element: <AppShell />,
        // Inside the shell, so that a failing page keeps the navigation around its error.
        children: [{ errorElement: <RouteError />, children: pagesWithNavigation }],
      },
      { errorElement: <RouteError />, children: fullScreenPages },
    ],
  },
]
