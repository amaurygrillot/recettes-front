import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../../../test/expectNoAccessibilityViolations'
import { EditorIndex } from './EditorIndex'

describe('EditorIndex', () => {
  it('names the five sections, in the order of the page, and marks the one being read', () => {
    render(<EditorIndex activeId="ingredients" problems={{}} onSelect={vi.fn()} />)

    const nav = screen.getByRole('navigation', { name: 'Sections du formulaire' })
    expect(nav).toBeVisible()
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual([
      '1Informations',
      '2Photos',
      '3Ingrédients',
      '4Étapes',
      '5Conseil',
    ])
    expect(screen.getByRole('link', { name: /Ingrédients/ })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByRole('link', { name: /Photos/ })).not.toHaveAttribute('aria-current')
  })

  it('goes to the section that is pressed, without changing the address', async () => {
    const onSelect = vi.fn()
    render(<EditorIndex activeId="informations" problems={{}} onSelect={onSelect} />)

    await userEvent.setup().click(screen.getByRole('link', { name: /Étapes/ }))

    expect(onSelect).toHaveBeenCalledWith('steps')
  })

  it('says how many things are to be corrected in a section, in its name and by a count', () => {
    render(
      <EditorIndex
        activeId="informations"
        problems={{ informations: 2, ingredients: 1 }}
        onSelect={vi.fn()}
      />,
    )

    expect(screen.getByRole('link', { name: 'Informations, 2 problèmes' })).toHaveTextContent('2')
    expect(screen.getByRole('link', { name: 'Ingrédients, 1 problème' })).toHaveTextContent('1')
    expect(screen.getByRole('link', { name: 'Étapes' })).not.toHaveTextContent(/\d$/)
  })

  it('has no accessibility violation', async () => {
    const { container } = render(
      <EditorIndex activeId="photos" problems={{ steps: 3 }} onSelect={vi.fn()} />,
    )

    await expectNoAccessibilityViolations(container)
  })
})
