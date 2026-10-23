import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { LockedChip } from '../LockedChip/LockedChip'
import { RemovableChip } from './RemovableChip'

describe('RemovableChip', () => {
  it('shows the choice and is named by what pressing it does', () => {
    render(
      <RemovableChip
        label="Desserts"
        removeLabel="Retirer le filtre Desserts"
        onRemove={vi.fn()}
      />,
    )

    const chip = screen.getByRole('button', { name: 'Retirer le filtre Desserts' })
    expect(chip).toHaveTextContent('Desserts')
  })

  it('goes away with a touch or with the keyboard', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(
      <RemovableChip
        label="Desserts"
        removeLabel="Retirer le filtre Desserts"
        onRemove={onRemove}
      />,
    )

    await user.click(screen.getByRole('button'))
    await user.keyboard('{Enter}')

    expect(onRemove).toHaveBeenCalledTimes(2)
  })

  it('has no accessibility violation', async () => {
    const { container } = render(
      <div>
        <RemovableChip
          label="Desserts"
          removeLabel="Retirer le filtre Desserts"
          onRemove={vi.fn()}
        />
        <LockedChip label="Mes recettes" lockedLabel="verrouillé" />
      </div>,
    )

    await expectNoAccessibilityViolations(container)
  })
})

describe('LockedChip', () => {
  it('shows what is fixed and says it is locked, without being a control', () => {
    render(<LockedChip label="Mes recettes" lockedLabel="verrouillé" />)

    expect(screen.getByText(/Mes recettes/)).toHaveTextContent('Mes recettes verrouillé')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
