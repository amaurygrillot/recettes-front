import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CardPill } from './CardPill'

describe('CardPill', () => {
  it.each(['category', 'tag', 'overflow'] as const)('shows its text as the %s kind', (tone) => {
    render(<CardPill tone={tone}>Dessert</CardPill>)

    expect(screen.getByText('Dessert')).toBeVisible()
  })

  it('is a label, not a control', () => {
    render(<CardPill tone="tag">Fruits</CardPill>)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
