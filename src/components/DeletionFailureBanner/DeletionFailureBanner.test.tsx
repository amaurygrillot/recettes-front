import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { DeletionFailureBanner } from './DeletionFailureBanner'

describe('DeletionFailureBanner', () => {
  it('announces that the recipe is still there, and why', () => {
    render(<DeletionFailureBanner cause="Le serveur ne répond pas." onRetry={vi.fn()} />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Suppression impossible. Le serveur ne répond pas.',
    )
  })

  it('offers the same deletion again', async () => {
    const onRetry = vi.fn()
    render(<DeletionFailureBanner cause="Le serveur ne répond pas." onRetry={onRetry} />)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Réessayer' }))

    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('has no accessibility violation', async () => {
    const { container } = render(
      <DeletionFailureBanner cause="Le serveur ne répond pas." onRetry={vi.fn()} />,
    )

    await expectNoAccessibilityViolations(container)
  })
})
