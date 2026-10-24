import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { ChoiceField, type ChoiceFieldProps } from './ChoiceField'

function renderField(props: Partial<ChoiceFieldProps> = {}) {
  const onRemove = vi.fn()
  const onOpen = vi.fn()
  render(
    <ChoiceField
      label="Catégories"
      items={[]}
      chooseLabel="Choisir des catégories"
      addLabel="Ajouter une catégorie"
      removeLabel={(label) => `Retirer la catégorie ${label}`}
      onRemove={onRemove}
      onOpen={onOpen}
      {...props}
    />,
  )
  return { onRemove, onOpen }
}

describe('ChoiceField', () => {
  it('is a labelled group with one button that opens the list while nothing is chosen', async () => {
    const { onOpen } = renderField()

    expect(screen.getByRole('group', { name: 'Catégories' })).toBeVisible()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Choisir des catégories' }))

    expect(onOpen).toHaveBeenCalledOnce()
  })

  it('shows what is chosen as chips, each with a button that says what it removes', async () => {
    const { onRemove } = renderField({
      items: [
        { id: 'tartes', label: 'Desserts › Tartes' },
        { id: 'plats', label: 'Plats' },
      ],
    })

    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Retirer la catégorie Desserts › Tartes' }))

    expect(onRemove).toHaveBeenCalledWith('tartes')
    expect(screen.getByRole('button', { name: 'Retirer la catégorie Plats' })).toBeVisible()
  })

  it('offers to add one more once something is chosen', () => {
    renderField({ items: [{ id: 'plats', label: 'Plats' }] })

    expect(screen.getByRole('button', { name: 'Ajouter une catégorie' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Choisir des catégories' })).not.toBeInTheDocument()
  })

  it('says its note, and describes the group with its hint', () => {
    renderField({ note: 'facultatif', hint: 'Au moins une.' })

    expect(screen.getByText('facultatif')).toBeVisible()
    expect(screen.getByRole('group', { name: /^Catégories/ })).toHaveAccessibleDescription(
      'Au moins une.',
    )
  })

  it('replaces the hint with the error, in the brick frame', () => {
    renderField({ hint: 'Au moins une.', error: 'Choisis au moins une catégorie.' })

    expect(screen.getByRole('group', { name: 'Catégories' })).toHaveAccessibleDescription(
      'Choisis au moins une catégorie.',
    )
    expect(screen.queryByText('Au moins une.')).not.toBeInTheDocument()
  })

  it('has no accessibility violation', async () => {
    const { container } = render(
      <ChoiceField
        label="Tags"
        note="facultatif"
        items={[{ id: 'a', label: 'Fruits' }]}
        chooseLabel="Choisir des tags"
        addLabel="Ajouter un tag"
        removeLabel={(label) => `Retirer le tag ${label}`}
        onRemove={vi.fn()}
        onOpen={vi.fn()}
        error="Une erreur"
      />,
    )

    await expectNoAccessibilityViolations(container)
  })
})
