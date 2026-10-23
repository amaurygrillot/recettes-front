import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../test/expectNoAccessibilityViolations'
import { HeaderSearch } from './HeaderSearch'

function renderSearch(path = '/') {
  const router = createMemoryRouter(
    [
      { path: '/', element: <HeaderSearch /> },
      { path: '/rechercher', element: <HeaderSearch /> },
      { path: '/mes-recettes', element: <HeaderSearch /> },
    ],
    { initialEntries: [path] },
  )
  return { router, ...render(<RouterProvider router={router} />) }
}

describe('HeaderSearch', () => {
  it('is a search field with a name', () => {
    renderSearch()

    expect(screen.getByRole('search')).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Chercher une recette' })).toHaveAttribute(
      'placeholder',
      'Chercher une recette',
    )
  })

  it('opens the search page on what was typed when the reader presses Enter', async () => {
    const user = userEvent.setup()
    const { router } = renderSearch()

    await user.type(screen.getByRole('searchbox'), 'tarte & crème{Enter}')

    expect(router.state.location.pathname).toBe('/rechercher')
    expect(router.state.location.search).toBe('?q=tarte+%26+cr%C3%A8me')
  })

  it('ignores the spaces around the text', async () => {
    const user = userEvent.setup()
    const { router } = renderSearch()

    await user.type(screen.getByRole('searchbox'), '   gratin  {Enter}')

    expect(router.state.location.search).toBe('?q=gratin')
  })

  it('opens the search page with nothing to search when the field is empty', async () => {
    const user = userEvent.setup()
    const { router } = renderSearch()

    await user.click(screen.getByRole('searchbox'))
    await user.keyboard('{Enter}')

    expect(router.state.location.pathname).toBe('/rechercher')
    expect(router.state.location.search).toBe('')
  })

  describe('on a search page', () => {
    it.each(['/rechercher', '/mes-recettes'])(
      'is the field of the page itself on %s: typing searches after a pause, in the same page',
      async (path) => {
        const user = userEvent.setup()
        const { router } = renderSearch(path)

        await user.type(screen.getByRole('searchbox'), 'tarte')
        expect(router.state.location.search).toBe('')

        await waitFor(() => {
          expect(router.state.location.search).toBe('?q=tarte')
        })
        expect(router.state.location.pathname).toBe(path)
        expect(screen.getByRole('searchbox')).toHaveValue('tarte')
      },
    )

    it('shows the text of the address, and searches at once on Enter', async () => {
      const user = userEvent.setup()
      const { router } = renderSearch('/rechercher?q=gratin&categorie=c-1')
      expect(screen.getByRole('searchbox')).toHaveValue('gratin')

      await user.type(screen.getByRole('searchbox'), ' dauphinois{Enter}')

      expect(router.state.location.search).toBe('?q=gratin+dauphinois&categorie=c-1')
    })

    it('does not add a history entry for what is typed', async () => {
      const user = userEvent.setup()
      const { router } = renderSearch('/rechercher')

      await user.type(screen.getByRole('searchbox'), 'tarte{Enter}')

      expect(router.state.historyAction).toBe('REPLACE')
    })
  })

  it('has no accessibility violation', async () => {
    const { container } = renderSearch()

    await expectNoAccessibilityViolations(container)
  })
})
