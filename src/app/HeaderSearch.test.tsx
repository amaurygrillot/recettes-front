import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../test/expectNoAccessibilityViolations'
import { HeaderSearch } from './HeaderSearch'

function renderSearch() {
  const router = createMemoryRouter(
    [
      { path: '/', element: <HeaderSearch /> },
      { path: '/rechercher', element: <p>Page de recherche</p> },
    ],
    { initialEntries: ['/'] },
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

  it('has no accessibility violation', async () => {
    const { container } = renderSearch()

    await expectNoAccessibilityViolations(container)
  })
})
