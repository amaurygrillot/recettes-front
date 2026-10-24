import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { SelectField } from './SelectField'

const UNITS = [
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
]

function Harness({ invalid = false }: { invalid?: boolean }) {
  const [value, setValue] = useState('')
  return (
    <SelectField
      label="Unité"
      emptyLabel="—"
      options={UNITS}
      value={value}
      invalid={invalid}
      onChange={(event) => {
        setValue(event.target.value)
      }}
    />
  )
}

describe('SelectField', () => {
  it('is a select with its label, and « none » as the first choice', () => {
    render(<Harness />)

    const select = screen.getByRole('combobox', { name: 'Unité' })
    expect(select).toHaveValue('')
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      '—',
      'g',
      'kg',
    ])
  })

  it('answers with the value chosen', async () => {
    render(<Harness />)

    await userEvent.setup().selectOptions(screen.getByRole('combobox', { name: 'Unité' }), 'kg')

    expect(screen.getByRole('combobox', { name: 'Unité' })).toHaveValue('kg')
  })

  it('can be marked invalid, its words being said elsewhere', () => {
    render(<Harness invalid />)

    expect(screen.getByRole('combobox', { name: 'Unité' })).toBeInvalid()
  })

  it('has no accessibility violation', async () => {
    const { container } = render(<Harness />)

    await expectNoAccessibilityViolations(container)
  })
})
