import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { AuthFrame, type AuthFrameProps } from './AuthFrame'

function renderFrame(props: Partial<AuthFrameProps> = {}) {
  const router = createMemoryRouter([
    {
      path: '/',
      element: (
        <AuthFrame layout="form" {...props}>
          <h1>Créer un compte</h1>
          <button type="submit">Envoyer</button>
        </AuthFrame>
      ),
    },
  ])
  return render(<RouterProvider router={router} />)
}

describe('AuthFrame', () => {
  it('shows the seal once, named, with the content under it', () => {
    renderFrame()

    expect(screen.getAllByRole('img', { name: 'Il en reste un peu' })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Créer un compte' })).toBeVisible()
  })

  it('has no navigation around it: neither tabs nor a top bar', () => {
    renderFrame()

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('gives the way back as a link, when there is one', () => {
    renderFrame({ back: { to: '/connexion', label: 'Retour' } })

    expect(screen.getByRole('link', { name: 'Retour' })).toHaveAttribute('href', '/connexion')
  })

  it('has no way back unless it is given one', () => {
    renderFrame()

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('is a plain block until it is given a submit handler', () => {
    const { container } = renderFrame()

    expect(container.querySelector('form')).not.toBeInTheDocument()
  })

  it('becomes a form the browser does not validate once it has a submit handler', async () => {
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => {
      event.preventDefault()
    })
    const { container } = renderFrame({ onSubmit })
    expect(container.querySelector('form')).toHaveAttribute('novalidate')

    await userEvent.setup().click(screen.getByRole('button', { name: 'Envoyer' }))

    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it.each(['form', 'login', 'welcome'] as const)(
    'has no accessibility violation as « %s »',
    async (layout) => {
      const { container } = renderFrame({ layout, back: { to: '/connexion', label: 'Retour' } })

      await expectNoAccessibilityViolations(container)
    },
  )
})
