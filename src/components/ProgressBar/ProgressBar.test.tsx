import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('says how far a task is', () => {
    render(<ProgressBar label="Envoi de la photo" value={64} />)

    const bar = screen.getByRole('progressbar', { name: 'Envoi de la photo' })
    expect(bar).toHaveAttribute('aria-valuenow', '64')
  })

  it('says nothing about how far it is when the length of the wait is not known', () => {
    render(<ProgressBar label="Envoi de la photo" />)

    expect(screen.getByRole('progressbar', { name: 'Envoi de la photo' })).not.toHaveAttribute(
      'aria-valuenow',
    )
  })

  it('can be thin, and still says how far it is', () => {
    render(<ProgressBar label="Étape 17 sur 24" value={70} size="thin" />)

    expect(screen.getByRole('progressbar', { name: 'Étape 17 sur 24' })).toHaveAttribute(
      'aria-valuenow',
      '70',
    )
  })

  it('has no accessibility violation', async () => {
    const { container } = render(<ProgressBar label="Envoi de la photo" />)

    await expectNoAccessibilityViolations(container)
  })
})
