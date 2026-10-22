import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Button, type ButtonVariant } from './Button'

const VARIANTS: readonly ButtonVariant[] = ['primary', 'secondary', 'quiet', 'danger']

describe('Button', () => {
  it('is a button that does not submit a form unless told to', () => {
    render(<Button>Cuisiner</Button>)

    expect(screen.getByRole('button', { name: 'Cuisiner' })).toHaveAttribute('type', 'button')
  })

  it('submits the form it belongs to when its type is submit', async () => {
    const onSubmit = vi.fn()
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <Button type="submit">Se connecter</Button>
      </form>,
    )

    await userEvent.setup().click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('calls onClick with the mouse and with the keyboard', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Cuisiner</Button>)

    await user.click(screen.getByRole('button', { name: 'Cuisiner' }))
    await user.keyboard('{Enter}')
    await user.keyboard(' ')

    expect(onClick).toHaveBeenCalledTimes(3)
  })

  it('can be reached with the keyboard', async () => {
    const user = userEvent.setup()
    render(<Button>Cuisiner</Button>)

    await user.tab()

    expect(screen.getByRole('button', { name: 'Cuisiner' })).toHaveFocus()
  })

  it('cannot be written without a label, which is its accessible name', () => {
    // @ts-expect-error an icon-only button would have no accessible name
    const unlabeled = <Button icon="close" />

    expect(unlabeled).toBeDefined()
  })

  it('does nothing when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Cuisiner
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Cuisiner' })

    await userEvent.setup().click(button)

    expect(button).toBeDisabled()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('shows an icon before its label without changing its accessible name', () => {
    const { container } = render(<Button icon="refresh">Réessayer</Button>)

    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeVisible()
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('has no accessibility violation in any variant, enabled or disabled', async () => {
    const { container } = render(
      <div>
        {VARIANTS.map((variant) => (
          <div key={variant}>
            <Button variant={variant} icon="check">
              {variant}
            </Button>
            <Button variant={variant} disabled fullWidth size="medium">
              {variant} désactivé
            </Button>
          </div>
        ))}
      </div>,
    )

    await expectNoAccessibilityViolations(container)
  })
})
