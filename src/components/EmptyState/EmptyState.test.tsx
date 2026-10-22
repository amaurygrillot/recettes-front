import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { BowlIllustration } from '../BowlIllustration/BowlIllustration'
import { Button } from '../Button/Button'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('states the finding as a heading and explains what to do', () => {
    render(
      <EmptyState
        illustration={<BowlIllustration variant="first-visit" />}
        title="Ton carnet est vide"
        description="Ajoute ta première recette : une photo, les ingrédients, quelques étapes."
      />,
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Ton carnet est vide' })).toBeVisible()
    expect(screen.getByText(/Ajoute ta première recette/)).toBeVisible()
  })

  it('offers its action', async () => {
    const onCreate = vi.fn()
    render(
      <EmptyState
        illustration={<BowlIllustration variant="first-visit" />}
        title="Ton carnet est vide"
        description="Ajoute ta première recette."
      >
        <Button icon="plus" onClick={onCreate}>
          Créer une recette
        </Button>
      </EmptyState>,
    )

    await userEvent.setup().click(screen.getByRole('button', { name: 'Créer une recette' }))

    expect(onCreate).toHaveBeenCalledOnce()
  })

  it('has no action when none is given', () => {
    render(
      <EmptyState
        illustration={<BowlIllustration variant="no-result" />}
        title="Rien ne correspond"
        description="Retire un filtre ou deux."
      />,
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('has no accessibility violation', async () => {
    const { container } = render(
      <EmptyState
        illustration={<BowlIllustration variant="no-result" />}
        title="Rien ne correspond"
        description="Retire un filtre ou deux."
      >
        <Button variant="secondary">Effacer les filtres</Button>
      </EmptyState>,
    )

    await expectNoAccessibilityViolations(container)
  })
})
