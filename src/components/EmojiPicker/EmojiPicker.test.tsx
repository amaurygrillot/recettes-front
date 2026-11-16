import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EMOJIBASE_URL } from '../../lib/emoji/emojiData'
import { serveEmojibase, stubPickerLayout } from './emojibase.testkit'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { server } from '../../test/server'
import { EmojiPicker } from './EmojiPicker'

let restoreLayout: () => void
const scrollTo = vi.fn<(options: ScrollToOptions) => void>()

beforeEach(() => {
  serveEmojibase()
  restoreLayout = stubPickerLayout()
  scrollTo.mockClear()
  Object.defineProperty(Element.prototype, 'scrollTo', { configurable: true, value: scrollTo })
})

afterEach(() => {
  restoreLayout()
  Reflect.deleteProperty(Element.prototype, 'scrollTo')
})

async function renderPicker(selected?: string) {
  const onSelect = vi.fn()
  const view = render(<EmojiPicker selected={selected} onSelect={onSelect} />)
  await screen.findByRole('searchbox', { name: 'Chercher un émoji' })
  return { onSelect, user: userEvent.setup(), ...view }
}

describe('EmojiPicker', () => {
  it('says it is loading, then offers a search, the skin tone and the nine categories', async () => {
    render(<EmojiPicker onSelect={vi.fn()} />)
    expect(screen.getByRole('status')).toHaveTextContent('Chargement des émojis…')

    const categories = await screen.findByRole('navigation', { name: 'Catégories d’émojis' })

    expect(within(categories).getAllByRole('button')).toHaveLength(9)
    expect(screen.getByRole('button', { name: 'Aller à Cuisine' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ton de peau : par défaut, changer' })).toBeVisible()
  })

  it('names every emoji in French, and chooses the one that is touched', async () => {
    const { onSelect, user } = await renderPicker()

    await user.type(screen.getByRole('searchbox'), 'sapin')
    await user.click(await screen.findByRole('gridcell', { name: 'Sapin de Noël' }))

    expect(onSelect).toHaveBeenCalledExactlyOnceWith('🎄')
  })

  it('finds an emoji by a word of its name, announces how many it found, and lists only those', async () => {
    const { user } = await renderPicker()

    await user.type(screen.getByRole('searchbox'), 'sapin')

    expect(await screen.findByRole('gridcell', { name: 'Sapin de Noël' })).toBeVisible()
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/^\d+ résultats? pour « sapin »$/)
    })
    expect(
      screen.queryByRole('navigation', { name: 'Catégories d’émojis' }),
    ).not.toBeInTheDocument()
  })

  it('finds « gâteau » without the accent, as the keyboard of a phone often types it', async () => {
    const { user } = await renderPicker()

    await user.type(screen.getByRole('searchbox'), 'gateau')

    expect(await screen.findByRole('gridcell', { name: 'Gâteau d’anniversaire' })).toBeVisible()
  })

  it('says when nothing matches, and gets the list back when the search is cleared', async () => {
    const { user } = await renderPicker()

    await user.type(screen.getByRole('searchbox'), 'xqzw')

    expect(await screen.findByRole('heading', { name: 'Aucun émoji pour « xqzw »' })).toBeVisible()
    expect(screen.getByText('Essaie un autre mot : gâteau, sapin, pizza…')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Effacer la recherche' }))

    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByRole('searchbox')).toHaveFocus()
    expect(await screen.findByRole('navigation', { name: 'Catégories d’émojis' })).toBeVisible()
  })

  describe('the skin tone', () => {
    it('opens six tones as radio buttons, the default one on', async () => {
      const { user } = await renderPicker()

      await user.click(screen.getByRole('button', { name: 'Ton de peau : par défaut, changer' }))

      const group = screen.getByRole('radiogroup', { name: 'Ton de peau' })
      expect(within(group).getAllByRole('radio')).toHaveLength(6)
      expect(within(group).getByRole('radio', { name: 'Ton de peau : par défaut' })).toBeChecked()
    })

    it('closes the row when a tone is touched on its picture, as a finger does, and gives the focus back', async () => {
      const { user } = await renderPicker()
      await user.click(screen.getByRole('button', { name: 'Ton de peau : par défaut, changer' }))
      const label = screen.getByRole('radio', { name: 'Ton de peau : clair' }).closest('label')
      if (label === null) throw new Error('The tone has no label')

      await user.click(label)

      await waitFor(() => {
        expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
      })
      expect(
        await screen.findByRole('button', { name: 'Ton de peau : clair, changer' }),
      ).toHaveFocus()
    })

    it('moves from tone to tone with the arrows, and leaves the row open for the keyboard', async () => {
      const { user } = await renderPicker()
      await user.click(screen.getByRole('button', { name: 'Ton de peau : par défaut, changer' }))
      screen.getByRole('radio', { name: 'Ton de peau : par défaut' }).focus()

      await user.keyboard('{ArrowRight}')

      await waitFor(() => {
        expect(screen.getByRole('radio', { name: 'Ton de peau : clair' })).toBeChecked()
      })
      expect(screen.getByRole('radiogroup', { name: 'Ton de peau' })).toBeVisible()
    })

    it('puts the tone chosen on the emojis that have one, and on the button', async () => {
      const { user } = await renderPicker()
      await user.click(screen.getByRole('button', { name: 'Ton de peau : par défaut, changer' }))

      await user.click(screen.getByRole('radio', { name: 'Ton de peau : moyen' }))

      expect(
        await screen.findByRole('button', { name: 'Ton de peau : moyen, changer' }),
      ).toBeVisible()
      expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
      await user.type(screen.getByRole('searchbox'), 'pouce vers le haut')
      const thumb = await screen.findByRole('gridcell', { name: 'Pouce vers le haut' })
      expect(within(thumb).getByRole('presentation')).toHaveAttribute(
        'src',
        '/twemoji/1f44d-1f3fd.svg',
      )
    })
  })

  describe('the categories', () => {
    it('start on the first one, and take the list to the one that is touched', async () => {
      const { user } = await renderPicker()
      expect(screen.getByRole('button', { name: 'Aller à Visages' })).toHaveAttribute(
        'aria-current',
        'true',
      )

      await user.click(screen.getByRole('button', { name: 'Aller à Voyages' }))

      expect(scrollTo.mock.calls.at(-1)?.[0]?.top).toBeGreaterThan(0)
      expect(screen.getByRole('button', { name: 'Aller à Voyages' })).toHaveAttribute(
        'aria-current',
        'true',
      )
      expect(screen.getByRole('button', { name: 'Aller à Visages' })).not.toHaveAttribute(
        'aria-current',
      )
    })

    it('put the list on the category of the emoji already chosen when it opens', async () => {
      await renderPicker('🍕')

      expect(screen.getByRole('button', { name: 'Aller à Cuisine' })).toHaveAttribute(
        'aria-current',
        'true',
      )
      await waitFor(() => {
        expect(scrollTo.mock.calls.at(-1)?.[0]).toMatchObject({ behavior: 'instant' })
      })
      expect(scrollTo.mock.calls.at(-1)?.[0]?.top).toBeGreaterThan(0)
    })
  })

  it('says so, and tries again, when the emojis cannot be loaded', async () => {
    server.use(
      http.get(`${EMOJIBASE_URL}/fr/data.json`, () => new HttpResponse(null, { status: 500 })),
    )
    const user = userEvent.setup()
    render(<EmojiPicker onSelect={vi.fn()} />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Les émojis n’ont pas pu être chargés. Vérifie ta connexion, puis réessaie.',
    )

    serveEmojibase()
    await user.click(screen.getByRole('button', { name: 'Réessayer' }))

    expect(await screen.findByRole('searchbox', { name: 'Chercher un émoji' })).toBeVisible()
  })

  it('has no accessibility violation', async () => {
    const { container } = await renderPicker()

    await expectNoAccessibilityViolations(container)
  })
})
