import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { TextField } from './TextField'

describe('TextField', () => {
  it('is labelled by its visible label', () => {
    render(<TextField label="Titre de la recette" />)

    expect(screen.getByLabelText('Titre de la recette')).toBeVisible()
  })

  it('reports changes and shows an initial value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TextField label="Titre" defaultValue="Gratin" onChange={onChange} />)

    await user.type(screen.getByLabelText('Titre'), 's')

    expect(screen.getByLabelText('Titre')).toHaveValue('Gratins')
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('passes the input type through', () => {
    render(<TextField label="Adresse e-mail" type="email" />)

    expect(screen.getByLabelText('Adresse e-mail')).toHaveAttribute('type', 'email')
  })

  describe('with a hint', () => {
    it('describes the field with it and keeps it valid', () => {
      render(<TextField label="Titre" hint="Le nom qu'on retrouvera dans la liste." />)

      const field = screen.getByLabelText('Titre')
      expect(field).toHaveAccessibleDescription("Le nom qu'on retrouvera dans la liste.")
      expect(field).toBeValid()
    })
  })

  it('takes messages that may be undefined, like the ones of a form library', () => {
    const noMessage = (): string | undefined => undefined
    render(<TextField label="Titre" hint={noMessage()} error={noMessage()} success={noMessage()} />)

    const field = screen.getByLabelText('Titre')
    expect(field).toBeValid()
    expect(field).toHaveAccessibleDescription('')
  })

  describe('with an error', () => {
    it('marks the field as invalid and describes it with the message', () => {
      render(<TextField label="Titre" error="Il manque un titre." />)

      const field = screen.getByLabelText('Titre')
      expect(field).toBeInvalid()
      expect(field).toHaveAccessibleDescription('Il manque un titre.')
    })

    it('leaves the announcement to the form: the message is not a live region', () => {
      render(<TextField label="Titre" error="Il manque un titre." />)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('replaces the hint', () => {
      render(<TextField label="Titre" hint="Une aide" error="Il manque un titre." />)

      expect(screen.queryByText('Une aide')).not.toBeInTheDocument()
    })
  })

  describe('with a success message', () => {
    it('shows the message, a tick, and keeps the field valid', () => {
      const { container } = render(<TextField label="Adresse e-mail" success="Adresse valide." />)

      expect(screen.getByLabelText('Adresse e-mail')).toHaveAccessibleDescription('Adresse valide.')
      expect(screen.getByLabelText('Adresse e-mail')).toBeValid()
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('with a note on its label', () => {
    it('says it next to the label, and the label still names the field', () => {
      render(<TextField label="Prénom" note="facultatif" />)

      expect(screen.getByLabelText(/Prénom/)).toBeVisible()
      expect(screen.getByText('facultatif')).toBeVisible()
    })
  })

  describe('with a hint that is a rule now kept', () => {
    it('keeps the hint as the description and the field valid, with a tick before it', () => {
      const { container } = render(
        <TextField label="Mot de passe" hint="8 caractères minimum" hintMet />,
      )

      const field = screen.getByLabelText('Mot de passe')
      expect(field).toHaveAccessibleDescription('8 caractères minimum')
      expect(field).toBeValid()
      expect(container.querySelector('p svg')).toBeInTheDocument()
    })

    it('shows nothing more than the hint while the rule is not kept', () => {
      const { container } = render(<TextField label="Mot de passe" hint="8 caractères minimum" />)

      expect(container.querySelector('p svg')).not.toBeInTheDocument()
    })
  })

  describe('marked invalid without a message', () => {
    it('is invalid and has no description: the form says why elsewhere', () => {
      render(<TextField label="Mot de passe" invalid />)

      const field = screen.getByLabelText('Mot de passe')
      expect(field).toBeInvalid()
      expect(field).toHaveAccessibleDescription('')
    })
  })

  describe('with a trailing control', () => {
    it('shows it inside the field and keeps it reachable', async () => {
      const onClick = vi.fn()
      render(
        <TextField
          label="Mot de passe"
          trailing={
            <button type="button" onClick={onClick}>
              Afficher
            </button>
          }
        />,
      )

      await userEvent.setup().click(screen.getByRole('button', { name: 'Afficher' }))

      expect(onClick).toHaveBeenCalledOnce()
    })
  })

  describe('when disabled', () => {
    it('cannot be typed in', async () => {
      render(<TextField label="Auteur" defaultValue="Ajouté par Amaury" disabled />)

      const field = screen.getByLabelText('Auteur')
      await userEvent.setup().type(field, 'x')

      expect(field).toBeDisabled()
      expect(field).toHaveValue('Ajouté par Amaury')
    })
  })

  it('has no accessibility violation in any state', async () => {
    const { container } = render(
      <form>
        <TextField label="Repos" placeholder="Ex. Tarte aux pommes" hint="Une aide" />
        <TextField label="Rempli" defaultValue="Gratin dauphinois" />
        <TextField label="Erreur" error="Il manque un titre." />
        <TextField label="Succès" type="email" success="Adresse valide." />
        <TextField label="Règle tenue" hint="8 caractères minimum" hintMet note="facultatif" />
        <TextField label="Refusé" invalid />
        <TextField
          label="Désactivé"
          disabled
          defaultValue="Ajouté par Amaury"
          hint="Lecture seule"
        />
      </form>,
    )

    await expectNoAccessibilityViolations(container)
  })
})
