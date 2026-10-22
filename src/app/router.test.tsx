import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../test/expectNoAccessibilityViolations'
import { routes } from './router'
import { strings } from './strings'

function renderAt(path: string) {
  return render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />)
}

describe('routes', () => {
  it('serves the home placeholder at /', async () => {
    const { container } = renderAt('/')

    expect(await screen.findByRole('heading', { level: 1, name: strings.appName })).toBeVisible()
    await expectNoAccessibilityViolations(container)
  })

  it('serves the style guide at /styleguide in development', async () => {
    renderAt('/styleguide')

    expect(await screen.findByRole('heading', { level: 1, name: 'Guide de style' })).toBeVisible()
  })
})
