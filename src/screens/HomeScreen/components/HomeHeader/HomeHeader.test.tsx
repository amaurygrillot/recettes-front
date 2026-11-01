import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../../../test/expectNoAccessibilityViolations'
import { installMatchMedia, removeMatchMedia } from '../../../../test/matchMedia'
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
  afterEach(() => {
    removeMatchMedia()
  })

  it('shows the logo as a link to the home page', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: /retour à l'accueil/ })).toHaveAttribute('href', '/')
  })

  it.each([390, 360])('writes the name beside the cocotte from 360 px (%i px)', (width) => {
    installMatchMedia(width)
    const { container } = renderHeader()

    expect(container.querySelector('text')).toHaveTextContent('Il en reste un peu')
  })

  it.each([359, 320])('keeps the compact mark, without the name, under 360 px (%i px)', (width) => {
    installMatchMedia(width)
    const { container } = renderHeader()

    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(container.querySelector('text')).not.toBeInTheDocument()
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
