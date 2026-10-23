import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('is a button named by its label, with the icon hidden from assistive technology', () => {
    const { container } = render(<IconButton label="Filtres" icon="filter" />)

    expect(screen.getByRole('button', { name: 'Filtres' })).toHaveAttribute('type', 'button')
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('cannot be written without a label', () => {
    // @ts-expect-error an icon-only button would have no accessible name
    const unlabeled = <IconButton icon="close" />

    expect(unlabeled).toBeDefined()
  })

  it('is pressed with a touch and with the keyboard', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<IconButton label="Fermer" icon="close" onClick={onClick} />)

    await user.click(screen.getByRole('button', { name: 'Fermer' }))
    await user.keyboard('{Enter}')

    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('does nothing when disabled', async () => {
    const onClick = vi.fn()
    render(<IconButton label="Fermer" icon="close" disabled onClick={onClick} />)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Fermer' }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('shows the count of what is active, as a decoration the label already says', () => {
    render(<IconButton label="Filtres, 2 actifs" icon="filter" badge={2} />)

    const button = screen.getByRole('button', { name: 'Filtres, 2 actifs' })
    expect(button).toHaveTextContent('2')
    expect(screen.getByText('2')).toHaveAttribute('aria-hidden', 'true')
  })

  it('shows no badge at zero', () => {
    render(<IconButton label="Filtres" icon="filter" badge={0} />)

    expect(screen.getByRole('button', { name: 'Filtres' })).toHaveTextContent('')
  })

  it('has no accessibility violation in any variant or size', async () => {
    const { container } = render(
      <div>
        <IconButton label="Filtres" icon="filter" />
        <IconButton label="Filtres, 1 actif" icon="filter" variant="active" badge={1} />
        <IconButton label="Fermer" icon="close" variant="bare" size="medium" />
      </div>,
    )

    await expectNoAccessibilityViolations(container)
  })
})
