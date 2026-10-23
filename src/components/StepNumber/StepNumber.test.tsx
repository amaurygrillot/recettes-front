import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StepNumber } from './StepNumber'

describe('StepNumber', () => {
  it('shows the number, hidden from assistive technology which hears it from the list', () => {
    render(<StepNumber number={3} />)

    expect(screen.getByText('3')).toHaveAttribute('aria-hidden', 'true')
  })
})
