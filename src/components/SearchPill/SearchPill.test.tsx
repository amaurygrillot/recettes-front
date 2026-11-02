import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { SearchPill } from './SearchPill'

function Harness({ initial = '', invalid = false }: { initial?: string; invalid?: boolean }) {
  const [text, setText] = useState(initial)
  return (
    <SearchPill
      label="Chercher une catégorie"
      value={text}
      onChange={setText}
      clearLabel="Effacer la recherche"
      invalid={invalid}
    />
  )
}

describe('SearchPill', () => {
  it('is a search field named by its label, which is also its example', () => {
    render(<Harness />)

    const field = screen.getByRole('searchbox', { name: 'Chercher une catégorie' })
    expect(field).toHaveAttribute('placeholder', 'Chercher une catégorie')
  })

  it('shows what is typed', async () => {
    render(<Harness />)

    await userEvent.setup().type(screen.getByRole('searchbox'), 'tar')

    expect(screen.getByRole('searchbox')).toHaveValue('tar')
  })

  it('has no cross while it is empty', () => {
    render(<Harness />)

    expect(screen.queryByRole('button', { name: 'Effacer la recherche' })).not.toBeInTheDocument()
  })

  it('empties itself with the cross and keeps the focus', async () => {
    render(<Harness initial="tar" />)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Effacer la recherche' }))

    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByRole('searchbox')).toHaveFocus()
  })

  it('gives its field to whoever asked for it, to put the caret there', () => {
    const inputRef = createRef<HTMLInputElement>()
    render(
      <SearchPill
        label="Chercher une catégorie"
        value=""
        onChange={vi.fn()}
        clearLabel="Effacer la recherche"
        inputRef={inputRef}
      />,
    )

    expect(inputRef.current).toBe(screen.getByRole('searchbox'))
  })

  it('is invalid when told so, and has no accessibility violation', async () => {
    const { container } = render(<Harness initial="x" invalid />)

    expect(screen.getByRole('searchbox')).toBeInvalid()
    await expectNoAccessibilityViolations(container)
  })
})
