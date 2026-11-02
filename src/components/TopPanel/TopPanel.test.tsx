import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Button } from '../Button/Button'
import { TopPanel } from './TopPanel'

function Harness({ focusField = false }: { focusField?: boolean }) {
  const [open, setOpen] = useState(false)
  const fieldRef = useRef<HTMLInputElement>(null)
  return (
    <div>
      <Button
        onClick={() => {
          setOpen(true)
        }}
      >
        Ouvrir
      </Button>
      <TopPanel
        open={open}
        onOpenChange={setOpen}
        title="Rechercher"
        initialFocusRef={focusField ? fieldRef : undefined}
        toolbar={<p>Champ</p>}
        actions={<Button>Rechercher</Button>}
      >
        <label>
          Nom
          <input ref={fieldRef} type="text" />
        </label>
      </TopPanel>
    </div>
  )
}

describe('TopPanel', () => {
  it('is not there until it is opened', () => {
    render(<Harness />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens as a dialog named by its title, with the focus on that title', async () => {
    render(<Harness />)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Ouvrir' }))

    expect(await screen.findByRole('dialog', { name: 'Rechercher' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Rechercher' })).toHaveFocus()
  })

  it('puts the focus in a field of its own when it is told to', async () => {
    render(<Harness focusField />)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Ouvrir' }))

    await screen.findByRole('dialog')
    expect(screen.getByLabelText('Nom')).toHaveFocus()
  })

  it('shows its toolbar, its body and its actions', async () => {
    render(<Harness />)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Ouvrir' }))

    expect(await screen.findByText('Champ')).toBeVisible()
    expect(screen.getByLabelText('Nom')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Rechercher' })).toBeVisible()
  })

  it.each([
    [
      'the close button',
      async (user: ReturnType<typeof userEvent.setup>) => {
        await user.click(screen.getByRole('button', { name: 'Fermer' }))
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

  it('has no accessibility violation once open', async () => {
    render(<Harness />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Ouvrir' }))

    await expectNoAccessibilityViolations(await screen.findByRole('dialog'))
  })
})
