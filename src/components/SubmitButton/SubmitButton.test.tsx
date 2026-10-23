import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SubmitButton } from './SubmitButton'

function renderInForm(pending: boolean, onSubmit = vi.fn()) {
  render(
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <SubmitButton pending={pending} label="Créer mon compte" pendingLabel="Création du compte…" />
    </form>,
  )
  return onSubmit
}

describe('SubmitButton', () => {
  it('sends the form it is in', async () => {
    const onSubmit = renderInForm(false)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Créer mon compte' }))

    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('says what is happening while the request is on its way, and sends nothing more', async () => {
    const onSubmit = renderInForm(true)
    const button = screen.getByRole('button', { name: 'Création du compte…' })

    await userEvent.setup().click(button)

    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
