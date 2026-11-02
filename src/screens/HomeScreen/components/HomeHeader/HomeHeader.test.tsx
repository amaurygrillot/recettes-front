import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SearchOverlayContext } from '../../../../app/useSearchOverlay'
import { expectNoAccessibilityViolations } from '../../../../test/expectNoAccessibilityViolations'
import { installMatchMedia, removeMatchMedia } from '../../../../test/matchMedia'
import { HomeHeader } from './HomeHeader'

function renderHeader() {
  const openSearch = vi.fn()
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: (
          <SearchOverlayContext value={openSearch}>
            <HomeHeader />
          </SearchOverlayContext>
        ),
      },
    ],
    { initialEntries: ['/'] },
  )
  return { router, openSearch, ...render(<RouterProvider router={router} />) }
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

  it('shows a button that looks like a search field, and opens a dialog', () => {
    renderHeader()

    const prompt = screen.getByRole('button', { name: 'Chercher une recette' })
    expect(prompt).toHaveTextContent('Chercher une recette')
    expect(prompt).toHaveAttribute('aria-haspopup', 'dialog')
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
  })

  it('opens the search over the page with a touch, and with the keyboard', async () => {
    const user = userEvent.setup()
    const { router, openSearch } = renderHeader()

    await user.click(screen.getByRole('button', { name: 'Chercher une recette' }))
    await user.keyboard('{Enter}')

    expect(openSearch).toHaveBeenCalledTimes(2)
    expect(openSearch).toHaveBeenCalledWith({})
    expect(router.state.location.pathname).toBe('/')
  })

  it('carries the first key typed on it into the search', async () => {
    const user = userEvent.setup()
    const { openSearch } = renderHeader()
    screen.getByRole('button', { name: 'Chercher une recette' }).focus()

    await user.keyboard('t')

    expect(openSearch).toHaveBeenCalledExactlyOnceWith({ typed: 't' })
  })

  it('has no accessibility violation', async () => {
    const { container } = renderHeader()

    await expectNoAccessibilityViolations(container)
  })
})
