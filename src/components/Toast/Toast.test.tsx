import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Toast } from './Toast'

describe('Toast', () => {
  it('announces what worked politely, as a status, with a way to close it', async () => {
    const onClose = vi.fn()
    render(<Toast tone="success" message="Profil mis à jour" onClose={onClose} />)

    expect(screen.getByRole('status')).toHaveTextContent('Profil mis à jour')
    await userEvent.setup().click(screen.getByRole('button', { name: 'Fermer la notification' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('announces a failure at once, as an alert, with its cause', () => {
    render(
      <Toast
        tone="error"
        message="Enregistrement impossible."
        detail="Le serveur a rencontré un problème."
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enregistrement impossible.Le serveur a rencontré un problème.',
    )
  })

  it('runs its action when it is pressed', async () => {
    const onAction = vi.fn()
    render(
      <Toast
        tone="error"
        message="Enregistrement impossible."
        action={{ label: 'Réessayer', onAction }}
        onClose={vi.fn()}
      />,
    )

    await userEvent.setup().click(screen.getByRole('button', { name: 'Réessayer' }))

    expect(onAction).toHaveBeenCalledOnce()
  })

  it('has no action unless it is given one', () => {
    render(<Toast tone="success" message="Profil mis à jour" onClose={vi.fn()} />)

    expect(screen.queryByRole('button', { name: 'Réessayer' })).not.toBeInTheDocument()
  })

  it('has no accessibility violation', async () => {
    const { container } = render(
      <>
        <Toast tone="success" message="Profil mis à jour" onClose={vi.fn()} />
        <Toast
          tone="error"
          message="Enregistrement impossible."
          detail="Cause"
          action={{ label: 'Réessayer', onAction: vi.fn() }}
          onClose={vi.fn()}
        />
      </>,
    )

    await expectNoAccessibilityViolations(container)
  })
})
