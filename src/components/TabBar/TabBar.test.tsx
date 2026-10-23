import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { TabBar, type CreateAction, type NavigationItem } from './TabBar'

const VISITOR_TABS: readonly NavigationItem[] = [
  { to: '/', label: 'Accueil', icon: 'home', end: true },
  { to: '/rechercher', label: 'Rechercher', icon: 'search' },
  { to: '/connexion', label: 'Se connecter', icon: 'log-in' },
]
const MEMBER_TABS: readonly NavigationItem[] = [
  { to: '/', label: 'Accueil', icon: 'home', end: true },
  { to: '/rechercher', label: 'Rechercher', icon: 'search' },
  { to: '/mes-recettes', label: 'Mes recettes', icon: 'book' },
  { to: '/compte', label: 'Compte', icon: 'user' },
]
const CREATE: CreateAction = { to: '/recettes/nouvelle', label: 'Nouvelle recette' }

interface BarOptions {
  path?: string
  createAction?: CreateAction
  createExpanded?: boolean
}

function renderBar(
  items: readonly NavigationItem[],
  { path = '/', createAction, createExpanded }: BarOptions = {},
) {
  const router = createMemoryRouter(
    [
      {
        path: '*',
        element: (
          <TabBar
            label="Navigation principale"
            items={items}
            createAction={createAction}
            createExpanded={createExpanded}
          />
        ),
      },
    ],
    { initialEntries: [path] },
  )
  return { router, ...render(<RouterProvider router={router} />) }
}

describe('TabBar', () => {
  it('is one navigation landmark with a name', () => {
    renderBar(VISITOR_TABS)

    expect(screen.getAllByRole('navigation')).toHaveLength(1)
    expect(screen.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible()
  })

  it.each([
    ['a visitor', VISITOR_TABS, ['Accueil', 'Rechercher', 'Se connecter']],
    ['a member', MEMBER_TABS, ['Accueil', 'Rechercher', 'Mes recettes', 'Compte']],
  ])('lists the tabs of %s, in order, as real links', (_name, items, labels) => {
    renderBar(items)

    const links = within(screen.getByRole('navigation')).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual(labels)
    expect(links.map((link) => link.getAttribute('href'))).toEqual(items.map((item) => item.to))
  })

  it('marks the page you are on, and only it, with aria-current', () => {
    renderBar(MEMBER_TABS, { path: '/mes-recettes' })

    const current = screen.getAllByRole('link').filter((link) => link.ariaCurrent === 'page')
    expect(current.map((link) => link.textContent)).toEqual(['Mes recettes'])
  })

  it('does not keep the home tab current on every other page', () => {
    renderBar(MEMBER_TABS, { path: '/compte' })

    expect(screen.getByRole('link', { name: 'Accueil' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: 'Compte' })).toHaveAttribute('aria-current', 'page')
  })

  it('follows the link of a tab', async () => {
    const { router } = renderBar(VISITOR_TABS)

    await userEvent.setup().click(screen.getByRole('link', { name: 'Rechercher' }))

    expect(router.state.location.pathname).toBe('/rechercher')
  })

  it('is reached tab by tab with the keyboard', async () => {
    const user = userEvent.setup()
    renderBar(VISITOR_TABS)

    await user.tab()
    await user.tab()

    expect(screen.getByRole('link', { name: 'Rechercher' })).toHaveFocus()
  })

  describe('the « + »', () => {
    it('is a link that creates a recipe, named for assistive technology', () => {
      renderBar(MEMBER_TABS, { createAction: CREATE })

      expect(screen.getByRole('link', { name: 'Nouvelle recette' })).toHaveAttribute(
        'href',
        '/recettes/nouvelle',
      )
    })

    it('is not a tab: it sits outside the navigation', () => {
      renderBar(MEMBER_TABS, { createAction: CREATE })

      const navigation = screen.getByRole('navigation')
      expect(within(navigation).queryByRole('link', { name: 'Nouvelle recette' })).toBeNull()
    })

    it('is round by default: only the plus, named by its label', () => {
      renderBar(MEMBER_TABS, { createAction: CREATE })

      expect(screen.getByRole('link', { name: 'Nouvelle recette' })).toHaveTextContent('')
    })

    it('can show its label next to the plus, under the same name', () => {
      renderBar(MEMBER_TABS, { createAction: CREATE, createExpanded: true })

      const create = screen.getByRole('link', { name: 'Nouvelle recette' })
      expect(create).toHaveTextContent('Nouvelle recette')
      expect(create).toHaveAttribute('href', '/recettes/nouvelle')
    })

    it('is absent when there is nothing to create', () => {
      renderBar(VISITOR_TABS)

      expect(screen.queryByRole('link', { name: 'Nouvelle recette' })).not.toBeInTheDocument()
    })
  })

  it.each([
    ['a visitor', VISITOR_TABS, undefined, false],
    ['a member', MEMBER_TABS, CREATE, false],
    ['a member, with the extended « + »', MEMBER_TABS, CREATE, true],
  ])(
    'has no accessibility violation for %s',
    async (_name, items, createAction, createExpanded) => {
      const { container } = renderBar(items, createAction ? { createAction, createExpanded } : {})

      await expectNoAccessibilityViolations(container)
    },
  )
})
