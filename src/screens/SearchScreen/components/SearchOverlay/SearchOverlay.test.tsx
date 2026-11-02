import { fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { API_BASE_URL } from '../../../../api/apiConfig'
import { EMPTY_CRITERIA, type SearchCriteria } from '../../../../app/searchCriteria'
import { serveBackend } from '../../../../test/fakeRecipeBackend'
import { expectNoAccessibilityViolations } from '../../../../test/expectNoAccessibilityViolations'
import { installMatchMedia, removeMatchMedia } from '../../../../test/matchMedia'
import { renderRoutes } from '../../../../test/renderRoutes'
import { server } from '../../../../test/server'
import { SearchOverlay, type SearchOverlayProps } from './SearchOverlay'

function renderOverlay(props: Partial<SearchOverlayProps> = {}) {
  serveBackend()
  const onSearch = vi.fn<(criteria: SearchCriteria) => void>()
  const onClose = vi.fn()
  const view = renderRoutes(
    [
      {
        path: '*',
        element: (
          <SearchOverlay
            initial={EMPTY_CRITERIA}
            typed=""
            focus="text"
            mine={false}
            opener={null}
            onSearch={onSearch}
            onClose={onClose}
            {...props}
          />
        ),
      },
    ],
    '/',
  )
  return { onSearch, onClose, ...view }
}

const dialog = () => screen.findByRole('dialog', { name: 'Rechercher' })
const field = () => screen.getByRole('searchbox', { name: 'Chercher une recette' })
const searchButton = () => screen.getByRole('button', { name: 'Rechercher' })

describe('SearchOverlay', () => {
  afterEach(removeMatchMedia)

  describe('on a phone and a tablet', () => {
    it('is a sheet named « Rechercher », whose first thing is the text field with the keyboard ready', async () => {
      renderOverlay()

      expect(await dialog()).toBeVisible()
      expect(field()).toHaveFocus()
      expect(screen.getByRole('search', { name: 'Recherche de recettes' })).toBeVisible()
    })

    it('puts the focus on the sheet instead when it is opened on the filters, so no keyboard hides them', async () => {
      renderOverlay({ focus: 'filters' })

      await dialog()
      expect(screen.getByRole('heading', { name: 'Rechercher' })).toHaveFocus()
      expect(field()).not.toHaveFocus()
    })

    it('starts from the search it is given: the word and every filter', async () => {
      renderOverlay({
        initial: {
          ...EMPTY_CRITERIA,
          query: 'tarte',
          categoryId: 'plats',
          tagId: 't-four',
          author: 'Odile',
        },
      })

      const sheet = await dialog()
      expect(field()).toHaveValue('tarte')
      expect(await within(sheet).findByRole('radio', { name: 'Plats' })).toBeChecked()
      expect(within(sheet).getByRole('button', { name: 'Four' })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
      expect(within(sheet).getByLabelText("Nom de l'auteur")).toHaveValue('Odile')
    })

    it('writes a key carried from outside at the end of the text, the caret after it', async () => {
      renderOverlay({ initial: { ...EMPTY_CRITERIA, query: 'tar' }, typed: 't' })

      await dialog()

      expect(field()).toHaveValue('tart')
      expect(field()).toHaveProperty('selectionStart', 4)
      expect(field()).toHaveProperty('selectionEnd', 4)
    })

    it('does not carry more than the field can hold', async () => {
      renderOverlay({ initial: { ...EMPTY_CRITERIA, query: 'a'.repeat(200) }, typed: 'b' })

      await dialog()

      expect(field()).toHaveValue('a'.repeat(200))
    })
  })

  describe('« Rechercher »', () => {
    it('is disabled until there is a word or a filter', async () => {
      const user = userEvent.setup()
      renderOverlay()
      await dialog()
      expect(searchButton()).toBeDisabled()

      await user.type(field(), '   ')
      expect(searchButton()).toBeDisabled()

      await user.type(field(), 'tarte')
      expect(searchButton()).toBeEnabled()
    })

    it('is enabled by a filter alone', async () => {
      const user = userEvent.setup()
      renderOverlay()
      const sheet = await dialog()

      await user.click(await within(sheet).findByRole('radio', { name: 'Plats' }))

      expect(searchButton()).toBeEnabled()
    })

    it('is enabled with nothing at all in « Mes recettes », which is a filter of its own', async () => {
      renderOverlay({ mine: true })

      await dialog()

      expect(searchButton()).toBeEnabled()
    })

    it('sends the search it was asked for, with the order the results page had', async () => {
      const user = userEvent.setup()
      const { onSearch, onClose } = renderOverlay({
        initial: { ...EMPTY_CRITERIA, sort: 'title-asc' },
      })
      await dialog()

      await user.type(field(), '  tarte aux poires ')
      await user.click(searchButton())

      expect(onSearch).toHaveBeenCalledExactlyOnceWith({
        ...EMPTY_CRITERIA,
        query: 'tarte aux poires',
        sort: 'title-asc',
      })
      expect(onClose).not.toHaveBeenCalled()
    })

    it('is also what Enter does in the text field', async () => {
      const user = userEvent.setup()
      const { onSearch } = renderOverlay()
      await dialog()

      await user.type(field(), 'gratin{Enter}')

      expect(onSearch).toHaveBeenCalledExactlyOnceWith({ ...EMPTY_CRITERIA, query: 'gratin' })
    })

    it('is not what Enter does while there is nothing to search for', async () => {
      const user = userEvent.setup()
      const { onSearch } = renderOverlay()
      await dialog()

      await user.type(field(), '{Enter}')
      await user.type(field(), '   {Enter}')

      expect(onSearch).not.toHaveBeenCalled()
    })
  })

  describe('« Réinitialiser »', () => {
    it('empties the draft, the word and the filters, and leaves the overlay open', async () => {
      const user = userEvent.setup()
      const { onSearch, onClose } = renderOverlay({
        initial: { ...EMPTY_CRITERIA, query: 'tarte', categoryId: 'plats', tagId: 't-four' },
      })
      const sheet = await dialog()
      expect(await within(sheet).findByRole('radio', { name: 'Plats' })).toBeChecked()

      await user.click(within(sheet).getByRole('button', { name: 'Réinitialiser' }))

      expect(field()).toHaveValue('')
      expect(within(sheet).getByRole('radio', { name: 'Toutes les catégories' })).toBeChecked()
      expect(within(sheet).getByRole('button', { name: 'Four' })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
      expect(searchButton()).toBeDisabled()
      expect(onSearch).not.toHaveBeenCalled()
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('closing', () => {
    it.each([
      [
        'the cross',
        async (user: ReturnType<typeof userEvent.setup>) => {
          await user.click(screen.getByRole('button', { name: 'Fermer' }))
        },
      ],
      [
        'the handle',
        async (user: ReturnType<typeof userEvent.setup>) => {
          await user.click(screen.getByRole('button', { name: 'Glisser vers le bas pour fermer' }))
        },
      ],
      [
        'Escape',
        async (user: ReturnType<typeof userEvent.setup>) => {
          await user.keyboard('{Escape}')
        },
      ],
    ])('with %s applies nothing, whatever was typed or chosen', async (_how, close) => {
      const user = userEvent.setup()
      const { onSearch, onClose } = renderOverlay()
      const sheet = await dialog()
      await user.type(field(), 'tarte')
      await user.click(await within(sheet).findByRole('radio', { name: 'Plats' }))

      await close(user)

      expect(onClose).toHaveBeenCalledOnce()
      expect(onSearch).not.toHaveBeenCalled()
    })
  })

  describe('the filters', () => {
    it('chooses a category among its subcategories, or only that category, and a tag, and an author', async () => {
      const user = userEvent.setup()
      const { onSearch } = renderOverlay()
      const sheet = await dialog()

      await user.click(await within(sheet).findByRole('button', { name: 'Déplier Desserts' }))
      await user.click(within(sheet).getByRole('radio', { name: 'Desserts' }))
      await user.click(within(sheet).getByRole('checkbox', { name: 'Uniquement cette catégorie' }))
      await user.click(within(sheet).getByRole('button', { name: 'Fruits' }))
      await user.type(within(sheet).getByLabelText("Nom de l'auteur"), 'Odile')
      await user.click(searchButton())

      expect(onSearch).toHaveBeenCalledExactlyOnceWith({
        ...EMPTY_CRITERIA,
        categoryId: 'desserts',
        exactCategory: true,
        tagId: 't-fruits',
        author: 'Odile',
      })
    })

    it('only offers « Uniquement cette catégorie » for the chosen one', async () => {
      const user = userEvent.setup()
      renderOverlay()
      const sheet = await dialog()
      await user.click(await within(sheet).findByRole('button', { name: 'Déplier Desserts' }))

      expect(
        within(sheet).getByRole('checkbox', { name: 'Uniquement cette catégorie' }),
      ).toBeDisabled()
    })

    it('shows a tag already chosen first, and drops it with a touch', async () => {
      const user = userEvent.setup()
      renderOverlay({ initial: { ...EMPTY_CRITERIA, tagId: 't-rapide' } })
      const sheet = await dialog()

      await within(sheet).findByRole('button', { name: 'Rapide' })
      const tagChips = within(sheet)
        .getAllByRole('button')
        .filter((chip) => chip.hasAttribute('aria-pressed'))
      expect(tagChips.map((chip) => chip.textContent)).toEqual(['Rapide', 'Four', 'Fruits'])
      expect(tagChips[0]).toHaveAttribute('aria-pressed', 'true')
      await user.click(tagChips[0] ?? sheet)

      expect(within(sheet).getByRole('button', { name: 'Rapide' })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    })

    it('finds a category by typing a start of word, with its parent, and chooses it', async () => {
      const user = userEvent.setup()
      renderOverlay()
      const sheet = await dialog()

      await user.type(
        await within(sheet).findByRole('combobox', { name: 'Chercher une catégorie' }),
        'tar',
      )
      await user.click(within(sheet).getByRole('option', { name: 'Tartes · Desserts' }))

      expect(within(sheet).getByRole('radio', { name: 'Tartes' })).toBeChecked()
      expect(within(sheet).getByText('Tartes ajouté')).toBeVisible()
    })

    it('finds a tag by typing and chooses it', async () => {
      const user = userEvent.setup()
      renderOverlay()
      const sheet = await dialog()

      await user.type(
        await within(sheet).findByRole('combobox', { name: 'Chercher un tag' }),
        'fr{ArrowDown}{Enter}',
      )

      expect(within(sheet).getByRole('button', { name: 'Fruits' })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
    })

    it('says which section is in view with pills that jump to them, with the count of choices', async () => {
      const user = userEvent.setup()
      renderOverlay({ initial: { ...EMPTY_CRITERIA, categoryId: 'plats' } })
      const sheet = await dialog()
      await within(sheet).findByRole('radio', { name: 'Plats' })

      const sections = within(sheet).getByRole('navigation', { name: 'Sections des filtres' })
      expect(
        within(sections)
          .getAllByRole('button')
          .map((pill) => pill.getAttribute('aria-label') ?? pill.textContent),
      ).toEqual(['Catégorie, 1 choix actif', 'Tags', 'Auteur'])
      await user.click(within(sections).getByRole('button', { name: 'Tags' }))

      expect(within(sections).getByRole('button', { name: 'Tags' })).toHaveAttribute(
        'aria-current',
        'true',
      )
      expect(within(sheet).getByRole('group', { name: 'Tags' })).toHaveFocus()
    })

    it('offers no pill for a section that is not there while the filters are not loaded', async () => {
      renderOverlay()
      server.use(http.get(`${API_BASE_URL}/tags`, () => HttpResponse.error()))
      const sheet = await dialog()

      expect(
        within(sheet).queryByRole('navigation', { name: 'Sections des filtres' }),
      ).not.toBeInTheDocument()
      expect(await within(sheet).findByText('Les filtres ne se sont pas chargés.')).toBeVisible()
    })

    it('has no author in « Mes recettes »: the author is the member', async () => {
      renderOverlay({ mine: true })
      const sheet = await dialog()

      await within(sheet).findByRole('button', { name: 'Four' })
      expect(within(sheet).queryByLabelText("Nom de l'auteur")).not.toBeInTheDocument()
      expect(within(sheet).queryByRole('button', { name: 'Auteur' })).not.toBeInTheDocument()
    })

    it('tells when they could not be loaded, loads them again, and searches the text meanwhile', async () => {
      const user = userEvent.setup()
      let up = false
      const { onSearch } = renderOverlay()
      server.use(
        http.get(`${API_BASE_URL}/tags`, () =>
          up ? HttpResponse.json([{ id: 't-four', name: 'Four' }]) : HttpResponse.error(),
        ),
      )
      const sheet = await dialog()

      expect(await within(sheet).findByText('Les filtres ne se sont pas chargés.')).toBeVisible()
      await user.type(field(), 'gratin{Enter}')
      expect(onSearch).toHaveBeenCalledExactlyOnceWith({ ...EMPTY_CRITERIA, query: 'gratin' })
      up = true
      await user.click(within(sheet).getByRole('button', { name: 'Réessayer' }))

      expect(await within(sheet).findByRole('button', { name: 'Four' })).toBeVisible()
    })
  })

  describe('Escape', () => {
    it('is kept by a category field that is open or holds text: it dismisses its suggestions, not the overlay', async () => {
      const user = userEvent.setup()
      const { onClose } = renderOverlay()
      const sheet = await dialog()
      await user.type(field(), 'tarte')
      const combobox = await within(sheet).findByRole('combobox', {
        name: 'Chercher une catégorie',
      })
      await user.type(combobox, 'tar')

      await user.keyboard('{Escape}')

      expect(onClose).not.toHaveBeenCalled()
      expect(field()).toHaveValue('tarte')
    })

    it('closes the overlay from a field that has nothing of its own to dismiss', async () => {
      const user = userEvent.setup()
      const { onClose } = renderOverlay()
      const sheet = await dialog()
      await user.click(
        await within(sheet).findByRole('combobox', { name: 'Chercher une catégorie' }),
      )

      await user.keyboard('{Escape}')

      expect(onClose).toHaveBeenCalledOnce()
    })
  })

  describe('the text field', () => {
    it('stops at 200 characters and says so', async () => {
      renderOverlay()
      await dialog()
      expect(field()).toHaveAttribute('maxlength', '200')

      fireEvent.change(field(), { target: { value: 'a'.repeat(200) } })

      expect(screen.getByText('200 caractères au maximum.')).toBeVisible()
      expect(screen.getByText('200 / 200')).toBeVisible()
      expect(field()).toBeInvalid()
    })

    it('empties with its cross and keeps the focus to type again', async () => {
      const user = userEvent.setup()
      renderOverlay({ initial: { ...EMPTY_CRITERIA, query: 'gratin' } })
      await dialog()

      await user.click(screen.getByRole('button', { name: 'Effacer la recherche' }))

      expect(field()).toHaveValue('')
      expect(field()).toHaveFocus()
    })
  })

  describe('on a desktop', () => {
    it('is a panel with the same name, the category tree beside the tags and the author, and no section pills', async () => {
      installMatchMedia(1280)
      renderOverlay({ focus: 'text' })

      const panel = await dialog()
      await within(panel).findByRole('radio', { name: 'Plats' })

      expect(field()).toHaveFocus()
      expect(within(panel).getByRole('group', { name: 'Catégorie' })).toBeVisible()
      expect(within(panel).getByRole('group', { name: 'Tags' })).toBeVisible()
      expect(within(panel).getByRole('group', { name: 'Auteur' })).toBeVisible()
      expect(within(panel).queryByRole('navigation', { name: 'Sections des filtres' })).toBeNull()
      expect(
        within(panel).queryByRole('button', { name: 'Glisser vers le bas pour fermer' }),
      ).toBeNull()
    })

    it('searches and closes like the sheet does', async () => {
      installMatchMedia(1280)
      const user = userEvent.setup()
      const { onSearch, onClose } = renderOverlay()
      const panel = await dialog()
      await user.click(await within(panel).findByRole('radio', { name: 'Plats' }))
      expect(searchButton()).toBeEnabled()

      await user.click(searchButton())
      expect(onSearch).toHaveBeenCalledExactlyOnceWith({ ...EMPTY_CRITERIA, categoryId: 'plats' })

      await user.keyboard('{Escape}')
      expect(onClose).toHaveBeenCalledOnce()
    })
  })

  describe('accessibility', () => {
    it('has no violation as a sheet', async () => {
      renderOverlay({ initial: { ...EMPTY_CRITERIA, query: 'tarte', categoryId: 'plats' } })
      const sheet = await dialog()
      await within(sheet).findByRole('radio', { name: 'Plats' })

      await expectNoAccessibilityViolations(sheet)
    })

    it('has no violation as a panel', async () => {
      installMatchMedia(1280)
      renderOverlay({ initial: { ...EMPTY_CRITERIA, categoryId: 'plats' } })
      const panel = await dialog()
      await within(panel).findByRole('radio', { name: 'Plats' })

      await expectNoAccessibilityViolations(panel)
    })
  })
})
