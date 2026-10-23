import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Button } from '../Button/Button'
import { AlertDialog } from './AlertDialog'

function renderDialog({ open = true, onAnswer = vi.fn() } = {}) {
  return render(
    <>
      <button type="button">Derrière le dialogue</button>
      <AlertDialog
        open={open}
        icon="lock"
        title="Ta session a expiré."
        description="Reconnecte-toi pour continuer."
      >
        <Button onClick={onAnswer}>Se reconnecter</Button>
        <Button variant="quiet" size="medium">
          Plus tard
        </Button>
      </AlertDialog>
    </>,
  )
}

describe('AlertDialog', () => {
  it('is announced as an alert dialog, named by its title and described by its text', () => {
    renderDialog()

    const dialog = screen.getByRole('alertdialog', { name: 'Ta session a expiré.' })
    expect(dialog).toHaveAccessibleDescription('Reconnecte-toi pour continuer.')
  })

  it('shows nothing while it is closed', () => {
    renderDialog({ open: false })

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('puts the focus on the first answer, which is the safe one', () => {
    renderDialog()

    expect(screen.getByRole('button', { name: 'Se reconnecter' })).toHaveFocus()
  })

  it('keeps the focus inside while the keyboard goes round', async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.tab()
    await user.tab()

    expect(screen.getByRole('button', { name: 'Se reconnecter' })).toHaveFocus()
  })

  it('hides the page behind it from assistive technology', () => {
    renderDialog()

    expect(screen.queryByRole('button', { name: 'Derrière le dialogue' })).not.toBeInTheDocument()
  })

  it('calls the answer that was chosen', async () => {
    const onAnswer = vi.fn()
    renderDialog({ onAnswer })

    await userEvent.setup().click(screen.getByRole('button', { name: 'Se reconnecter' }))

    expect(onAnswer).toHaveBeenCalledOnce()
  })

  it('cannot be dismissed: neither Escape nor a click beside it closes it', async () => {
    const user = userEvent.setup()
    renderDialog()

    const dialog = screen.getByRole('alertdialog')

    await user.keyboard('{Escape}')
    // The dark veil around the dialog is its parent.
    if (dialog.parentElement) await user.click(dialog.parentElement)

    expect(dialog).toBeVisible()
  })

  it('has no accessibility violation', async () => {
    renderDialog()

    await expectNoAccessibilityViolations(document.body)
  })
})
