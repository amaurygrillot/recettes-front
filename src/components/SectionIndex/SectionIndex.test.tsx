import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { SectionIndex } from './SectionIndex'
import { SECTION_INDEX_ENTRY } from './sectionIndexStyles'

const ITEMS = [
  { id: 'profil', label: 'Profil', icon: 'user' },
  { id: 'email', label: 'Adresse e-mail', icon: 'mail' },
  { id: 'mdp', label: 'Mot de passe', icon: 'lock' },
] as const

function renderIndex(activeId: string | undefined = 'profil', onSelect = vi.fn()) {
  render(
    <SectionIndex label="Sections du compte" items={ITEMS} activeId={activeId} onSelect={onSelect}>
      <button type="button" className={SECTION_INDEX_ENTRY}>
        Se déconnecter
      </button>
    </SectionIndex>,
  )
  return onSelect
}

describe('SectionIndex', () => {
  it('is a navigation with one link per section', () => {
    renderIndex()

    const nav = screen.getByRole('navigation', { name: 'Sections du compte' })
    expect(nav).toBeVisible()
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Profil',
      'Adresse e-mail',
      'Mot de passe',
    ])
  })

  it('marks the section being read, and only that one', () => {
    renderIndex('email')

    expect(screen.getByRole('link', { name: 'Adresse e-mail' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByRole('link', { name: 'Profil' })).not.toHaveAttribute('aria-current')
  })

  it('says which section was chosen, without changing the address of the page', async () => {
    const onSelect = renderIndex()

    await userEvent.setup().click(screen.getByRole('link', { name: 'Mot de passe' }))

    expect(onSelect).toHaveBeenCalledWith('mdp')
    expect(window.location.hash).toBe('')
  })

  it('shows what follows the rule as one more entry', () => {
    renderIndex()

    expect(screen.getByRole('button', { name: 'Se déconnecter' })).toBeVisible()
  })

  it('has no accessibility violation', async () => {
    const { container } = render(
      <SectionIndex label="Sections" items={ITEMS} activeId="profil" onSelect={vi.fn()} />,
    )

    await expectNoAccessibilityViolations(container)
  })
})
