import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'
import { API_BASE_URL } from '../../api/apiConfig'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { installMatchMedia, removeMatchMedia } from '../../test/matchMedia'
import { problemResponse } from '../../test/problem'
import { server } from '../../test/server'
import { sessionStore } from '../../api/sessionStore'
import { fakeToken } from '../../test/fakeToken'
import { page, serveBackend } from '../../test/fakeRecipeBackend'
import { renderRoutes } from '../../test/renderRoutes'
import { MyRecipesScreen } from './MyRecipesScreen'
import { SearchScreen } from './SearchScreen'

function signInAs(options: Parameters<typeof fakeToken>[0] = {}) {
  expect(sessionStore.signIn(fakeToken(options))).toBe(true)
}

function renderSearch(path = '/rechercher') {
  return renderRoutes(
    [
      { path: '/rechercher', element: <SearchScreen /> },
      { path: '/mes-recettes', element: <MyRecipesScreen /> },
      { path: '/recettes/nouvelle', element: <p>Page de création</p> },
      { path: '/recettes/:id', element: <p>Page de la recette</p> },
    ],
    path,
  )
}

const field = () => screen.getByRole('searchbox', { name: 'Chercher une recette' })

describe('SearchScreen on a phone', () => {
  afterEach(removeMatchMedia)

  describe('the list', () => {
    it('shows every recipe, newest first, with how many there are and what the order is', async () => {
      const backend = serveBackend()
      renderSearch()

      expect(await screen.findByRole('link', { name: 'Recette 1' })).toBeVisible()
      expect(screen.getByText('3 recettes')).toBeVisible()
      expect(
        screen.getByText('Toutes les recettes, des plus récentes aux plus anciennes'),
      ).toBeVisible()
      expect(backend.lastQuery()).toEqual({
        sortBy: 'CREATED_AT',
        direction: 'DESC',
        size: '20',
        page: '0',
      })
    })

    it('has one level-1 title, for assistive technology', async () => {
      serveBackend()
      renderSearch()
      await screen.findByRole('link', { name: 'Recette 1' })

      expect(screen.getByRole('heading', { level: 1, name: 'Rechercher' })).toBeInTheDocument()
    })

    it('opens a recipe when its card is touched', async () => {
      serveBackend()
      const { router } = renderSearch()

      await userEvent.setup().click(await screen.findByRole('link', { name: 'Recette 2' }))

      expect(router.state.location.pathname).toBe('/recettes/2')
    })

    it('has no accessibility violation', async () => {
      serveBackend()
      const { container } = renderSearch()
      await screen.findByRole('link', { name: 'Recette 1' })

      await expectNoAccessibilityViolations(container)
    })
  })

  describe('the search field', () => {
    it('searches the titles after a pause, without a button, in the address', async () => {
      const backend = serveBackend()
      const { router } = renderSearch()
      await screen.findByRole('link', { name: 'Recette 1' })

      await userEvent.setup().type(field(), 'tarte')

      await waitFor(() => {
        expect(router.state.location.search).toBe('?q=tarte')
      })
      await waitFor(() => {
        expect(backend.lastQuery()).toMatchObject({ title: 'tarte' })
      })
      expect(field()).toHaveValue('tarte')
    })

    it('shows the text of the address when it arrives with one', async () => {
      serveBackend()
      renderSearch('/rechercher?q=gratin')

      expect(field()).toHaveValue('gratin')
      await screen.findByRole('link', { name: 'Recette 1' })
    })

    it('keeps the old answer, marked « Recherche… », while the new one comes', async () => {
      let slow = false
      serveBackend(async () => {
        if (slow) await delay(300)
        return HttpResponse.json(page(0, ['1', '2', '3'], { last: true, total: 3 }))
      })
      renderSearch()
      await screen.findByRole('link', { name: 'Recette 1' })
      slow = true

      await userEvent.setup().type(field(), 'tarte{Enter}')

      expect(await screen.findByText('Recherche…')).toBeVisible()
      expect(screen.getByRole('link', { name: 'Recette 1' })).toBeVisible()
      await waitFor(() => {
        expect(screen.queryByText('Recherche…')).not.toBeInTheDocument()
      })
    })

    it('empties with its cross and keeps the focus to type again', async () => {
      const backend = serveBackend()
      renderSearch('/rechercher?q=gratin')
      await screen.findByRole('link', { name: 'Recette 1' })

      await userEvent.setup().click(screen.getByRole('button', { name: 'Effacer la recherche' }))

      expect(field()).toHaveValue('')
      expect(field()).toHaveFocus()
      await waitFor(() => {
        expect(backend.lastQuery()).not.toHaveProperty('title')
      })
    })

    it('stops at 200 characters and says so', async () => {
      serveBackend()
      renderSearch()
      await screen.findByRole('link', { name: 'Recette 1' })
      expect(field()).toHaveAttribute('maxlength', '200')

      fireEvent.change(field(), { target: { value: 'a'.repeat(200) } })

      expect(screen.getByText('200 caractères au maximum.')).toBeVisible()
      expect(screen.getByText('200 / 200')).toBeVisible()
      expect(field()).toBeInvalid()
    })
  })

  describe('the filters in force', () => {
    const URL = '/rechercher?q=tarte&categorie=desserts&tag=t-fruits&auteur=Odile&tri=titre-az'

    it('are read from the address, asked of the API and shown as chips that drop them', async () => {
      const backend = serveBackend()
      renderSearch(URL)

      expect(
        await screen.findByRole('button', { name: 'Retirer le filtre Desserts' }),
      ).toBeVisible()
      expect(screen.getByRole('button', { name: 'Retirer le filtre Fruits' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Retirer le filtre Par Odile' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Filtres, 3 actifs' })).toBeVisible()
      expect(screen.getByRole('button', { name: /Trier : Titre A → Z/ })).toBeVisible()
      await waitFor(() => {
        expect(backend.lastQuery()).toMatchObject({
          title: 'tarte',
          categoryId: 'desserts',
          tagId: 't-fruits',
          authorName: 'Odile',
          sortBy: 'TITLE',
          direction: 'ASC',
        })
      })
      expect(backend.lastQuery()).not.toHaveProperty('includeSubcategories')
    })

    it('asks for the exact category only', async () => {
      const backend = serveBackend()
      renderSearch('/rechercher?categorie=desserts&exacte=1')

      expect(
        await screen.findByRole('button', { name: 'Retirer le filtre Desserts seulement' }),
      ).toBeVisible()
      await waitFor(() => {
        expect(backend.lastQuery()).toMatchObject({
          categoryId: 'desserts',
          includeSubcategories: 'false',
        })
      })
    })

    it('drops one filter with a touch on its chip, and leaves the others', async () => {
      const backend = serveBackend()
      const { router } = renderSearch(URL)

      await userEvent
        .setup()
        .click(await screen.findByRole('button', { name: 'Retirer le filtre Fruits' }))

      expect(router.state.location.search).toBe(
        '?q=tarte&categorie=desserts&auteur=Odile&tri=titre-az',
      )
      await waitFor(() => {
        expect(backend.lastQuery()).not.toHaveProperty('tagId')
      })
    })

    it('are all dropped by « Tout effacer », which shows from two filters, and the text stays', async () => {
      serveBackend()
      const { router } = renderSearch(URL)
      const user = userEvent.setup()

      await user.click(await screen.findByRole('button', { name: 'Tout effacer' }))

      expect(router.state.location.search).toBe('?q=tarte&tri=titre-az')
      expect(field()).toHaveValue('tarte')
      expect(screen.queryByRole('button', { name: 'Tout effacer' })).not.toBeInTheDocument()
    })

    it('do not offer « Tout effacer » for a single one', async () => {
      serveBackend()
      renderSearch('/rechercher?tag=t-fruits')

      await screen.findByRole('button', { name: 'Retirer le filtre Fruits' })

      expect(screen.queryByRole('button', { name: 'Tout effacer' })).not.toBeInTheDocument()
    })

    it('show no chip for a category that does not exist, but still filter', async () => {
      const backend = serveBackend()
      renderSearch('/rechercher?categorie=inconnue')

      await screen.findByRole('link', { name: 'Recette 1' })

      expect(screen.queryByRole('button', { name: /Retirer le filtre/ })).not.toBeInTheDocument()
      expect(backend.lastQuery()).toMatchObject({ categoryId: 'inconnue' })
    })
  })

  describe('the order', () => {
    it('is chosen in a sheet of four radio buttons, a touch applying it and closing the sheet', async () => {
      const backend = serveBackend()
      const { router } = renderSearch()
      const user = userEvent.setup()
      await screen.findByRole('link', { name: 'Recette 1' })

      await user.click(screen.getByRole('button', { name: /Trier : Plus récentes/ }))
      const sheet = await screen.findByRole('dialog', { name: 'Trier' })
      expect(
        within(sheet)
          .getAllByRole('radio')
          .map((radio) => radio.getAttribute('value')),
      ).toEqual(['recent', 'modified', 'title-asc', 'title-desc'])
      expect(within(sheet).getByRole('radio', { name: 'Plus récentes' })).toBeChecked()
      await user.click(within(sheet).getByText('Titre Z → A'))

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
      expect(router.state.location.search).toBe('?tri=titre-za')
      expect(screen.getByRole('button', { name: /Trier : Titre Z → A/ })).toBeVisible()
      await waitFor(() => {
        expect(backend.lastQuery()).toMatchObject({ sortBy: 'TITLE', direction: 'DESC' })
      })
    })

    it.each([
      ['modifiees', 'UPDATED_AT', 'DESC'],
      ['titre-az', 'TITLE', 'ASC'],
    ])('« %s » asks for %s %s', async (parameter, sortBy, direction) => {
      const backend = serveBackend()
      renderSearch(`/rechercher?tri=${parameter}`)

      await screen.findByRole('link', { name: 'Recette 1' })

      expect(backend.lastQuery()).toMatchObject({ sortBy, direction })
    })

    it('says what the order is above the list only when nothing narrows it down', async () => {
      serveBackend()
      renderSearch('/rechercher?tri=titre-az')
      expect(await screen.findByText('Toutes les recettes, par titre de A à Z')).toBeVisible()
    })

    it('does not show that line for a search', async () => {
      serveBackend()
      renderSearch('/rechercher?q=tarte')
      await screen.findByRole('link', { name: 'Recette 1' })

      expect(screen.queryByText(/^Toutes les recettes/)).not.toBeInTheDocument()
    })
  })

  describe('the states', () => {
    it('shows skeletons and « Recherche… » while the first answer comes', async () => {
      serveBackend(async () => {
        await delay('infinite')
        return HttpResponse.json({})
      })
      renderSearch('/rechercher?q=tarte')

      expect(await screen.findByText('Chargement des recettes…')).toBeInTheDocument()
      expect(screen.getByText('Recherche…')).toBeVisible()
      expect(field()).toHaveValue('tarte')
    })

    it('says what was searched when nothing is found, and offers to drop the filters but keep the text', async () => {
      serveBackend(() => HttpResponse.json(page(0, [], { last: true, total: 0 })))
      const { router } = renderSearch('/rechercher?q=tarte%20aux%20poires&categorie=desserts')
      const user = userEvent.setup()

      expect(
        await screen.findByRole('heading', { name: 'Aucune recette pour « tarte aux poires »' }),
      ).toBeVisible()
      expect(screen.getByText('0 recette')).toBeVisible()
      await user.click(screen.getByRole('button', { name: 'Effacer les filtres' }))

      expect(router.state.location.search).toBe('?q=tarte+aux+poires')
      expect(field()).toHaveValue('tarte aux poires')
    })

    it('says so when the filters alone find nothing', async () => {
      serveBackend(() => HttpResponse.json(page(0, [], { last: true, total: 0 })))
      renderSearch('/rechercher?tag=t-fruits')

      expect(
        await screen.findByRole('heading', { name: 'Aucune recette avec ces filtres' }),
      ).toBeVisible()
    })

    it('offers no filters to drop when only the text found nothing', async () => {
      serveBackend(() => HttpResponse.json(page(0, [], { last: true, total: 0 })))
      renderSearch('/rechercher?q=zzz')

      await screen.findByRole('heading', { name: 'Aucune recette pour « zzz »' })

      expect(screen.queryByRole('button', { name: 'Effacer les filtres' })).not.toBeInTheDocument()
    })

    it('says the library is empty when there is no recipe at all', async () => {
      serveBackend(() => HttpResponse.json(page(0, [], { last: true, total: 0 })))
      renderSearch()

      expect(
        await screen.findByRole('heading', { name: 'Aucune recette pour le moment' }),
      ).toBeVisible()
    })

    it('says there is no connection, keeping the field and the filters, and searches again on demand', async () => {
      let up = false
      serveBackend(() =>
        up ? HttpResponse.json(page(0, ['1'], { last: true, total: 1 })) : HttpResponse.error(),
      )
      renderSearch('/rechercher?q=tarte&tag=t-fruits')
      const user = userEvent.setup()

      const alert = await screen.findByRole('alert')
      expect(
        within(alert).getByRole('heading', { name: 'Pas de connexion pour le moment' }),
      ).toBeVisible()
      expect(field()).toHaveValue('tarte')
      expect(screen.getByRole('button', { name: 'Retirer le filtre Fruits' })).toBeVisible()
      up = true
      await user.click(within(alert).getByRole('button', { name: 'Réessayer' }))

      expect(await screen.findByRole('link', { name: 'Recette 1' })).toBeVisible()
    })

    it.each([
      [400, {}, 'Certaines informations ne sont pas valides. Vérifie ta saisie, puis réessaie.'],
      [500, {}, 'Le serveur a rencontré un problème. Réessaie dans un moment.'],
      [503, { 'Retry-After': '30' }, 'Le serveur est très sollicité. Réessaie dans 30 secondes.'],
    ])('answers a %i with the sentence of its cause', async (status, headers, sentence) => {
      serveBackend(() => problemResponse(status, 'detail', headers))
      renderSearch()

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Impossible de charger les recettes')
      expect(alert).toHaveTextContent(sentence)
    })

    it('has no accessibility violation when nothing is found or when it failed', async () => {
      serveBackend(() => HttpResponse.json(page(0, [], { last: true, total: 0 })))
      const empty = renderSearch('/rechercher?q=zzz&tag=t-fruits')
      await screen.findByRole('heading', { name: 'Aucune recette pour « zzz »' })
      await expectNoAccessibilityViolations(empty.container)
      empty.unmount()

      serveBackend(() => HttpResponse.error())
      const failed = renderSearch()
      await screen.findByRole('alert')
      await expectNoAccessibilityViolations(failed.container)
    })
  })

  describe('« Voir plus de recettes »', () => {
    it('adds the next page under the others and ends with a sentence', async () => {
      const backend = serveBackend((query) =>
        HttpResponse.json(
          query.get('page') === '0'
            ? page(0, ['1', '2'], { last: false, total: 4 })
            : page(1, ['3', '4'], { last: true, total: 4 }),
        ),
      )
      renderSearch('/rechercher?q=tarte')
      const user = userEvent.setup()

      expect(await screen.findByText('2 sur 4 recettes')).toBeVisible()
      await user.click(screen.getByRole('button', { name: 'Voir plus de recettes' }))

      expect(await screen.findByText('Tu as tout vu : 4 recettes.')).toHaveFocus()
      expect(screen.getAllByRole('link', { name: /^Recette \d$/ })).toHaveLength(4)
      expect(backend.lastQuery()).toMatchObject({ page: '1', title: 'tarte' })
    })
  })
})

describe('FiltersControl in the screen', () => {
  afterEach(removeMatchMedia)

  it('opens a sheet of filters on a draft, shows how many recipes it would give, and applies it', async () => {
    const backend = serveBackend((query) =>
      HttpResponse.json(
        query.get('categoryId') === 'plats'
          ? page(0, ['9'], { last: true, total: 1 })
          : page(0, ['1', '2', '3'], { last: true, total: 3 }),
      ),
    )
    const { router } = renderSearch('/rechercher?q=tarte')
    const user = userEvent.setup()
    await screen.findByRole('link', { name: 'Recette 1' })

    await user.click(screen.getByRole('button', { name: 'Filtres' }))
    const sheet = await screen.findByRole('dialog', { name: 'Filtres' })
    expect(await within(sheet).findByRole('button', { name: 'Voir les 3 recettes' })).toBeVisible()
    await user.click(within(sheet).getByRole('radio', { name: 'Plats' }))

    expect(await within(sheet).findByRole('button', { name: 'Voir la recette' })).toBeVisible()
    expect(backend.lastCountQuery()).toMatchObject({
      title: 'tarte',
      categoryId: 'plats',
      size: '1',
    })
    expect(router.state.location.search).toBe('?q=tarte')

    await user.click(within(sheet).getByRole('button', { name: 'Voir la recette' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(router.state.location.search).toBe('?q=tarte&categorie=plats')
    expect(screen.getByRole('button', { name: 'Filtres, 1 actif' })).toHaveFocus()
  })

  it('drops the draft when the sheet is closed without applying it', async () => {
    serveBackend()
    const { router } = renderSearch()
    const user = userEvent.setup()
    await screen.findByRole('link', { name: 'Recette 1' })
    await user.click(screen.getByRole('button', { name: 'Filtres' }))
    const sheet = await screen.findByRole('dialog')
    await user.click(await within(sheet).findByRole('radio', { name: 'Plats' }))

    await user.click(within(sheet).getByRole('button', { name: 'Fermer' }))

    expect(router.state.location.search).toBe('')
    await user.click(screen.getByRole('button', { name: 'Filtres' }))
    expect(await screen.findByRole('radio', { name: 'Toutes les catégories' })).toBeChecked()
  })

  it('resets the draft to no filter with « Réinitialiser », and applies that', async () => {
    serveBackend()
    const { router } = renderSearch('/rechercher?categorie=plats&tag=t-four')
    const user = userEvent.setup()
    await screen.findByRole('link', { name: 'Recette 1' })
    await user.click(screen.getByRole('button', { name: 'Filtres, 2 actifs' }))
    const sheet = await screen.findByRole('dialog')
    expect(await within(sheet).findByRole('radio', { name: 'Plats' })).toBeChecked()

    await user.click(within(sheet).getByRole('button', { name: 'Réinitialiser' }))
    expect(within(sheet).getByRole('radio', { name: 'Toutes les catégories' })).toBeChecked()
    await user.click(within(sheet).getByRole('button', { name: /^Voir/ }))

    await waitFor(() => {
      expect(router.state.location.search).toBe('')
    })
  })

  it('chooses a category among its subcategories, or only that category, and a tag, and an author', async () => {
    const backend = serveBackend()
    const { router } = renderSearch()
    const user = userEvent.setup()
    await screen.findByRole('link', { name: 'Recette 1' })

    await user.click(screen.getByRole('button', { name: 'Filtres' }))
    const sheet = await screen.findByRole('dialog')
    await user.click(await within(sheet).findByRole('button', { name: 'Déplier Desserts' }))
    await user.click(within(sheet).getByRole('radio', { name: 'Desserts' }))
    await user.click(within(sheet).getByRole('checkbox', { name: 'Uniquement cette catégorie' }))
    await user.click(within(sheet).getByRole('button', { name: 'Fruits' }))
    await user.type(within(sheet).getByLabelText("Nom de l'auteur"), 'Odile')
    await user.click(within(sheet).getByRole('button', { name: /^Voir/ }))

    await waitFor(() => {
      expect(router.state.location.search).toBe(
        '?categorie=desserts&exacte=1&tag=t-fruits&auteur=Odile',
      )
    })
    await waitFor(() => {
      expect(backend.lastQuery()).toMatchObject({
        categoryId: 'desserts',
        includeSubcategories: 'false',
        tagId: 't-fruits',
        authorName: 'Odile',
      })
    })
  })

  it('only offers « Uniquement cette catégorie » for the chosen one', async () => {
    serveBackend()
    renderSearch()
    const user = userEvent.setup()
    await screen.findByRole('link', { name: 'Recette 1' })
    await user.click(screen.getByRole('button', { name: 'Filtres' }))
    const sheet = await screen.findByRole('dialog')
    await user.click(await within(sheet).findByRole('button', { name: 'Déplier Desserts' }))

    expect(
      within(sheet).getByRole('checkbox', { name: 'Uniquement cette catégorie' }),
    ).toBeDisabled()
  })

  it('shows a tag already chosen first, and drops it with a touch', async () => {
    serveBackend()
    renderSearch('/rechercher?tag=t-rapide')
    const user = userEvent.setup()
    await screen.findByRole('link', { name: 'Recette 1' })
    await user.click(screen.getByRole('button', { name: 'Filtres, 1 actif' }))
    const sheet = await screen.findByRole('dialog')

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
    serveBackend()
    renderSearch()
    const user = userEvent.setup()
    await screen.findByRole('link', { name: 'Recette 1' })
    await user.click(screen.getByRole('button', { name: 'Filtres' }))
    const sheet = await screen.findByRole('dialog')

    await user.type(
      await within(sheet).findByRole('combobox', { name: 'Chercher une catégorie' }),
      'tar',
    )
    expect(within(sheet).getByRole('option', { name: 'Tartes · Desserts' })).toBeVisible()
    await user.click(within(sheet).getByRole('option', { name: 'Tartes · Desserts' }))

    expect(within(sheet).getByRole('radio', { name: 'Tartes' })).toBeChecked()
    expect(within(sheet).getByText('Tartes ajouté')).toBeVisible()
  })

  it('finds a tag by typing and chooses it', async () => {
    serveBackend()
    renderSearch()
    const user = userEvent.setup()
    await screen.findByRole('link', { name: 'Recette 1' })
    await user.click(screen.getByRole('button', { name: 'Filtres' }))
    const sheet = await screen.findByRole('dialog')

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
    serveBackend()
    renderSearch('/rechercher?categorie=plats')
    const user = userEvent.setup()
    await screen.findByRole('link', { name: 'Recette 1' })
    await user.click(screen.getByRole('button', { name: 'Filtres, 1 actif' }))
    const sheet = await screen.findByRole('dialog')

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

  it('tells when the filters could not be loaded, and loads them again', async () => {
    let up = false
    serveBackend()
    server.use(
      http.get(`${API_BASE_URL}/tags`, () =>
        up ? HttpResponse.json([{ id: 't-four', name: 'Four' }]) : HttpResponse.error(),
      ),
    )
    renderSearch()
    const user = userEvent.setup()
    await screen.findByRole('link', { name: 'Recette 1' })
    await user.click(screen.getByRole('button', { name: 'Filtres' }))
    const sheet = await screen.findByRole('dialog')

    expect(await within(sheet).findByText('Les filtres ne se sont pas chargés.')).toBeVisible()
    up = true
    await user.click(within(sheet).getByRole('button', { name: 'Réessayer' }))

    expect(await within(sheet).findByRole('button', { name: 'Four' })).toBeVisible()
  })

  it('has no accessibility violation with the sheet open', async () => {
    serveBackend()
    renderSearch('/rechercher?categorie=plats')
    const user = userEvent.setup()
    await screen.findByRole('link', { name: 'Recette 1' })
    await user.click(screen.getByRole('button', { name: 'Filtres, 1 actif' }))
    const sheet = await screen.findByRole('dialog')
    await within(sheet).findByRole('radio', { name: 'Plats' })

    await expectNoAccessibilityViolations(sheet)
  })
})

describe('MyRecipesScreen', () => {
  afterEach(removeMatchMedia)

  it("lists the member's own recipes under their title, with a locked chip and no author filter", async () => {
    const backend = serveBackend()
    signInAs({ userId: 'u-42' })
    renderSearch('/mes-recettes')

    expect(await screen.findByRole('link', { name: 'Recette 1' })).toBeVisible()
    expect(screen.getByRole('heading', { level: 1, name: 'Mes recettes' })).toBeVisible()
    expect(screen.getByText(/Mes recettes/, { selector: 'span' })).toHaveTextContent('verrouillé')
    expect(backend.lastQuery()).toMatchObject({ authorId: 'u-42' })
    expect(screen.queryByRole('button', { name: 'Filtres' })).toBeInTheDocument()
  })

  it('does not count the lock among the filters, and has no author section in the sheet', async () => {
    serveBackend()
    signInAs()
    renderSearch('/mes-recettes?tag=t-four')
    const user = userEvent.setup()
    await screen.findByRole('link', { name: 'Recette 1' })

    await user.click(screen.getByRole('button', { name: 'Filtres, 1 actif' }))
    const sheet = await screen.findByRole('dialog')

    await within(sheet).findByRole('button', { name: 'Four' })
    expect(within(sheet).queryByLabelText("Nom de l'auteur")).not.toBeInTheDocument()
    expect(within(sheet).queryByRole('button', { name: 'Auteur' })).not.toBeInTheDocument()
  })

  it("ignores an author in the address: the list must stay the member's", async () => {
    const backend = serveBackend()
    signInAs({ userId: 'u-42' })
    renderSearch('/mes-recettes?auteur=Hugo')

    await screen.findByRole('link', { name: 'Recette 1' })

    expect(backend.lastQuery()).toMatchObject({ authorId: 'u-42' })
    expect(backend.lastQuery()).not.toHaveProperty('authorName')
    expect(screen.queryByRole('button', { name: /Par Hugo/ })).not.toBeInTheDocument()
  })

  it('invites the member to write a first recipe when they have none', async () => {
    serveBackend(() => HttpResponse.json(page(0, [], { last: true, total: 0 })))
    signInAs()
    const { router } = renderSearch('/mes-recettes')

    expect(
      await screen.findByRole('heading', { name: "Tu n'as pas encore de recette" }),
    ).toBeVisible()
    await userEvent.setup().click(screen.getByRole('link', { name: 'Créer ma première recette' }))

    expect(router.state.location.pathname).toBe('/recettes/nouvelle')
  })

  it('says nothing was found, like the search does, when a text or a filter finds nothing', async () => {
    serveBackend(() => HttpResponse.json(page(0, [], { last: true, total: 0 })))
    signInAs()
    renderSearch('/mes-recettes?q=zzz')

    expect(
      await screen.findByRole('heading', { name: 'Aucune recette pour « zzz »' }),
    ).toBeVisible()
  })

  it("shows nothing without a member, rather than everybody's recipes under this title", () => {
    const backend = serveBackend()
    const { container } = renderSearch('/mes-recettes')

    expect(container).toBeEmptyDOMElement()
    expect(backend.recipeQueries).toHaveLength(0)
  })

  it('has no accessibility violation', async () => {
    serveBackend()
    signInAs()
    const { container } = renderSearch('/mes-recettes')
    await screen.findByRole('link', { name: 'Recette 1' })

    await expectNoAccessibilityViolations(container)
  })
})

describe('SearchScreen on a desktop', () => {
  afterEach(removeMatchMedia)

  it('puts the filters in a column that applies each choice at once, and no sheet', async () => {
    installMatchMedia(1280)
    const backend = serveBackend()
    const { router } = renderSearch()
    const user = userEvent.setup()
    await screen.findByRole('link', { name: 'Recette 1' })

    const column = screen.getByRole('complementary', { name: 'Filtres' })
    expect(screen.queryByRole('button', { name: 'Filtres' })).not.toBeInTheDocument()
    expect(
      screen.queryByRole('searchbox', { name: 'Chercher une recette' }),
    ).not.toBeInTheDocument()
    await user.click(await within(column).findByRole('radio', { name: 'Plats' }))

    expect(router.state.location.search).toBe('?categorie=plats')
    await waitFor(() => {
      expect(backend.lastQuery()).toMatchObject({ categoryId: 'plats' })
    })
    expect(within(column).queryByRole('button', { name: /^Voir/ })).not.toBeInTheDocument()
    await user.click(within(column).getByRole('button', { name: 'Réinitialiser' }))
    expect(router.state.location.search).toBe('')
  })

  it("shows the title of the page and the sort as the browser's own list", async () => {
    installMatchMedia(1280)
    serveBackend()
    const { router } = renderSearch()
    const user = userEvent.setup()
    await screen.findByRole('link', { name: 'Recette 1' })

    expect(screen.getByRole('heading', { level: 1, name: 'Rechercher' })).toBeVisible()
    await user.selectOptions(screen.getByRole('combobox', { name: /Trier/ }), 'title-asc')

    expect(router.state.location.search).toBe('?tri=titre-az')
  })

  it('offers « Nouvelle recette » in the header of « Mes recettes »', async () => {
    installMatchMedia(1280)
    serveBackend()
    signInAs()
    renderSearch('/mes-recettes')
    await screen.findByRole('link', { name: 'Recette 1' })

    expect(screen.getByRole('link', { name: 'Nouvelle recette' })).toHaveAttribute(
      'href',
      '/recettes/nouvelle',
    )
    expect(screen.queryByRole('complementary', { name: 'Filtres' })?.textContent).not.toContain(
      "Nom de l'auteur",
    )
  })

  it('has no accessibility violation', async () => {
    installMatchMedia(1280)
    serveBackend()
    const { container } = renderSearch('/rechercher?categorie=plats')
    await screen.findByRole('link', { name: 'Recette 1' })
    await within(screen.getByRole('complementary', { name: 'Filtres' })).findByRole('radio', {
      name: 'Plats',
    })

    await expectNoAccessibilityViolations(container)
  })
})
