import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Button } from '../Button/Button'
import { ErrorBanner } from './ErrorBanner'

describe('ErrorBanner', () => {
  it('announces its message', () => {
    render(<ErrorBanner message="Le chargement s'est interrompu." />)

    expect(screen.getByRole('alert')).toHaveTextContent("Le chargement s'est interrompu.")
  })

  it('offers its action', async () => {
    const onRetry = vi.fn()
    render(
      <ErrorBanner message="Le chargement s'est interrompu.">
        <Button variant="secondary" size="medium" onClick={onRetry}>
          Réessayer
        </Button>
      </ErrorBanner>,
    )

    await userEvent.setup().click(screen.getByRole('button', { name: 'Réessayer' }))

    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('has no action when none is given', () => {
    render(<ErrorBanner message="Impossible de charger la suite." />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('has no accessibility violation', async () => {
    const { container } = render(
      <ErrorBanner message="Le chargement s'est interrompu.">
        <Button variant="secondary" size="medium">
          Réessayer
        </Button>
      </ErrorBanner>,
    )

    await expectNoAccessibilityViolations(container)
  })
})
