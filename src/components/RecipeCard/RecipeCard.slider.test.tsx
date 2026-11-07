import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { RecipeCard, type RecipeCardModel } from './RecipeCard'

const PHOTOS = ['m-1', 'm-2', 'm-3'].map(
  (id) => `http://localhost:8080/media/${id}?variant=thumbnail`,
)

const RECIPE: RecipeCardModel = {
  id: '42',
  path: '/recettes/42',
  title: 'Tarte fine aux pommes',
  coverUrls: PHOTOS,
  categories: ['Desserts'],
  tags: [],
  hiddenTagCount: 0,
  author: 'Mamie',
  createdAt: undefined,
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

/** The frame of the photos, found by one of them: events on a picture reach the frame that listens. */
const firstPicture = (container: HTMLElement) => {
  const picture = container.querySelector('img')
  if (picture === null) throw new Error('The card should show a photo')
  return picture
}

/** A finger on the first photo that goes from `from` to `to` (x only), in the steps given. */
function drag(picture: HTMLElement, from: number, ...to: number[]) {
  fireEvent.pointerDown(picture, {
    pointerId: 1,
    pointerType: 'touch',
    clientX: from,
    clientY: 100,
  })
  for (const x of to.slice(0, -1)) {
    fireEvent.pointerMove(picture, { pointerId: 1, pointerType: 'touch', clientX: x, clientY: 100 })
  }
  const last = to.at(-1) ?? from
  fireEvent.pointerMove(picture, {
    pointerId: 1,
    pointerType: 'touch',
    clientX: last,
    clientY: 100,
  })
  fireEvent.pointerUp(picture, { pointerId: 1, pointerType: 'touch', clientX: last, clientY: 100 })
}

const track = (picture: HTMLElement) => picture.parentElement?.parentElement

describe('RecipeCard with several photos', () => {
  beforeEach(() => {
    // jsdom has no layout and does not know pointer capture: the card is 270 px wide, as on a desktop.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(0, 0, 270, 202),
    )
    HTMLElement.prototype.setPointerCapture = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows a dot for each photo and a counter, as decoration', () => {
    const { container } = renderCard()

    expect(screen.getByText('1 / 3')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelectorAll('img')).toHaveLength(3)
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })

  it('shows nothing of a slider for a single photo, as before', () => {
    renderCard({ ...RECIPE, coverUrls: PHOTOS.slice(0, 1) })

    expect(screen.queryByText(/^\d+ \/ \d+$/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Photo/ })).not.toBeInTheDocument()
  })

  it('shows nothing of a slider for a recipe without a photo', () => {
    renderCard({ ...RECIPE, coverUrls: [] })

    expect(screen.queryByText(/^\d+ \/ \d+$/)).not.toBeInTheDocument()
    expect(screen.getByText('Pas encore de photo')).toBeVisible()
  })

  describe('with a finger', () => {
    it('slides to the next photo on a swipe to the left, and to the previous one back', () => {
      const { container } = renderCard()
      const picture = firstPicture(container)

      drag(picture, 200, 150, 100)
      expect(screen.getByText('2 / 3')).toBeVisible()
      expect(track(picture)).toHaveStyle({ transform: 'translateX(calc(-100% + 0px))' })

      drag(picture, 100, 150, 200)
      expect(screen.getByText('1 / 3')).toBeVisible()
    })

    it('says which photo is shown after a swipe', () => {
      const { container } = renderCard()

      drag(firstPicture(container), 200, 150, 100)

      expect(screen.getByRole('status')).toHaveTextContent('Photo 2 sur 3')
    })

    it('has the photos follow the finger while it is down, with no delay', () => {
      const { container } = renderCard()
      const picture = firstPicture(container)

      fireEvent.pointerDown(picture, {
        pointerId: 1,
        pointerType: 'touch',
        clientX: 200,
        clientY: 100,
      })
      fireEvent.pointerMove(picture, {
        pointerId: 1,
        pointerType: 'touch',
        clientX: 120,
        clientY: 100,
      })
      fireEvent.pointerMove(picture, {
        pointerId: 1,
        pointerType: 'touch',
        clientX: 100,
        clientY: 100,
      })

      // Pulled 100 px left of where it started, on the first photo; the way to the second.
      expect(track(picture)).toHaveStyle({ transform: 'translateX(calc(0% + -100px))' })
      expect(track(picture)?.className).not.toContain('transition-transform')
    })

    it('settles back on the same photo when the drag was too short', () => {
      const { container } = renderCard()
      const picture = firstPicture(container)

      drag(picture, 200, 190, 170)

      expect(screen.getByText('1 / 3')).toBeVisible()
      expect(track(picture)).toHaveStyle({ transform: 'translateX(calc(0% + 0px))' })
    })

    it('stops on the last photo and on the first: it does not go round', () => {
      const { container } = renderCard()
      const picture = firstPicture(container)

      drag(picture, 100, 150, 200)
      expect(screen.getByText('1 / 3')).toBeVisible()
      drag(picture, 200, 100)
      drag(picture, 200, 100)
      drag(picture, 200, 100)
      expect(screen.getByText('3 / 3')).toBeVisible()
    })

    it('holds back a drag past either end instead of following it all the way', () => {
      const { container } = renderCard()
      const picture = firstPicture(container)

      fireEvent.pointerDown(picture, {
        pointerId: 1,
        pointerType: 'touch',
        clientX: 100,
        clientY: 100,
      })
      fireEvent.pointerMove(picture, {
        pointerId: 1,
        pointerType: 'touch',
        clientX: 190,
        clientY: 100,
      })

      // 90 px to the right of the first photo: a third of it.
      expect(track(picture)).toHaveStyle({ transform: 'translateX(calc(0% + 30px))' })
    })

    it('leaves a vertical movement to the list: it never changes the photo', () => {
      const { container } = renderCard()
      const picture = firstPicture(container)

      fireEvent.pointerDown(picture, {
        pointerId: 1,
        pointerType: 'touch',
        clientX: 100,
        clientY: 100,
      })
      fireEvent.pointerMove(picture, {
        pointerId: 1,
        pointerType: 'touch',
        clientX: 110,
        clientY: 160,
      })
      fireEvent.pointerMove(picture, {
        pointerId: 1,
        pointerType: 'touch',
        clientX: 20,
        clientY: 230,
      })
      fireEvent.pointerUp(picture, {
        pointerId: 1,
        pointerType: 'touch',
        clientX: 20,
        clientY: 230,
      })

      expect(screen.getByText('1 / 3')).toBeVisible()
    })

    it('is never a drag with a mouse', () => {
      const { container } = renderCard()
      const picture = firstPicture(container)

      fireEvent.pointerDown(picture, {
        pointerId: 1,
        pointerType: 'mouse',
        clientX: 200,
        clientY: 100,
      })
      fireEvent.pointerMove(picture, {
        pointerId: 1,
        pointerType: 'mouse',
        clientX: 100,
        clientY: 100,
      })
      fireEvent.pointerUp(picture, {
        pointerId: 1,
        pointerType: 'mouse',
        clientX: 100,
        clientY: 100,
      })

      expect(screen.getByText('1 / 3')).toBeVisible()
    })

    it('opens the recipe on a tap, on a photo as anywhere on the card', async () => {
      const user = userEvent.setup()
      const { router, container } = renderCard()

      await user.click(firstPicture(container))

      expect(router.state.location.pathname).toBe('/recettes/42')
    })

    it('does not open the recipe at the end of a drag', () => {
      const { router, container } = renderCard()
      const picture = firstPicture(container)

      drag(picture, 200, 150, 100)
      fireEvent.click(picture)

      expect(router.state.location.pathname).toBe('/')
      // The next touch is a tap again.
      fireEvent.pointerDown(picture, {
        pointerId: 1,
        pointerType: 'touch',
        clientX: 100,
        clientY: 100,
      })
      fireEvent.pointerUp(picture, {
        pointerId: 1,
        pointerType: 'touch',
        clientX: 100,
        clientY: 100,
      })
      fireEvent.click(picture)
      expect(router.state.location.pathname).toBe('/recettes/42')
    })
  })

  describe('on a desktop', () => {
    it('changes photo with the two arrows, round the ends', async () => {
      const user = userEvent.setup()
      renderCard()

      await user.click(screen.getByRole('button', { name: 'Photo suivante' }))
      expect(screen.getByText('2 / 3')).toBeVisible()
      await user.click(screen.getByRole('button', { name: 'Photo précédente' }))
      await user.click(screen.getByRole('button', { name: 'Photo précédente' }))

      expect(screen.getByText('3 / 3')).toBeVisible()
      expect(screen.getByRole('status')).toHaveTextContent('Photo 3 sur 3')
    })

    it('does not open the recipe when an arrow is pressed: it is beside the link, not in it', async () => {
      const user = userEvent.setup()
      const { router } = renderCard()

      await user.click(screen.getByRole('button', { name: 'Photo suivante' }))

      expect(router.state.location.pathname).toBe('/')
      expect(screen.getByRole('link').querySelector('button')).toBeNull()
    })

    it('keeps the arrows out of the tab order: the keys do the keyboard’s part', async () => {
      const user = userEvent.setup()
      renderCard()

      await user.tab()
      expect(screen.getByRole('link')).toHaveFocus()
      await user.tab()

      expect(screen.getByRole('link')).not.toHaveFocus()
      expect(screen.getByRole('button', { name: 'Photo suivante' })).not.toHaveFocus()
    })

    it('changes photo with ← and → while the card has the focus, round the ends', async () => {
      const user = userEvent.setup()
      renderCard()

      await user.tab()
      await user.keyboard('{ArrowRight}')
      expect(screen.getByText('2 / 3')).toBeVisible()
      await user.keyboard('{ArrowLeft}{ArrowLeft}')

      expect(screen.getByText('3 / 3')).toBeVisible()
    })

    it('leaves ← and → to the browser with a modifier, and on a card with a single photo', async () => {
      const user = userEvent.setup()
      renderCard()

      await user.tab()
      await user.keyboard('{Alt>}{ArrowRight}{/Alt}')

      expect(screen.getByText('1 / 3')).toBeVisible()
    })
  })

  it('has no accessibility violation', async () => {
    const { container } = renderCard()

    await expectNoAccessibilityViolations(container)
  })
})
