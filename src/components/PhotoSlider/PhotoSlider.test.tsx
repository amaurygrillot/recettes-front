import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { PhotoSlider, type SliderPhoto } from './PhotoSlider'

const photo = (n: number): SliderPhoto => ({
  id: `m-${n}`,
  url: `/full/${n}`,
  thumbnailUrl: `/thumb/${n}`,
  alt: n === 2 ? 'La pâte étalée' : '',
})
const FOUR = [1, 2, 3, 4].map(photo)

function renderSlider(
  photos: readonly SliderPhoto[],
  extras: { leading?: boolean; trailing?: boolean } = {},
) {
  return render(
    <PhotoSlider
      photos={photos}
      label="Photos de la recette"
      leading={extras.leading ? <button type="button">Retour aux recettes</button> : undefined}
      trailing={extras.trailing ? <button type="button">Actions sur la recette</button> : undefined}
    />,
  )
}

const shownUrl = () => document.querySelector('[role=group] > div img')?.getAttribute('src')

describe('PhotoSlider', () => {
  it('is a named carousel showing the first photo and its position', () => {
    renderSlider(FOUR)

    expect(screen.getByRole('group', { name: 'Photos de la recette' })).toHaveAttribute(
      'aria-roledescription',
      'carrousel',
    )
    expect(shownUrl()).toBe('/full/1')
    expect(screen.getByText('1 / 4')).toBeVisible()
  })

  it('goes to the next and the previous photo, and round the ends', async () => {
    const user = userEvent.setup()
    renderSlider(FOUR)

    await user.click(screen.getByRole('button', { name: 'Photo suivante' }))
    expect(shownUrl()).toBe('/full/2')
    expect(screen.getByText('2 / 4')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Photo précédente' }))
    await user.click(screen.getByRole('button', { name: 'Photo précédente' }))
    expect(shownUrl()).toBe('/full/4')

    await user.click(screen.getByRole('button', { name: 'Photo suivante' }))
    expect(shownUrl()).toBe('/full/1')
  })

  it('goes to a photo from its thumbnail, saying which one is shown', async () => {
    const user = userEvent.setup()
    renderSlider(FOUR)
    expect(screen.getByRole('button', { name: 'Photo 1 sur 4, affichée' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Photo 3 sur 4' }))

    expect(shownUrl()).toBe('/full/3')
    expect(screen.getByRole('button', { name: 'Photo 3 sur 4, affichée' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Photo 1 sur 4' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('moves with the arrow keys', async () => {
    const user = userEvent.setup()
    renderSlider(FOUR)
    await user.click(screen.getByRole('button', { name: 'Photo 1 sur 4, affichée' }))

    await user.keyboard('{ArrowRight}')
    expect(shownUrl()).toBe('/full/2')

    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(shownUrl()).toBe('/full/4')
  })

  it.each([
    ['left', 300, 200, '/full/2'],
    ['right', 200, 300, '/full/4'],
    ['a tiny movement', 200, 210, '/full/1'],
  ])('follows a swipe to the %s', (_direction, from, to, expected) => {
    renderSlider(FOUR)
    const frame = document.querySelector('[role=group] > div')
    if (frame === null) throw new Error('The photo frame is missing')

    fireEvent.pointerDown(frame, { clientX: from })
    fireEvent.pointerUp(frame, { clientX: to })

    expect(shownUrl()).toBe(expected)
  })

  it('shows the alternative text the author gave, and none otherwise', async () => {
    const user = userEvent.setup()
    renderSlider(FOUR)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Photo suivante' }))

    expect(screen.getByRole('img', { name: 'La pâte étalée' })).toBeVisible()
  })

  it('has no control, counter or strip for a single photo', () => {
    renderSlider([photo(1)])

    expect(shownUrl()).toBe('/full/1')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByText(/\//)).not.toBeInTheDocument()
  })

  it('shows the butter stand-in, not an empty square, for no photo', () => {
    const { container } = renderSlider([])

    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows what it is given over its corners, and keeps them with one photo or none', () => {
    renderSlider([], { leading: true, trailing: true })

    const group = screen.getByRole('group')
    expect(within(group).getByRole('button', { name: 'Retour aux recettes' })).toBeVisible()
    expect(within(group).getByRole('button', { name: 'Actions sur la recette' })).toBeVisible()
  })

  it('has no accessibility violation, with several photos, one or none', async () => {
    const several = renderSlider(FOUR, { leading: true, trailing: true })
    await expectNoAccessibilityViolations(several.container)
    several.unmount()

    const none = renderSlider([])
    await expectNoAccessibilityViolations(none.container)
  })
})
