import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../../../test/expectNoAccessibilityViolations'
import { HomeHeader } from './HomeHeader'

function renderHeader() {
  const router = createMemoryRouter(
    [
      { path: '/', element: <HomeHeader /> },
      { path: '/rechercher', element: <p>Page de recherche</p> },
    ],
    { initialEntries: ['/'] },
  )
  return { router, ...render(<RouterProvider router={router} />) }
}

describe('HomeHeader', () => {
  it('shows the logo as a link to the home page', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: /retour à l'accueil/ })).toHaveAttribute('href', '/')
  })

  it('shows a link that looks like a search field, named for what it does', () => {
    renderHeader()

    const prompt = screen.getByRole('link', { name: 'Chercher une recette : ouvrir la recherche' })
    expect(prompt).toHaveTextContent('Chercher une recette')
    expect(prompt).toHaveAttribute('href', '/rechercher')
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
  })

  it('opens the search page with a touch or the keyboard', async () => {
    const user = userEvent.setup()
    const { router } = renderHeader()

    await user.tab()
    await user.tab()
    expect(screen.getByRole('link', { name: /ouvrir la recherche/ })).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(router.state.location.pathname).toBe('/rechercher')
  })

  it('has no accessibility violation', async () => {
    const { container } = renderHeader()

    await expectNoAccessibilityViolations(container)
  })
})
