import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { useGoBack } from './useGoBack'

function BackButton() {
  const goBack = useGoBack('/rechercher')
  return (
    <button type="button" onClick={goBack}>
      Retour
    </button>
  )
}

function renderAt(entries: string[], index: number) {
  const router = createMemoryRouter(
    [
      { path: '/', element: <p>Accueil</p> },
      { path: '/rechercher', element: <p>Recherche</p> },
      { path: '/recettes/1', element: <BackButton /> },
    ],
    { initialEntries: entries, initialIndex: index },
  )
  return { router, ...render(<RouterProvider router={router} />) }
}

describe('useGoBack', () => {
  it('goes back to the page the visitor came from', async () => {
    const { router } = renderAt(['/', '/recettes/1'], 1)
    // The recipe was reached from inside the app: its entry has a key of its own.
    await router.navigate('/')
    await router.navigate('/recettes/1')
    await screen.findByRole('button', { name: 'Retour' })

    await userEvent.setup().click(screen.getByRole('button', { name: 'Retour' }))

    expect(router.state.location.pathname).toBe('/')
  })

  it('goes to the fallback when the recipe is the first page of the visit', async () => {
    const { router } = renderAt(['/recettes/1'], 0)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Retour' }))

    expect(router.state.location.pathname).toBe('/rechercher')
  })
})
