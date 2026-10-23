import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../../../test/expectNoAccessibilityViolations'
import type { RecipeCardModel } from '../../recipeCards'
import { RecipeCard } from './RecipeCard'

const RECIPE: RecipeCardModel = {
  id: '42',
  path: '/recettes/42',
  title: 'Gratin dauphinois de Mamie',
  coverUrl: 'http://localhost:8080/media/m-1?variant=thumbnail',
  categories: ['Plat'],
  tags: ['Four', 'Crème', 'Hiver'],
  hiddenTagCount: 2,
  author: 'Odile',
  createdAt: '2026-10-21T12:00:00Z',
}

function renderCard(recipe: RecipeCardModel = RECIPE) {
  const router = createMemoryRouter(
    [
      { path: '/', element: <RecipeCard recipe={recipe} /> },
      { path: '/recettes/:id', element: <p>Page de la recette</p> },
    ],
    { initialEntries: ['/'] },
  )
  return { router, ...render(<RouterProvider router={router} />) }
}

describe('RecipeCard', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-23T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('is one link to the recipe, named by its title alone', () => {
    renderCard()

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/recettes/42')
    expect(link).toHaveAccessibleName('Gratin dauphinois de Mamie')
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })

  it('shows the categories, the title, the tags, the author and how long ago', () => {
    renderCard()

    expect(screen.getByText('Plat')).toBeVisible()
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Gratin dauphinois de Mamie',
    )
    ;['Four', 'Crème', 'Hiver'].forEach((tag) => {
      expect(screen.getByText(tag)).toBeVisible()
    })
    expect(screen.getByText('Par Odile · il y a 2 jours')).toBeVisible()
  })

  it('counts the tags it does not show, in words for assistive technology', () => {
    renderCard()

    const link = screen.getByRole('link')
    expect(within(link).getByText('+2')).toHaveAttribute('aria-hidden', 'true')
    expect(within(link).getByText('et 2 autres tags')).toBeInTheDocument()
  })

  it('says « autre tag » when one is hidden', () => {
    renderCard({ ...RECIPE, hiddenTagCount: 1 })

    expect(screen.getByText('et 1 autre tag')).toBeInTheDocument()
  })

  it('shows no overflow pill when every tag is shown', () => {
    renderCard({ ...RECIPE, hiddenTagCount: 0 })

    expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument()
  })

  it('shows the photo as decoration: the title already says what the recipe is', () => {
    const { container } = renderCard()

    const photo = container.querySelector('img')
    expect(photo).toHaveAttribute('src', RECIPE.coverUrl)
    expect(photo).toHaveAttribute('alt', '')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('shows the cutlery stand-in, not a gap, for a recipe without a photo', () => {
    const { container } = renderCard({ ...RECIPE, coverUrl: undefined })

    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('falls back to the same stand-in when the photo cannot be loaded', () => {
    const { container } = renderCard()

    const photo = container.querySelector('img')
    if (photo === null) throw new Error('The photo should be shown before it fails')
    fireEvent.error(photo)

    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('leaves out the rows it has nothing for', () => {
    renderCard({
      ...RECIPE,
      categories: [],
      tags: [],
      hiddenTagCount: 0,
      author: undefined,
      createdAt: undefined,
    })

    expect(screen.getByRole('heading', { level: 3 })).toBeVisible()
    expect(screen.queryByText(/Par /)).not.toBeInTheDocument()
    expect(screen.queryByText('Plat')).not.toBeInTheDocument()
  })

  it.each([
    ['author and date', RECIPE, 'Par Odile · il y a 2 jours'],
    ['author alone', { ...RECIPE, createdAt: undefined }, 'Par Odile'],
    ['author with an unreadable date', { ...RECIPE, createdAt: 'hier' }, 'Par Odile'],
    ['date alone', { ...RECIPE, author: undefined }, 'il y a 2 jours'],
  ])('writes the byline from %s', (_what, recipe, expected) => {
    renderCard(recipe)

    expect(screen.getByText(expected)).toBeVisible()
  })

  it('opens the recipe with a touch', async () => {
    vi.useRealTimers()
    const { router } = renderCard()

    await userEvent.setup().click(screen.getByRole('link'))

    expect(router.state.location.pathname).toBe('/recettes/42')
  })

  it('is reached and opened with the keyboard', async () => {
    vi.useRealTimers()
    const user = userEvent.setup()
    const { router } = renderCard()

    await user.tab()
    expect(screen.getByRole('link')).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(router.state.location.pathname).toBe('/recettes/42')
  })

  it('has no accessibility violation, with or without a photo', async () => {
    vi.useRealTimers()
    const { container } = renderCard()
    await expectNoAccessibilityViolations(container)

    const withoutPhoto = renderCard({ ...RECIPE, coverUrl: undefined })
    await expectNoAccessibilityViolations(withoutPhoto.container)
  })
})
