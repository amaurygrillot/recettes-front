import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { CheckboxRow } from './CheckboxRow'

describe('CheckboxRow', () => {
  it('is a checkbox named by its label, touchable by its whole row', async () => {
    const onChange = vi.fn()
    render(<CheckboxRow label="Tartes" onChange={onChange} />)

    await userEvent.setup().click(screen.getByText('Tartes'))

    expect(onChange).toHaveBeenCalledOnce()
    expect(screen.getByRole('checkbox', { name: 'Tartes' })).toBeChecked()
  })

  it('has a name that includes its hint, with a space between', () => {
    render(<CheckboxRow label="Tartes" hint="Desserts › Tartes" onChange={vi.fn()} />)

    expect(screen.getByRole('checkbox', { name: 'Tartes Desserts › Tartes' })).toBeVisible()
  })

  it('cannot be ticked when disabled', async () => {
    render(<CheckboxRow label="Tartes" disabled onChange={vi.fn()} />)

    await userEvent.setup().click(screen.getByText('Tartes'))

    expect(screen.getByRole('checkbox', { name: 'Tartes' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: 'Tartes' })).not.toBeChecked()
  })

  it('has no accessibility violation', async () => {
    const { container } = render(
      <>
        <CheckboxRow label="Desserts" defaultChecked />
        <CheckboxRow label="Tartes" hint="Desserts › Tartes" />
      </>,
    )

    await expectNoAccessibilityViolations(container)
  })
})
