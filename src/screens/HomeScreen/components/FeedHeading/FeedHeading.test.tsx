import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../../../test/expectNoAccessibilityViolations'
import { FeedHeading } from './FeedHeading'

function renderHeading(mayCreate: boolean) {
  const router = createMemoryRouter([{ path: '/', element: <FeedHeading mayCreate={mayCreate} /> }])
  return render(<RouterProvider router={router} />)
}

describe('FeedHeading', () => {
  it('is the title of the feed, with its handwritten note', () => {
    renderHeading(false)

    expect(screen.getByRole('heading', { level: 2, name: 'Fraîchement ajoutées' })).toBeVisible()
    expect(screen.getByText('les dernières recettes de la famille')).toBeVisible()
  })

  it('offers « Nouvelle recette », a link to the creation page, to who may write recipes', () => {
    renderHeading(true)

    expect(screen.getByRole('link', { name: 'Nouvelle recette' })).toHaveAttribute(
      'href',
      '/recettes/nouvelle',
    )
  })

  it('offers nothing to create to who may not', () => {
    renderHeading(false)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('has no accessibility violation', async () => {
    const { container } = renderHeading(true)

    await expectNoAccessibilityViolations(container)
  })
})
