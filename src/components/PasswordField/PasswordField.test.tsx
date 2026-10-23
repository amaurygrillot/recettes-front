import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { PasswordField } from './PasswordField'

describe('PasswordField', () => {
  it('hides what is typed at first', () => {
    render(<PasswordField label="Mot de passe" />)

    expect(screen.getByLabelText('Mot de passe')).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Afficher le mot de passe' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('shows the characters on demand, and says what the button does next', async () => {
    const user = userEvent.setup()
    render(<PasswordField label="Mot de passe" defaultValue="secret-8" />)

    await user.click(screen.getByRole('button', { name: 'Afficher le mot de passe' }))

    expect(screen.getByLabelText('Mot de passe')).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('Mot de passe')).toHaveValue('secret-8')
    expect(screen.getByRole('button', { name: 'Masquer le mot de passe' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('hides them again with a second touch, and keeps the value', async () => {
    const user = userEvent.setup()
    render(<PasswordField label="Mot de passe" defaultValue="secret-8" />)

    await user.click(screen.getByRole('button', { name: 'Afficher le mot de passe' }))
    await user.click(screen.getByRole('button', { name: 'Masquer le mot de passe' }))

    expect(screen.getByLabelText('Mot de passe')).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText('Mot de passe')).toHaveValue('secret-8')
  })

  it('does not submit the form when the eye is touched', async () => {
    const user = userEvent.setup()
    let submitted = false
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault()
          submitted = true
        }}
      >
        <PasswordField label="Mot de passe" />
      </form>,
    )

    await user.click(screen.getByRole('button', { name: 'Afficher le mot de passe' }))

    expect(submitted).toBe(false)
  })

  it('keeps the messages of a text field', () => {
    render(<PasswordField label="Mot de passe" hint="8 caractères minimum" hintMet />)

    expect(screen.getByLabelText('Mot de passe')).toHaveAccessibleDescription(
      '8 caractères minimum',
    )
  })

  it('has no accessibility violation', async () => {
    const { container } = render(
      <form>
        <PasswordField label="Mot de passe" hint="8 caractères minimum" />
        <PasswordField
          label="Confirmation"
          error="Les deux mots de passe ne sont pas identiques."
        />
      </form>,
    )

    await expectNoAccessibilityViolations(container)
  })
})
