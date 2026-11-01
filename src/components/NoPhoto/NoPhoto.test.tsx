import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { NoPhoto } from './NoPhoto'

describe('NoPhoto', () => {
  it('says there is no photo yet, with a drawing that is only decoration', () => {
    const { container } = render(<NoPhoto />)

    expect(screen.getByText('Pas encore de photo')).toBeVisible()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('has no accessibility violation', async () => {
    const { container } = render(<NoPhoto />)

    await expectNoAccessibilityViolations(container)
  })
})
