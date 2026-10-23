import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { NotFoundScreen } from './NotFoundScreen'

function renderScreen() {
  return render(
    <MemoryRouter>
      <NotFoundScreen />
    </MemoryRouter>,
  )
}

describe('NotFoundScreen', () => {
  it('says the page does not exist', () => {
    renderScreen()

    expect(screen.getByRole('heading', { name: "Cette page n'existe pas" })).toBeVisible()
  })

  it('offers the way back to the home page', () => {
    renderScreen()

    expect(screen.getByRole('link', { name: "Retour à l'accueil" })).toHaveAttribute('href', '/')
  })

  it('has no accessibility violation', async () => {
    const { container } = renderScreen()

    await expectNoAccessibilityViolations(container)
  })
})
