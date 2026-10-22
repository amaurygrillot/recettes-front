import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { FilterChip } from './FilterChip'

describe('FilterChip', () => {
  it('announces that it is not chosen', () => {
    render(<FilterChip selected={false}>Desserts</FilterChip>)

    expect(screen.getByRole('button', { name: 'Desserts', pressed: false })).toBeVisible()
  })

  it('announces that it is chosen and shows a tick', () => {
    const { container } = render(<FilterChip selected>Rapide</FilterChip>)

    expect(screen.getByRole('button', { name: 'Rapide', pressed: true })).toBeVisible()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('shows no tick while it is not chosen', () => {
    const { container } = render(<FilterChip selected={false}>Desserts</FilterChip>)

    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  it('calls onClick with the mouse and with the keyboard', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <FilterChip selected={false} onClick={onClick}>
        Desserts
      </FilterChip>,
    )

    await user.click(screen.getByRole('button', { name: 'Desserts' }))
    await user.keyboard('{Enter}')

    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('does nothing when disabled', async () => {
    const onClick = vi.fn()
    render(
      <FilterChip selected={false} disabled onClick={onClick}>
        Désactivé
      </FilterChip>,
    )

    await userEvent.setup().click(screen.getByRole('button', { name: 'Désactivé' }))

    expect(screen.getByRole('button', { name: 'Désactivé' })).toBeDisabled()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('has no accessibility violation chosen, not chosen or disabled', async () => {
    const { container } = render(
      <div>
        <FilterChip selected={false}>Desserts</FilterChip>
        <FilterChip selected>Rapide</FilterChip>
        <FilterChip selected={false} disabled>
          Désactivé
        </FilterChip>
      </div>,
    )

    await expectNoAccessibilityViolations(container)
  })
})
