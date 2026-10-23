import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { logger } from '../lib/logger'
import { expectNoAccessibilityViolations } from '../test/expectNoAccessibilityViolations'
import { renderRoutes } from '../test/renderRoutes'
import { RouteError } from './RouteError'

function Broken(): never {
  throw new Error('The recipe could not be drawn')
}

function renderBrokenPage() {
  return renderRoutes(
    [
      {
        errorElement: <RouteError />,
        children: [
          { path: '/broken', element: <Broken /> },
          { path: '/', element: <p>Accueil</p> },
        ],
      },
    ],
    '/broken',
  )
}

describe('RouteError', () => {
  it('replaces a page that failed with a message and the way out, instead of a blank app', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    renderBrokenPage()

    expect(await screen.findByRole('alert')).toHaveTextContent("Cette page n'a pas pu s'afficher")
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeVisible()
    expect(screen.getByRole('link', { name: "Retour à l'accueil" })).toHaveAttribute('href', '/')
  })

  it('logs what failed, once', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const log = vi.spyOn(logger, 'error')
    renderBrokenPage()
    await screen.findByRole('alert')

    expect(log).toHaveBeenCalledWith('A page failed to render', {
      message: 'The recipe could not be drawn',
    })
  })

  it('has no accessibility violation', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const { container } = renderBrokenPage()
    await screen.findByRole('alert')

    await expectNoAccessibilityViolations(container)
  })
})
