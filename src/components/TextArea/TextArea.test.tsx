import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { TextArea } from './TextArea'

describe('TextArea', () => {
  it('is labelled by its visible label, and shows and reports what is typed', async () => {
    const user = userEvent.setup()
    render(<TextArea label="Titre" defaultValue="Tarte" />)

    await user.type(screen.getByLabelText('Titre'), 's')

    expect(screen.getByLabelText('Titre')).toHaveValue('Tartes')
    expect(screen.getByLabelText('Titre').tagName).toBe('TEXTAREA')
  })

  it('says its note next to the label', () => {
    render(<TextArea label="Introduction" note="facultatif" />)

    expect(screen.getByLabelText(/^Introduction/)).toBeVisible()
    expect(screen.getByText('facultatif')).toBeVisible()
  })

  it('describes the field with its error, and is invalid', () => {
    render(<TextArea label="Titre" error="Le titre est obligatoire." />)

    expect(screen.getByLabelText('Titre')).toBeInvalid()
    expect(screen.getByLabelText('Titre')).toHaveAccessibleDescription('Le titre est obligatoire.')
  })

  describe('with a counter', () => {
    it.each([
      [100, 200, null],
      [159, 200, null],
    ])('says nothing at %i of %i: there is room', (typed, max) => {
      render(<TextArea label="Titre" counter={{ typed, max }} />)

      expect(screen.queryByText(`${typed} / ${max}`)).not.toBeInTheDocument()
    })

    it('shows it quietly from 160 of 200', () => {
      render(<TextArea label="Titre" counter={{ typed: 172, max: 200 }} />)

      const counter = screen.getByText('172 / 200')
      expect(counter).toBeVisible()
      expect(counter).not.toHaveClass('font-bold')
    })

    it('makes it bold from 190 of 200', () => {
      render(<TextArea label="Titre" counter={{ typed: 198, max: 200 }} />)

      expect(screen.getByText('198 / 200')).toHaveClass('font-bold')
      expect(screen.getByText('198 / 200')).not.toHaveClass('text-brick')
    })

    it('makes it brick beyond the limit, next to the error', () => {
      render(
        <TextArea
          label="Titre"
          counter={{ typed: 232, max: 200 }}
          error="Trop long : 200 caractères au plus."
        />,
      )

      expect(screen.getByText('232 / 200')).toHaveClass('text-brick')
      expect(screen.getByText('Trop long : 200 caractères au plus.')).toBeVisible()
    })
  })

  it('has no accessibility violation', async () => {
    const { container } = render(
      <>
        <TextArea label="Titre" hint="Une aide" />
        <TextArea label="Autre" error="Une erreur" counter={{ typed: 210, max: 200 }} />
      </>,
    )

    await expectNoAccessibilityViolations(container)
  })
})
