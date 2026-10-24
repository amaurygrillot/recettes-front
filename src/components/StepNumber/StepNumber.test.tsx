import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StepNumber } from './StepNumber'

describe('StepNumber', () => {
  it('shows the number, hidden from assistive technology which hears it from the list', () => {
    render(<StepNumber number={3} />)

    expect(screen.getByText('3')).toHaveAttribute('aria-hidden', 'true')
  })

  it('can be the large stamp, with its word above the number, hidden in the same way', () => {
    render(<StepNumber number={3} word="ÉTAPE" />)

    expect(screen.getByText('ÉTAPE').parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
