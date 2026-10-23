import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { CreateLink } from './CreateLink'

function renderLink(expanded: boolean) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: (
          <CreateLink to="/recettes/nouvelle" label="Nouvelle recette" expanded={expanded} />
        ),
      },
      { path: '/recettes/nouvelle', element: <p>Création</p> },
    ],
    { initialEntries: ['/'] },
  )
  return { router, ...render(<RouterProvider router={router} />) }
}

describe('CreateLink', () => {
  it.each([
    ['expanded', true],
    ['round', false],
  ])(
    'is a link to the creation page when %s, always named « Nouvelle recette »',
    (_form, expanded) => {
      renderLink(expanded)

      expect(screen.getByRole('link', { name: 'Nouvelle recette' })).toHaveAttribute(
        'href',
        '/recettes/nouvelle',
      )
    },
  )

  it('shows its label when expanded', () => {
    renderLink(true)

    expect(screen.getByRole('link')).toHaveTextContent('Nouvelle recette')
  })

  it('shows only the « + » when round, with the label as its accessible name', () => {
    const { container } = renderLink(false)

    expect(screen.getByRole('link')).toHaveTextContent('')
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('is reached and followed with the keyboard', async () => {
    const user = userEvent.setup()
    const { router } = renderLink(true)

    await user.tab()
    expect(screen.getByRole('link', { name: 'Nouvelle recette' })).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(router.state.location.pathname).toBe('/recettes/nouvelle')
  })

  it.each([
    ['expanded', true],
    ['round', false],
  ])('has no accessibility violation when %s', async (_form, expanded) => {
    const { container } = renderLink(expanded)

    await expectNoAccessibilityViolations(container)
  })
})
