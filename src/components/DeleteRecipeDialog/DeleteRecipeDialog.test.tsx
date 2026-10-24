import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { DeleteRecipeDialog } from './DeleteRecipeDialog'

function renderDialog({ busy = false } = {}) {
  const onCancel = vi.fn()
  const onConfirm = vi.fn()
  render(
    <DeleteRecipeDialog
      open
      recipeTitle="Tarte fine aux pommes"
      busy={busy}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />,
  )
  return { onCancel, onConfirm }
}

describe('DeleteRecipeDialog', () => {
  it('names the recipe and says it is irreversible, as an alert dialog', async () => {
    renderDialog()

    const dialog = await screen.findByRole('alertdialog', { name: 'Supprimer cette recette ?' })
    expect(dialog).toHaveTextContent('« Tarte fine aux pommes » sera supprimée pour toujours')
    expect(dialog).toHaveTextContent('irréversible')
  })

  it('puts the focus on « Annuler », so that Enter never deletes anything', async () => {
    renderDialog()

    expect(await screen.findByRole('button', { name: 'Annuler' })).toHaveFocus()
  })

  it('answers with the two buttons', async () => {
    const { onCancel, onConfirm } = renderDialog()
    const user = userEvent.setup()

    await user.click(await screen.findByRole('button', { name: 'Annuler' }))
    await user.click(screen.getByRole('button', { name: 'Supprimer la recette' }))

    expect(onCancel).toHaveBeenCalledOnce()
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('is busy while the request is on its way: nothing can be answered again', async () => {
    renderDialog({ busy: true })

    expect(await screen.findByRole('button', { name: /Supprimer la recette/ })).toHaveAttribute(
      'aria-busy',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Annuler' })).toBeDisabled()
  })

  it('has no accessibility violation', async () => {
    renderDialog()
    await screen.findByRole('alertdialog')

    await expectNoAccessibilityViolations(document.body)
  })
})
