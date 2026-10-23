import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Button } from '../Button/Button'
import { BottomSheet } from './BottomSheet'

function Harness() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button
        onClick={() => {
          setOpen(true)
        }}
      >
        Ouvrir
      </Button>
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Filtres"
        toolbar={<p>Barre d&apos;outils</p>}
        actions={<Button>Voir les recettes</Button>}
      >
        <label>
          Nom
          <input type="text" />
        </label>
      </BottomSheet>
    </div>
  )
}

describe('BottomSheet', () => {
  it('is not there until it is opened', () => {
    render(<Harness />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens as a dialog named by its title, with the focus on that title', async () => {
    render(<Harness />)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Ouvrir' }))

    const dialog = await screen.findByRole('dialog', { name: 'Filtres' })
    expect(dialog).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Filtres' })).toHaveFocus()
  })

  it('shows its toolbar, its body and its actions', async () => {
    render(<Harness />)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Ouvrir' }))

    expect(await screen.findByText("Barre d'outils")).toBeVisible()
    expect(screen.getByLabelText('Nom')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Voir les recettes' })).toBeVisible()
  })

  it.each([
    [
      'the close button',
      async (user: ReturnType<typeof userEvent.setup>) => {
        await user.click(screen.getByRole('button', { name: 'Fermer' }))
      },
    ],
    [
      'the handle',
      async (user: ReturnType<typeof userEvent.setup>) => {
        await user.click(screen.getByRole('button', { name: 'Glisser vers le bas pour fermer' }))
      },
    ],
    [
      'Escape',
      async (user: ReturnType<typeof userEvent.setup>) => {
        await user.keyboard('{Escape}')
      },
    ],
  ])('closes with %s and gives the focus back to what opened it', async (_how, close) => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Ouvrir' }))
    await screen.findByRole('dialog')

    await close(user)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Ouvrir' })).toHaveFocus()
    })
  })

  it('keeps the keyboard inside while it is open', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Ouvrir' }))
    await screen.findByRole('dialog')

    for (let press = 0; press < 8; press += 1) await user.tab()

    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true)
  })

  it('has no accessibility violation once open', async () => {
    render(<Harness />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Ouvrir' }))

    await expectNoAccessibilityViolations(await screen.findByRole('dialog'))
  })
})
