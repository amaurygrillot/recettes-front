import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { CheckboxRow } from '../CheckboxRow/CheckboxRow'
import { RadioRow } from './RadioRow'

const CHOICES = [
  { id: 'recent', label: 'Plus récentes' },
  { id: 'title', label: 'Titre A → Z' },
]

function Choice() {
  const [value, setValue] = useState('recent')
  return (
    <fieldset>
      <legend>Trier par</legend>
      {CHOICES.map(({ id, label }) => (
        <RadioRow
          key={id}
          name="sort"
          value={id}
          label={label}
          checked={value === id}
          onChange={() => {
            setValue(id)
          }}
        />
      ))}
    </fieldset>
  )
}

describe('RadioRow', () => {
  it('is a radio of a named group, one chosen at a time', async () => {
    const user = userEvent.setup()
    render(<Choice />)
    expect(screen.getByRole('radio', { name: 'Plus récentes' })).toBeChecked()

    await user.click(screen.getByRole('radio', { name: 'Titre A → Z' }))

    expect(screen.getByRole('radio', { name: 'Titre A → Z' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Plus récentes' })).not.toBeChecked()
    expect(screen.getByRole('group', { name: 'Trier par' })).toBeInTheDocument()
  })

  it('is chosen by touching its label, and moved through with the arrows', async () => {
    const user = userEvent.setup()
    render(<Choice />)

    await user.click(screen.getByText('Titre A → Z'))
    expect(screen.getByRole('radio', { name: 'Titre A → Z' })).toBeChecked()

    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('radio', { name: 'Plus récentes' })).toBeChecked()
  })

  it('cannot be chosen when disabled', async () => {
    render(<RadioRow name="x" value="a" label="Indisponible" disabled onChange={() => undefined} />)

    await userEvent.setup().click(screen.getByText('Indisponible'))

    expect(screen.getByRole('radio', { name: 'Indisponible' })).toBeDisabled()
    expect(screen.getByRole('radio', { name: 'Indisponible' })).not.toBeChecked()
  })

  it('has no accessibility violation', async () => {
    const { container } = render(<Choice />)

    await expectNoAccessibilityViolations(container)
  })
})

describe('CheckboxRow', () => {
  function Ticked() {
    const [ticked, setTicked] = useState(false)
    return (
      <CheckboxRow
        label="Uniquement cette catégorie"
        checked={ticked}
        onChange={(event) => {
          setTicked(event.target.checked)
        }}
      />
    )
  }

  it('is a checkbox ticked and unticked by touching its label or with the space bar', async () => {
    const user = userEvent.setup()
    render(<Ticked />)
    const box = screen.getByRole('checkbox', { name: 'Uniquement cette catégorie' })

    await user.click(screen.getByText('Uniquement cette catégorie'))
    expect(box).toBeChecked()

    await user.keyboard(' ')
    expect(box).not.toBeChecked()
  })

  it('cannot be ticked when disabled', async () => {
    render(<CheckboxRow label="Indisponible" disabled onChange={() => undefined} />)

    await userEvent.setup().click(screen.getByText('Indisponible'))

    expect(screen.getByRole('checkbox', { name: 'Indisponible' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: 'Indisponible' })).not.toBeChecked()
  })

  it('has no accessibility violation', async () => {
    const { container } = render(<Ticked />)

    await expectNoAccessibilityViolations(container)
  })
})
