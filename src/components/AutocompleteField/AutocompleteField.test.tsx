import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { installKeyboardScreen, removeKeyboardScreen } from '../../test/keyboardScreen'
import {
  AutocompleteField,
  type AutocompleteFieldProps,
  type Suggestion,
} from './AutocompleteField'

const FLOURS: readonly Suggestion[] = [
  { id: 'blé', label: 'farine de blé' },
  { id: 'maïs', label: 'farine de maïs' },
  { id: 'riz', label: 'farine de riz' },
]

function Harness(props: Partial<AutocompleteFieldProps>) {
  const [text, setText] = useState('')
  return (
    <AutocompleteField
      label="Ingrédient"
      suggestionsLabel="Ingrédients existants"
      text={text}
      onTextChange={setText}
      suggestions={FLOURS}
      onChoose={vi.fn()}
      {...props}
    />
  )
}

const field = () => screen.getByRole('combobox', { name: 'Ingrédient' })

describe('AutocompleteField', () => {
  afterEach(removeKeyboardScreen)

  it('puts its list over the field, no taller than the room there is, when the keyboard leaves none under it', async () => {
    installKeyboardScreen({ fieldTop: 340, fieldBottom: 396, visibleHeight: 400, listHeight: 170 })
    render(<Harness />)

    await userEvent.setup().type(field(), 'far')

    const list = screen.getByRole('listbox', { name: 'Ingrédients existants' })
    expect(list).toHaveAttribute('data-placement', 'above')
    // Ends 8 px over the field, 170 px high.
    expect(list).toHaveStyle({ maxHeight: '170px', top: '162px' })
  })

  it('takes back the place it gave its list over the field when the list closes', async () => {
    installKeyboardScreen({ fieldTop: 340, fieldBottom: 396, visibleHeight: 400, listHeight: 170 })
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(field(), 'far')
    const list = screen.getByRole('listbox', { name: 'Ingrédients existants' })
    expect(list).toHaveAttribute('data-placement', 'above')
    await user.keyboard('{Escape}')

    expect(list).not.toBeVisible()
    expect(list).not.toHaveAttribute('data-placement')
    expect(list.style.top).toBe('')
    expect(list.style.maxHeight).toBe('')
  })

  it('does not place its list again for a scroll inside the list itself', async () => {
    installKeyboardScreen({ fieldTop: 340, fieldBottom: 396, visibleHeight: 400, listHeight: 170 })
    render(<Harness />)
    await userEvent.setup().type(field(), 'far')
    const list = screen.getByRole('listbox', { name: 'Ingrédients existants' })
    list.style.top = '5px'

    fireEvent.scroll(list)

    expect(list.style.top).toBe('5px')
  })

  it('keeps its list under the field when there is room there', async () => {
    installKeyboardScreen({ fieldTop: 100, fieldBottom: 156, visibleHeight: 700, listHeight: 170 })
    render(<Harness />)

    await userEvent.setup().type(field(), 'far')

    expect(screen.getByRole('listbox', { name: 'Ingrédients existants' })).not.toHaveAttribute(
      'data-placement',
    )
  })

  it('is a named combobox, closed until something is typed', () => {
    render(<Harness />)

    expect(field()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })

  it('opens its list under the field as soon as a letter is typed, with the letters in bold', async () => {
    render(<Harness />)

    await userEvent.setup().type(field(), 'far')

    expect(field()).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox', { name: 'Ingrédients existants' })).toBeVisible()
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'farine de blé',
      'farine de maïs',
      'farine de riz',
    ])
    expect(screen.getAllByText('far', { selector: 'b' })).toHaveLength(3)
  })

  it('chooses a suggestion when it is pressed, and closes the list', async () => {
    const onChoose = vi.fn()
    const user = userEvent.setup()
    render(<Harness onChoose={onChoose} />)

    await user.type(field(), 'far')
    await user.click(screen.getByRole('option', { name: 'farine de maïs' }))

    expect(onChoose).toHaveBeenCalledWith({ id: 'maïs', label: 'farine de maïs' })
    expect(field()).toHaveAttribute('aria-expanded', 'false')
  })

  it('chooses nothing by itself: leaving the field with text typed does not pick the first', async () => {
    const onChoose = vi.fn()
    const user = userEvent.setup()
    render(<Harness onChoose={onChoose} />)

    await user.type(field(), 'far')
    await user.tab()

    expect(onChoose).not.toHaveBeenCalled()
  })

  it('is driven with the arrows and Enter, the lit option being the one the field points at', async () => {
    const onChoose = vi.fn()
    const user = userEvent.setup()
    render(<Harness onChoose={onChoose} />)

    await user.type(field(), 'far')
    await user.keyboard('{ArrowDown}{ArrowDown}')

    expect(field()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'farine de maïs' }).id,
    )

    await user.keyboard('{Enter}')
    expect(onChoose).toHaveBeenCalledWith({ id: 'maïs', label: 'farine de maïs' })
  })

  it('goes up from nothing to the last option, and round again', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(field(), 'far')
    await user.keyboard('{ArrowUp}')
    expect(field()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'farine de riz' }).id,
    )

    await user.keyboard('{ArrowDown}')
    expect(field()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'farine de blé' }).id,
    )
  })

  it('does not choose with Enter when no option is lit', async () => {
    const onChoose = vi.fn()
    const user = userEvent.setup()
    render(<Harness onChoose={onChoose} />)

    await user.type(field(), 'far{Enter}')

    expect(onChoose).not.toHaveBeenCalled()
  })

  it('closes with Escape, and opens again with the next letter', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(field(), 'far{Escape}')
    expect(field()).toHaveAttribute('aria-expanded', 'false')

    await user.type(field(), 'i')
    expect(field()).toHaveAttribute('aria-expanded', 'true')
  })

  it('offers, as its last line, to make what was typed exist', async () => {
    const onCreate = vi.fn()
    const user = userEvent.setup()
    render(<Harness create={{ label: 'Créer « far »', onCreate }} />)

    await user.type(field(), 'far')
    const options = screen.getAllByRole('option')
    expect(options.at(-1)).toHaveTextContent('Créer « far »')

    const last = options.at(-1)
    if (last === undefined) throw new Error('No option to press')
    await user.click(last)
    expect(onCreate).toHaveBeenCalledOnce()
  })

  it('offers only to create when nothing exists', async () => {
    const user = userEvent.setup()
    render(<Harness suggestions={[]} create={{ label: 'Créer « kiwi »', onCreate: vi.fn() }} />)

    await user.type(field(), 'kiwi')

    expect(screen.getAllByRole('option')).toHaveLength(1)
  })

  it('says what is being made, in place of the suggestions, and is locked meanwhile', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Harness />)
    await user.type(field(), 'kiwi')

    rerender(
      <AutocompleteField
        label="Ingrédient"
        suggestionsLabel="Ingrédients existants"
        text="kiwi"
        onTextChange={vi.fn()}
        suggestions={[]}
        onChoose={vi.fn()}
        busyText="Création de « kiwi »…"
        disabled
      />,
    )

    expect(field()).toBeDisabled()
    expect(screen.getByRole('listbox', { name: 'Ingrédients existants' })).toHaveTextContent(
      'Création de « kiwi »…',
    )
  })

  it('marks the field as invalid and ties it to what says why', () => {
    render(
      <>
        <Harness invalid describedBy="why" />
        <p id="why">Choisis un ingrédient de la liste, ou crée-le.</p>
      </>,
    )

    expect(field()).toBeInvalid()
    expect(field()).toHaveAccessibleDescription('Choisis un ingrédient de la liste, ou crée-le.')
  })

  it('has no accessibility violation, open or closed', async () => {
    const { container } = render(<Harness />)
    await expectNoAccessibilityViolations(container)

    await userEvent.setup().type(field(), 'far')
    await expectNoAccessibilityViolations(container)
  })
})
