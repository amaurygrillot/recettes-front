import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import type { NavigationItem } from '../TabBar/TabBar'
import { TopBar } from './TopBar'

const VISITOR_TABS: readonly NavigationItem[] = [
  { to: '/', label: 'Accueil', icon: 'home', end: true },
  { to: '/rechercher', label: 'Rechercher', icon: 'search' },
  { to: '/connexion', label: 'Se connecter', icon: 'log-in' },
]
const MEMBER_TABS: readonly NavigationItem[] = [
  { to: '/', label: 'Accueil', icon: 'home', end: true },
  { to: '/rechercher', label: 'Rechercher', icon: 'search' },
  { to: '/mes-recettes', label: 'Mes recettes', icon: 'book' },
  { to: '/compte', label: 'Compte', icon: 'user', avatarName: 'Camille Durand' },
]

interface BarOptions {
  path?: string
  withSearch?: boolean
}

function renderBar(
  items: readonly NavigationItem[],
  { path = '/', withSearch = false }: BarOptions = {},
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
            search={withSearch ? <input type="search" aria-label="Chercher une recette" /> : null}
          />
        ),
      },
    ],
    { initialEntries: [path] },
  )
  return { router, ...render(<RouterProvider router={router} />) }
}

/** Fails unless the links of the bar after the logo are named like this, in this order. */
function expectBarLabels(labels: readonly string[]) {
  const links = within(screen.getByRole('navigation')).getAllByRole('link').slice(1)
  expect(links).toHaveLength(labels.length)
  links.forEach((link, position) => {
    expect(link).toHaveAccessibleName(labels[position])
  })
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

    expectBarLabels(items.map((item) => item.label))
  })

  it('marks the page you are on, and only it, with aria-current', () => {
    renderBar(MEMBER_TABS, { path: '/rechercher' })

    const current = screen.getAllByRole('link').filter((link) => link.ariaCurrent === 'page')
    expect(current.map((link) => link.textContent)).toEqual(['Rechercher'])
  })

  it('puts the search field between the tabs and the account', () => {
    renderBar(MEMBER_TABS, { withSearch: true })

    const bar = within(screen.getByRole('navigation'))
    const searchField = bar.getByRole('searchbox', { name: 'Chercher une recette' })
    const myRecipes = bar.getByRole('link', { name: 'Mes recettes' })
    const account = bar.getByRole('link', { name: 'Compte' })

    expect(myRecipes.compareDocumentPosition(searchField)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(searchField.compareDocumentPosition(account)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it("shows the member's avatar on the account tab without adding it to the tab's name", () => {
    renderBar(MEMBER_TABS)

    const account = screen.getByRole('link', { name: 'Compte' })
    expect(account).toHaveTextContent('CD')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it("shows the account's icon instead when there is no avatar to show", () => {
    renderBar(VISITOR_TABS)

    const login = screen.getByRole('link', { name: 'Se connecter' })
    expect(login.querySelector('svg')).toBeInTheDocument()
    expect(login).not.toHaveTextContent(/^\p{Lu}{1,2}Se/u)
  })

  it('has no create button: the page that has a feed brings its own', () => {
    renderBar(MEMBER_TABS)

    expect(screen.queryByRole('link', { name: 'Nouvelle recette' })).not.toBeInTheDocument()
  })

  it('follows a link with the mouse and the keyboard', async () => {
    const user = userEvent.setup()
    const { router } = renderBar(MEMBER_TABS)

    await user.click(screen.getByRole('link', { name: 'Compte' }))
    expect(router.state.location.pathname).toBe('/compte')

    screen.getByRole('link', { name: 'Rechercher' }).focus()
    await user.keyboard('{Enter}')
    expect(router.state.location.pathname).toBe('/rechercher')
  })

  it.each([
    ['a visitor', VISITOR_TABS],
    ['a member', MEMBER_TABS],
  ])('has no accessibility violation for %s', async (_name, items) => {
    const { container } = renderBar(items, { withSearch: true })

    await expectNoAccessibilityViolations(container)
  })
})
