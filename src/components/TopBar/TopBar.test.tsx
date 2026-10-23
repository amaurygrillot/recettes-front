import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import type { CreateAction, NavigationItem } from '../TabBar/TabBar'
import { TopBar } from './TopBar'

const VISITOR_TABS: readonly NavigationItem[] = [
  { to: '/', label: 'Accueil', icon: 'home' },
  { to: '/rechercher', label: 'Rechercher', icon: 'search' },
  { to: '/connexion', label: 'Se connecter', icon: 'log-in' },
]
const MEMBER_TABS: readonly NavigationItem[] = [
  { to: '/', label: 'Accueil', icon: 'home' },
  { to: '/rechercher', label: 'Rechercher', icon: 'search' },
  { to: '/mes-recettes', label: 'Mes recettes', icon: 'book' },
  { to: '/compte', label: 'Compte', icon: 'user' },
]
const CREATE: CreateAction = { to: '/recettes/nouvelle', label: 'Nouvelle recette' }

interface BarOptions {
  path?: string
  createAction?: CreateAction
}

function renderBar(
  items: readonly NavigationItem[],
  { path = '/', createAction }: BarOptions = {},
) {
  const router = createMemoryRouter(
    [
      {
        path: '*',
        element: (
          <TopBar
            label="Navigation principale, ordinateur"
            homeLabel="Il en reste un peu, retour à l'accueil"
            items={items}
            createAction={createAction}
          />
        ),
      },
    ],
    { initialEntries: [path] },
  )
  return { router, ...render(<RouterProvider router={router} />) }
}

/** The links of the bar after the logo, in the order they are laid out. */
function barLabels(): (string | null)[] {
  return within(screen.getByRole('navigation'))
    .getAllByRole('link')
    .slice(1)
    .map((link) => link.textContent)
}

describe('TopBar', () => {
  it('is one navigation landmark with a name', () => {
    renderBar(VISITOR_TABS)

    expect(
      screen.getByRole('navigation', { name: 'Navigation principale, ordinateur' }),
    ).toBeInTheDocument()
  })

  it('starts with the logo, a link to the home page named for assistive technology', () => {
    renderBar(MEMBER_TABS)

    const home = within(screen.getByRole('navigation')).getAllByRole('link')[0]
    expect(home).toHaveAccessibleName("Il en reste un peu, retour à l'accueil")
    expect(home).toHaveAttribute('href', '/')
  })

  it.each([
    ['a visitor', VISITOR_TABS],
    ['a member', MEMBER_TABS],
  ])('shows the same tabs as the phone for %s, in the same order', (_name, items) => {
    renderBar(items)

    expect(barLabels()).toEqual(items.map((item) => item.label))
  })

  it('marks the page you are on, and only it, with aria-current', () => {
    renderBar(MEMBER_TABS, { path: '/rechercher' })

    const current = screen.getAllByRole('link').filter((link) => link.ariaCurrent === 'page')
    expect(current.map((link) => link.textContent)).toEqual(['Rechercher'])
  })

  it('puts the create button before the account, at the right of the bar', () => {
    renderBar(MEMBER_TABS, { createAction: CREATE })

    expect(barLabels()).toEqual([
      'Accueil',
      'Rechercher',
      'Mes recettes',
      'Nouvelle recette',
      'Compte',
    ])
  })

  it('has no create button for a visitor', () => {
    renderBar(VISITOR_TABS)

    expect(screen.queryByRole('link', { name: 'Nouvelle recette' })).not.toBeInTheDocument()
  })

  it('follows a link with the mouse and the keyboard', async () => {
    const user = userEvent.setup()
    const { router } = renderBar(MEMBER_TABS, { createAction: CREATE })

    await user.click(screen.getByRole('link', { name: 'Compte' }))
    expect(router.state.location.pathname).toBe('/compte')

    screen.getByRole('link', { name: 'Nouvelle recette' }).focus()
    await user.keyboard('{Enter}')
    expect(router.state.location.pathname).toBe('/recettes/nouvelle')
  })

  it.each([
    ['a visitor', VISITOR_TABS, undefined],
    ['a member', MEMBER_TABS, CREATE],
  ])('has no accessibility violation for %s', async (_name, items, createAction) => {
    const { container } = renderBar(items, createAction ? { createAction } : {})

    await expectNoAccessibilityViolations(container)
  })
})
