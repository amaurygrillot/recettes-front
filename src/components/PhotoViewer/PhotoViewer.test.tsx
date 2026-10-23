import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { PhotoViewer, type ViewerPhoto } from './PhotoViewer'

const photos: readonly ViewerPhoto[] = [1, 2, 3].map((n) => ({
  id: `m-${n}`,
  url: `/full/${n}`,
  alt: n === 1 ? 'La pâte' : '',
}))

function Harness({ list = photos }: { list?: readonly ViewerPhoto[] }) {
  const [index, setIndex] = useState<number | undefined>()
  return (
    <div>
      {list.map((photo, position) => (
        <button
          key={photo.id}
          type="button"
          onClick={() => {
            setIndex(position)
          }}
        >
          Agrandir la photo {position + 1}
        </button>
      ))}
      <PhotoViewer
        photos={list}
        index={index}
        onIndexChange={setIndex}
        onClose={() => {
          setIndex(undefined)
        }}
      />
    </div>
  )
}

const shown = () => document.querySelector('[role=dialog] img')?.getAttribute('src')

describe('PhotoViewer', () => {
  it('is not there until a photo is chosen', () => {
    render(<Harness />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens on the photo that was touched, named by its position', async () => {
    render(<Harness />)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Agrandir la photo 2' }))

    expect(await screen.findByRole('dialog', { name: 'Photo 2 sur 3' })).toBeVisible()
    expect(shown()).toBe('/full/2')
  })

  it('moves between the photos with the arrows and the arrow keys, round the ends', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Agrandir la photo 1' }))
    await screen.findByRole('dialog')

    await user.click(screen.getByRole('button', { name: 'Photo suivante' }))
    expect(shown()).toBe('/full/2')
    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(shown()).toBe('/full/1')
    await user.keyboard('{ArrowLeft}')
    expect(shown()).toBe('/full/3')
  })

  it('shows the alternative text it is given', async () => {
    render(<Harness />)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Agrandir la photo 1' }))

    expect(await screen.findByRole('img', { name: 'La pâte' })).toBeVisible()
  })

  it.each([
    [
      'the cross',
      async (user: ReturnType<typeof userEvent.setup>) => {
        await user.click(screen.getByRole('button', { name: 'Fermer la photo' }))
      },
    ],
    [
      'Escape',
      async (user: ReturnType<typeof userEvent.setup>) => {
        await user.keyboard('{Escape}')
      },
    ],
  ])('closes with %s', async (_how, close) => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Agrandir la photo 3' }))
    await screen.findByRole('dialog')

    await close(user)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('has no arrows for a single photo', async () => {
    render(<Harness list={photos.slice(0, 1)} />)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Agrandir la photo 1' }))
    await screen.findByRole('dialog')

    expect(screen.queryByRole('button', { name: 'Photo suivante' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fermer la photo' })).toBeVisible()
  })

  it('has no accessibility violation once open', async () => {
    render(<Harness />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Agrandir la photo 1' }))

    await expectNoAccessibilityViolations(await screen.findByRole('dialog'))
  })
})
