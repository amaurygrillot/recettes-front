import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { LinkButton } from './LinkButton'

function renderLink(variant: 'primary' | 'secondary' | 'quiet' = 'primary') {
  return render(
    <MemoryRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LinkButton to="/compte" variant={variant} icon="plus">
              Créer un compte
            </LinkButton>
          }
        />
        <Route path="/compte" element={<p>Page du compte</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('LinkButton', () => {
  it('is a link to where it goes, not a button', () => {
    renderLink()

    expect(screen.getByRole('link', { name: 'Créer un compte' })).toHaveAttribute('href', '/compte')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('goes there with the keyboard', async () => {
    const user = userEvent.setup()
    renderLink()

    await user.tab()
    expect(screen.getByRole('link', { name: 'Créer un compte' })).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(screen.getByText('Page du compte')).toBeVisible()
  })

  it.each(['primary', 'secondary', 'quiet'] as const)(
    'has no accessibility violation as %s',
    async (variant) => {
      const { container } = renderLink(variant)

      await expectNoAccessibilityViolations(container)
    },
  )
})
