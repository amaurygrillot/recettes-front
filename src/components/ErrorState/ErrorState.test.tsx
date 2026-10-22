import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Button } from '../Button/Button'
import { ErrorState } from './ErrorState'

const TITLE = 'Impossible de charger les recettes'
const DESCRIPTION =
  "Un souci de notre côté. Tes recettes n'ont pas disparu : réessaie dans un instant."

describe('ErrorState', () => {
  it('announces what happened and what to do', () => {
    render(<ErrorState title={TITLE} description={DESCRIPTION} />)

    expect(screen.getByRole('alert')).toHaveTextContent(TITLE)
    expect(screen.getByRole('alert')).toHaveTextContent(DESCRIPTION)
    expect(screen.getByRole('heading', { level: 2, name: TITLE })).toBeVisible()
  })

  it('offers the way out it is given', async () => {
    const onRetry = vi.fn()
    render(
      <ErrorState title={TITLE} description={DESCRIPTION}>
        <Button icon="refresh" onClick={onRetry}>
          Réessayer
        </Button>
        <Button variant="quiet" size="medium">
          Retour à l'accueil
        </Button>
      </ErrorState>,
    )

    await userEvent.setup().click(screen.getByRole('button', { name: 'Réessayer' }))

    expect(onRetry).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: "Retour à l'accueil" })).toBeVisible()
  })

  it('has no action when none is given', () => {
    render(<ErrorState title={TITLE} description={DESCRIPTION} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('has no accessibility violation', async () => {
    const { container } = render(
      <ErrorState title={TITLE} description={DESCRIPTION}>
        <Button icon="refresh">Réessayer</Button>
      </ErrorState>,
    )

    await expectNoAccessibilityViolations(container)
  })
})
