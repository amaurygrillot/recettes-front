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

  it('has no accessibility violation', async () => {
    const { container } = render(<ProgressBar label="Envoi de la photo" />)

    await expectNoAccessibilityViolations(container)
  })
})
