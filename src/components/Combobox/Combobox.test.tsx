import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Combobox, type ComboboxOption } from './Combobox'

const OPTIONS: readonly ComboboxOption[] = [
  { id: 'tartes', label: 'Tartes', hint: 'Desserts' },
  { id: 'tartinades', label: 'Tartinades', hint: 'Entrées' },
  { id: 'tartares', label: 'Tartares', hint: 'Entrées' },
  { id: 'plats', label: 'Plats' },
  { id: 'ete', label: 'Été' },
  { id: 'a', label: 'Ail' },
  { id: 'b', label: 'Ananas' },
  { id: 'c', label: 'Abricot' },
  { id: 'd', label: 'Avocat' },
  { id: 'e', label: 'Artichaut' },
  { id: 'f', label: 'Asperge' },
]

function Harness({ initial = [] }: { initial?: readonly string[] }) {
  const [selected, setSelected] = useState<readonly string[]>(initial)
  return (
    <Combobox
      label="Chercher une catégorie"
      placeholder="Chercher une catégorie"
      suggestionsLabel="Suggestions"
      options={OPTIONS}
      selectedIds={selected}
      onToggle={(option) => {
        setSelected((current) =>
          current.includes(option.id)
            ? current.filter((id) => id !== option.id)
            : [...current, option.id],
        )
      }}
      noResultText={(typed) => `Aucune catégorie pour « ${typed} »`}
    />
  )
}

const field = () => screen.getByRole('combobox', { name: 'Chercher une catégorie' })

describe('Combobox', () => {
  it('is a named combobox whose list is closed until something is typed', () => {
    render(<Harness />)

    expect(field()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })

  it('suggests from the first letter, on the start of a word, ignoring accents and case', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(field(), 'ta')
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Tartes · Desserts',
      'Tartinades · Entrées',
      'Tartares · Entrées',
    ])
    expect(field()).toHaveAttribute('aria-expanded', 'true')

    await user.clear(field())
    await user.type(field(), 'ETE')
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['Été'])
  })

  it('shows five suggestions at most', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(field(), 'a')

    expect(screen.getAllByRole('option')).toHaveLength(5)
  })

  it('writes the letters typed in bold', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(field(), 'tar')

    expect(within(screen.getByRole('option', { name: /Tartes/ })).getByText('Tar').tagName).toBe(
      'B',
    )
  })

  it('moves through the suggestions with the arrows, announcing the active one', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.type(field(), 'ta')
    expect(field()).not.toHaveAttribute('aria-activedescendant')

    await user.keyboard('{ArrowDown}')
    const [first, second] = screen.getAllByRole('option')
    expect(field()).toHaveAttribute('aria-activedescendant', first?.id)

    await user.keyboard('{ArrowDown}')
    expect(field()).toHaveAttribute('aria-activedescendant', second?.id)

    await user.keyboard('{ArrowUp}{ArrowUp}')
    expect(field()).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[2]?.id)
  })

  it('chooses the active suggestion on Enter, empties the field, keeps the focus and says so', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.type(field(), 'tartes')

    await user.keyboard('{ArrowDown}{Enter}')

    expect(field()).toHaveValue('')
    expect(field()).toHaveFocus()
    expect(screen.getByRole('status')).toHaveTextContent('Tartes ajouté')
  })

  it('never chooses a suggestion by itself: Enter on nothing does nothing', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.type(field(), 'tartes')

    await user.keyboard('{Enter}')

    expect(field()).toHaveValue('tartes')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('chooses a suggestion that is touched', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.type(field(), 'pl')

    await user.click(screen.getByRole('option', { name: 'Plats' }))

    expect(screen.getByRole('status')).toHaveTextContent('Plats ajouté')
    expect(field()).toHaveFocus()
  })

  it('shows what is already chosen as chosen, and removes it when touched, leaving the list open', async () => {
    const user = userEvent.setup()
    render(<Harness initial={['plats']} />)
    await user.type(field(), 'pl')
    expect(screen.getByRole('option', { name: 'Plats' })).toHaveAttribute('aria-selected', 'true')

    await user.click(screen.getByRole('option', { name: 'Plats' }))

    expect(screen.getByRole('option', { name: 'Plats' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('status')).toHaveTextContent('Plats retiré')
    expect(field()).toHaveValue('pl')
  })

  it('says what nothing matched, naming what was typed', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(field(), 'xyz')

    expect(screen.getByRole('status')).toHaveTextContent('Aucune catégorie pour « xyz »')
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })

  it('closes the list on Escape, then empties the field', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.type(field(), 'ta')

    await user.keyboard('{Escape}')
    expect(field()).toHaveAttribute('aria-expanded', 'false')
    expect(field()).toHaveValue('ta')

    await user.keyboard('{Escape}')
    expect(field()).toHaveValue('')
  })

  it('empties the field with its clear button and keeps typing possible', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.type(field(), 'ta')

    await user.click(screen.getByRole('button', { name: 'Effacer la recherche' }))

    expect(field()).toHaveValue('')
    expect(screen.queryByRole('button', { name: 'Effacer la recherche' })).not.toBeInTheDocument()
  })

  it('has no accessibility violation, closed, open and with no result', async () => {
    const user = userEvent.setup()
    const { container } = render(<Harness initial={['tartes']} />)
    await expectNoAccessibilityViolations(container)

    await user.type(field(), 'ta')
    await expectNoAccessibilityViolations(container)

    await user.clear(field())
    await user.type(field(), 'xyz')
    await expectNoAccessibilityViolations(container)
  })
})
