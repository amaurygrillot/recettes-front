import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { RecipeProblem } from './RecipeProblem'

function renderProblem(failure: Parameters<typeof RecipeProblem>[0]['failure'], retry = vi.fn()) {
  return {
    retry,
    ...render(
      <MemoryRouter>
        <RecipeProblem failure={failure} retry={retry} />
      </MemoryRouter>,
    ),
  }
}

describe('RecipeProblem', () => {
  it('says that the recipe is not there (404) and leads to the recipes', () => {
    renderProblem({ kind: 'not-found', status: 404, detail: undefined })

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: "Cette recette n'existe pas ou a été supprimée",
      }),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'Retour aux recettes' })).toHaveAttribute(
      'href',
      '/rechercher',
    )
  })

  it('says that the connection is lost, and tries again', async () => {
    const { retry } = renderProblem({ kind: 'network' })

    expect(screen.getByRole('alert')).toHaveTextContent('Pas de connexion pour le moment')
    await userEvent.setup().click(screen.getByRole('button', { name: 'Réessayer' }))

    expect(retry).toHaveBeenCalledOnce()
  })

  it('says why for any other cause', () => {
    renderProblem({ kind: 'server-error', status: 500, detail: undefined })

    expect(
      screen.getByRole('heading', { name: 'Impossible de charger cette recette' }),
    ).toBeVisible()
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeVisible()
  })

  it('has no accessibility violation', async () => {
    const { container } = renderProblem({ kind: 'not-found', status: 404, detail: undefined })

    await expectNoAccessibilityViolations(container)
  })
})
