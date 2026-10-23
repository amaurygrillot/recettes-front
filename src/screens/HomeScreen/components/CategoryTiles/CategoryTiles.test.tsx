import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../../../test/expectNoAccessibilityViolations'
import type { MainCategories } from '../../useMainCategories'
import { CategoryTiles } from './CategoryTiles'

const READY: MainCategories = {
  status: 'ready',
  categories: [
    { id: 'c-1', name: 'Entrées', icon: 'leaf' },
    { id: 'c-2', name: 'Plats', icon: 'plate' },
    { id: 'c-3', name: 'Desserts', icon: 'cake' },
  ],
}

function renderTiles(categories: MainCategories) {
  const router = createMemoryRouter(
    [
      { path: '/', element: <CategoryTiles categories={categories} /> },
      { path: '/rechercher', element: <p>Page de recherche</p> },
    ],
    { initialEntries: ['/'] },
  )
  return { router, ...render(<RouterProvider router={router} />) }
}

describe('CategoryTiles', () => {
  it('lists « Toutes » first, then every main category, as a named list of links', () => {
    renderTiles(READY)

    const list = screen.getByRole('list', { name: 'Catégories' })
    const links = within(list).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual([
      'Toutes',
      'Entrées',
      'Plats',
      'Desserts',
    ])
  })

  it('marks « Toutes » as the one being shown, and only it', () => {
    renderTiles(READY)

    const current = screen.getAllByRole('link').filter((link) => link.ariaCurrent === 'true')
    expect(current.map((link) => link.textContent)).toEqual(['Toutes'])
    expect(screen.getByRole('link', { name: 'Toutes' })).toHaveAttribute('href', '/')
  })

  it('opens the search page on the category that was touched', async () => {
    const user = userEvent.setup()
    const { router } = renderTiles(READY)

    await user.click(screen.getByRole('link', { name: 'Plats' }))

    expect(router.state.location.pathname).toBe('/rechercher')
    expect(router.state.location.search).toBe('?categorie=c-2')
  })

  it('can be walked with the keyboard, one tile at a time', async () => {
    const user = userEvent.setup()
    renderTiles(READY)

    await user.tab()
    await user.tab()

    expect(screen.getByRole('link', { name: 'Entrées' })).toHaveFocus()
  })

  it('shows « Toutes » alone when there is no main category', () => {
    renderTiles({ status: 'ready', categories: [] })

    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual(['Toutes'])
  })

  it('shows only placeholders, announced once, while the categories load', () => {
    vi.useFakeTimers()
    try {
      renderTiles({ status: 'loading' })
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(screen.getByRole('status')).toBeEmptyDOMElement()
    } finally {
      vi.useRealTimers()
    }
  })

  it('has no accessibility violation', async () => {
    const { container } = renderTiles(READY)

    await expectNoAccessibilityViolations(container)
  })
})
