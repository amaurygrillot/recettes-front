import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { Outlet } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { API_BASE_URL } from '../../api/apiConfig'
import { sessionStore } from '../../api/sessionStore'
import { SearchOverlayContext } from '../../app/useSearchOverlay'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { fakeToken } from '../../test/fakeToken'
import { page, serveBackend } from '../../test/fakeRecipeBackend'
import { installMatchMedia, removeMatchMedia } from '../../test/matchMedia'
import { problemResponse } from '../../test/problem'
import { renderRoutes } from '../../test/renderRoutes'
import { server } from '../../test/server'
import { MyRecipesScreen } from './MyRecipesScreen'
import { SearchScreen } from './SearchScreen'

function signInAs(options: Parameters<typeof fakeToken>[0] = {}) {
  expect(sessionStore.signIn(fakeToken(options))).toBe(true)
}

/** A results page, reached with a criterion as it always is. `openSearch` stands for the shell's overlay. */
function renderSearch(path = '/rechercher?q=tarte') {
  const openSearch = vi.fn()
  const rendered = renderRoutes(
    [
      {
        element: (
          <SearchOverlayContext value={openSearch}>
            <Outlet />
          </SearchOverlayContext>
        ),
        children: [
          { path: '/rechercher', element: <SearchScreen /> },
          { path: '/mes-recettes', element: <MyRecipesScreen /> },
          { path: '/recettes/nouvelle', element: <p>Page de création</p> },
          { path: '/recettes/:id', element: <p>Page de la recette</p> },
        ],
      },
    ],
    path,
  )
  return { ...rendered, openSearch }
}

/** The field of the results page: a button that shows the word searched. */
const field = () => screen.getByRole('button', { name: /^Chercher une recette/ })

describe('SearchScreen on a phone', () => {
  afterEach(removeMatchMedia)

  describe('the list', () => {
    it('shows the recipes of the search, newest first, with how many there are', async () => {
      const backend = serveBackend()
      renderSearch()

      expect(await screen.findByRole('link', { name: 'Recette 1' })).toBeVisible()
      expect(screen.getByText('3 recettes')).toBeVisible()
      expect(screen.queryByText(/^Toutes les recettes/)).not.toBeInTheDocument()
      expect(backend.lastQuery()).toEqual({
        title: 'tarte',
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
    it('shows the word of the address, and opens the search over the page when it is touched', async () => {
      serveBackend()
      const { router, openSearch } = renderSearch('/rechercher?q=gratin')
      await screen.findByRole('link', { name: 'Recette 1' })

      expect(field()).toHaveAccessibleName('Chercher une recette : gratin')
      await userEvent.setup().click(field())

      expect(openSearch).toHaveBeenCalledExactlyOnceWith({})
      expect(router.state.location.search).toBe('?q=gratin')
    })

    it('carries the first key typed on it into the search', async () => {
      serveBackend()
      const { openSearch } = renderSearch()
      await screen.findByRole('link', { name: 'Recette 1' })
      field().focus()

      await userEvent.setup().keyboard('x')

      expect(openSearch).toHaveBeenCalledExactlyOnceWith({ typed: 'x' })
    })

    it('clears the word in place with its cross, and keeps the filters and the list', async () => {
      const backend = serveBackend()
      const { router, openSearch } = renderSearch('/rechercher?q=gratin&tag=t-fruits')
      await screen.findByRole('link', { name: 'Recette 1' })

      await userEvent.setup().click(screen.getByRole('button', { name: 'Effacer la recherche' }))

      expect(router.state.location.search).toBe('?tag=t-fruits')
      expect(openSearch).not.toHaveBeenCalled()
      expect(field()).toHaveAccessibleName('Chercher une recette')
      await waitFor(() => {
        expect(backend.lastQuery()).not.toHaveProperty('title')
      })
      expect(backend.lastTagIds()).toEqual(['t-fruits'])
    })

    it('keeps the old answer, marked « Recherche… », while the new one comes', async () => {
      let slow = false
      serveBackend(async () => {
        if (slow) await delay(300)
        return HttpResponse.json(page(0, ['1', '2', '3'], { last: true, total: 3 }))
      })
      renderSearch('/rechercher?q=gratin&tag=t-fruits')
      await screen.findByRole('link', { name: 'Recette 1' })
      slow = true

      await userEvent.setup().click(screen.getByRole('button', { name: 'Effacer la recherche' }))

      expect(await screen.findByText('Recherche…')).toBeVisible()
      expect(screen.getByRole('link', { name: 'Recette 1' })).toBeVisible()
      await waitFor(() => {
        expect(screen.queryByText('Recherche…')).not.toBeInTheDocument()
      })
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
          authorName: 'Odile',
          sortBy: 'TITLE',
          direction: 'ASC',
        })
      })
      expect(backend.lastTagIds()).toEqual(['t-fruits'])
      expect(backend.lastQuery()).not.toHaveProperty('includeSubcategories')
    })

    it('asks for every tag of the address, each shown by its name as a chip that drops it', async () => {
      const backend = serveBackend()
      const { router } = renderSearch('/rechercher?tag=t-fruits&tag=t-four&tag=t-rapide')
      const user = userEvent.setup()

      expect(await screen.findByRole('button', { name: 'Retirer le filtre Fruits' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Retirer le filtre Four' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Retirer le filtre Rapide' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Filtres, 3 actifs' })).toBeVisible()
      await waitFor(() => {
        expect(backend.lastTagIds()).toEqual(['t-fruits', 't-four', 't-rapide'])
      })

      await user.click(screen.getByRole('button', { name: 'Retirer le filtre Four' }))

      expect(router.state.location.search).toBe('?tag=t-fruits&tag=t-rapide')
      await waitFor(() => {
        expect(backend.lastTagIds()).toEqual(['t-fruits', 't-rapide'])
      })
    })

    it('asks for every ingredient of the address, each shown by its name as a chip that drops it', async () => {
      const backend = serveBackend()
      const { router } = renderSearch('/rechercher?ingredient=i-pommes&ingredient=i-farine')
      const user = userEvent.setup()

      expect(await screen.findByRole('button', { name: 'Retirer le filtre Pommes' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Retirer le filtre Farine' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Filtres, 2 actifs' })).toBeVisible()
      await waitFor(() => {
        expect(backend.lastIngredientIds()).toEqual(['i-pommes', 'i-farine'])
      })

      await user.click(screen.getByRole('button', { name: 'Retirer le filtre Pommes' }))

      expect(router.state.location.search).toBe('?ingredient=i-farine')
      await waitFor(() => {
        expect(backend.lastIngredientIds()).toEqual(['i-farine'])
      })
    })

    it('show no chip for an ingredient that does not exist, but still filter', async () => {
      const backend = serveBackend()
      renderSearch('/rechercher?ingredient=i-disparu')

      await screen.findByRole('link', { name: 'Recette 1' })

      expect(screen.queryByRole('button', { name: /Retirer le filtre/ })).not.toBeInTheDocument()
      expect(backend.lastIngredientIds()).toEqual(['i-disparu'])
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
        expect(backend.lastTagIds()).toEqual([])
      })
    })

    it('are all dropped by « Tout effacer », which shows from two filters, and the text stays', async () => {
      serveBackend()
      const { router } = renderSearch(URL)
      const user = userEvent.setup()

      await user.click(await screen.findByRole('button', { name: 'Tout effacer' }))

      expect(router.state.location.search).toBe('?q=tarte&tri=titre-az')
      expect(field()).toHaveAccessibleName('Chercher une recette : tarte')
      expect(screen.queryByRole('button', { name: 'Tout effacer' })).not.toBeInTheDocument()
    })

    it('do not offer « Tout effacer » for a single one', async () => {
      serveBackend()
      renderSearch('/rechercher?tag=t-fruits')

      await screen.findByRole('button', { name: 'Retirer le filtre Fruits' })

      expect(screen.queryByRole('button', { name: 'Tout effacer' })).not.toBeInTheDocument()
    })

    it('are all dropped by « Tout effacer » when they are two tags alone', async () => {
      const backend = serveBackend()
      const { router } = renderSearch('/rechercher?q=tarte&tag=t-fruits&tag=t-four')

      await userEvent.setup().click(await screen.findByRole('button', { name: 'Tout effacer' }))

      expect(router.state.location.search).toBe('?q=tarte')
      await waitFor(() => {
        expect(backend.lastTagIds()).toEqual([])
      })
    })

    it('lose a tag that does not exist once the tags are known: it leaves the address and the request', async () => {
      const backend = serveBackend()
      const { router } = renderSearch('/rechercher?tag=t-fruits&tag=t-disparu')

      expect(await screen.findByRole('button', { name: 'Retirer le filtre Fruits' })).toBeVisible()

      await waitFor(() => {
        expect(router.state.location.search).toBe('?tag=t-fruits')
      })
      await waitFor(() => {
        expect(backend.lastTagIds()).toEqual(['t-fruits'])
      })
      expect(screen.getAllByRole('button', { name: /Retirer le filtre/ })).toHaveLength(1)
    })

    it('keeps the tags of the address when the tags could not be loaded', async () => {
      const backend = serveBackend()
      let tagRequests = 0
      server.use(
        http.get(`${API_BASE_URL}/tags`, () => {
          tagRequests += 1
          return HttpResponse.error()
        }),
      )
      const { router } = renderSearch('/rechercher?tag=t-fruits&tag=t-disparu')

      await screen.findByRole('link', { name: 'Recette 1' })
      await waitFor(() => {
        expect(tagRequests).toBeGreaterThan(0)
      })

      expect(router.state.location.search).toBe('?tag=t-fruits&tag=t-disparu')
      expect(backend.lastTagIds()).toEqual(['t-fruits', 't-disparu'])
    })

    it('show no chip for a category that does not exist, but still filter', async () => {
      const backend = serveBackend()
      renderSearch('/rechercher?categorie=inconnue')

      await screen.findByRole('link', { name: 'Recette 1' })

      expect(screen.queryByRole('button', { name: /Retirer le filtre/ })).not.toBeInTheDocument()
      expect(backend.lastQuery()).toMatchObject({ categoryId: 'inconnue' })
    })

    it('are changed in the search, which « Filtres » opens on its filters', async () => {
      serveBackend()
      const { router, openSearch } = renderSearch('/rechercher?q=tarte&categorie=desserts')
      await screen.findByRole('link', { name: 'Recette 1' })

      await userEvent.setup().click(screen.getByRole('button', { name: 'Filtres, 1 actif' }))

      expect(openSearch).toHaveBeenCalledExactlyOnceWith({ focus: 'filters' })
      expect(router.state.location.search).toBe('?q=tarte&categorie=desserts')
    })

    it('has a « Filtres » button without a count when none is in force', async () => {
      serveBackend()
      renderSearch()
      await screen.findByRole('link', { name: 'Recette 1' })

      expect(screen.getByRole('button', { name: 'Filtres' })).toHaveAttribute(
        'aria-haspopup',
        'dialog',
      )
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
      expect(router.state.location.search).toBe('?q=tarte&tri=titre-za')
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
      renderSearch(`/rechercher?q=tarte&tri=${parameter}`)

      await screen.findByRole('link', { name: 'Recette 1' })

      expect(backend.lastQuery()).toMatchObject({ sortBy, direction })
    })
  })

  describe('with nothing to search for', () => {
    it('invites to search instead of listing the library, and asks the API for nothing', async () => {
      const backend = serveBackend()
      renderSearch('/rechercher')

      expect(await screen.findByRole('heading', { name: 'Que veux-tu cuisiner ?' })).toBeVisible()
      expect(screen.queryByRole('link', { name: /^Recette/ })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Trier/ })).not.toBeInTheDocument()
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      await delay(50)
      expect(backend.recipeQueries).toHaveLength(0)
    })

    it('invites also when the order is the only thing in the address', async () => {
      const backend = serveBackend()
      renderSearch('/rechercher?tri=titre-az')

      expect(await screen.findByRole('heading', { name: 'Que veux-tu cuisiner ?' })).toBeVisible()
      await delay(50)
      expect(backend.recipeQueries).toHaveLength(0)
    })

    it('opens the search from its button', async () => {
      serveBackend()
      const { openSearch } = renderSearch('/rechercher')

      await userEvent
        .setup()
        .click(await screen.findByRole('button', { name: 'Lancer une recherche' }))

      expect(openSearch).toHaveBeenCalledOnce()
    })

    it('comes after the last criterion is cleared, and the list is gone', async () => {
      serveBackend()
      renderSearch('/rechercher?q=gratin')
      await screen.findByRole('link', { name: 'Recette 1' })

      await userEvent.setup().click(screen.getByRole('button', { name: 'Effacer la recherche' }))

      expect(await screen.findByRole('heading', { name: 'Que veux-tu cuisiner ?' })).toBeVisible()
      expect(screen.queryByRole('link', { name: 'Recette 1' })).not.toBeInTheDocument()
    })

    it('has no accessibility violation', async () => {
      serveBackend()
      const { container } = renderSearch('/rechercher')
      await screen.findByRole('heading', { name: 'Que veux-tu cuisiner ?' })

      await expectNoAccessibilityViolations(container)
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
      expect(field()).toHaveAccessibleName('Chercher une recette : tarte')
    })

    it('says what was searched when nothing is found, and offers to drop the filters but keep the text', async () => {
      serveBackend(() => HttpResponse.json(page(0, [], { last: true, total: 0 })))
      const { router } = renderSearch('/rechercher?q=tarte%20aux%20poires&categorie=desserts')
      const user = userEvent.setup()

      expect(await screen.findByRole('heading', { name: 'Je n’ai rien trouvé…' })).toBeVisible()
      expect(
        screen.getByText(
          'Aucune recette ne contient « tarte aux poires ». Essaie un seul mot, ou enlève un filtre.',
        ),
      ).toBeVisible()
      expect(screen.getByText('0 recette')).toBeVisible()
      await user.click(screen.getByRole('button', { name: 'Effacer les filtres' }))

      expect(router.state.location.search).toBe('?q=tarte+aux+poires')
      expect(field()).toHaveAccessibleName('Chercher une recette : tarte aux poires')
    })

    it('says so when the filters alone find nothing', async () => {
      serveBackend(() => HttpResponse.json(page(0, [], { last: true, total: 0 })))
      renderSearch('/rechercher?tag=t-fruits')

      expect(await screen.findByRole('heading', { name: 'Je n’ai rien trouvé…' })).toBeVisible()
      expect(screen.getByText(/Aucune recette ne correspond à ces filtres/)).toBeVisible()
    })

    it('offers no filters to drop when only the text found nothing', async () => {
      serveBackend(() => HttpResponse.json(page(0, [], { last: true, total: 0 })))
      renderSearch('/rechercher?q=zzz')

      await screen.findByRole('heading', { name: 'Je n’ai rien trouvé…' })

      expect(screen.queryByRole('button', { name: 'Effacer les filtres' })).not.toBeInTheDocument()
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
        within(alert).getByRole('heading', { name: 'Je fais une petite sieste' }),
      ).toBeVisible()
      expect(field()).toHaveAccessibleName('Chercher une recette : tarte')
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
      await screen.findByRole('heading', { name: 'Je n’ai rien trouvé…' })
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
    expect(screen.getByRole('button', { name: 'Filtres' })).toBeInTheDocument()
  })

  it('lists them with no criterion at all: « Mes recettes » is the criterion', async () => {
    const backend = serveBackend()
    signInAs({ userId: 'u-42' })
    renderSearch('/mes-recettes')

    await screen.findByRole('link', { name: 'Recette 1' })

    expect(
      screen.queryByRole('heading', { name: 'Que veux-tu cuisiner ?' }),
    ).not.toBeInTheDocument()
    expect(backend.lastQuery()).toMatchObject({ authorId: 'u-42' })
  })

  it('does not count the lock among the filters', async () => {
    serveBackend()
    signInAs()
    renderSearch('/mes-recettes?tag=t-four')

    await screen.findByRole('link', { name: 'Recette 1' })

    expect(screen.getByRole('button', { name: 'Filtres, 1 actif' })).toBeVisible()
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

    expect(await screen.findByRole('heading', { name: 'Ajoute ta première recette' })).toBeVisible()
    await userEvent.setup().click(screen.getByRole('link', { name: 'Créer ma première recette' }))

    expect(router.state.location.pathname).toBe('/recettes/nouvelle')
  })

  it('says nothing was found, like the search does, when a text or a filter finds nothing', async () => {
    serveBackend(() => HttpResponse.json(page(0, [], { last: true, total: 0 })))
    signInAs()
    renderSearch('/mes-recettes?q=zzz')

    expect(await screen.findByRole('heading', { name: 'Je n’ai rien trouvé…' })).toBeVisible()
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
    expect(screen.queryByRole('button', { name: /^Chercher une recette/ })).not.toBeInTheDocument()
    await user.click(await within(column).findByRole('radio', { name: 'Plats' }))

    expect(router.state.location.search).toBe('?q=tarte&categorie=plats')
    await waitFor(() => {
      expect(backend.lastQuery()).toMatchObject({ categoryId: 'plats' })
    })
    expect(within(column).queryByRole('button', { name: /^Voir/ })).not.toBeInTheDocument()
    await user.click(within(column).getByRole('button', { name: 'Réinitialiser' }))
    expect(router.state.location.search).toBe('?q=tarte')
  })

  it("shows the title of the page and the sort as the browser's own list", async () => {
    installMatchMedia(1280)
    serveBackend()
    const { router } = renderSearch()
    const user = userEvent.setup()
    await screen.findByRole('link', { name: 'Recette 1' })

    expect(screen.getByRole('heading', { level: 1, name: 'Rechercher' })).toBeVisible()
    await user.selectOptions(screen.getByRole('combobox', { name: /Trier/ }), 'title-asc')

    expect(router.state.location.search).toBe('?q=tarte&tri=titre-az')
  })

  it('invites to search when nothing is left to search for, keeping the filters column', async () => {
    installMatchMedia(1280)
    const backend = serveBackend()
    const { openSearch } = renderSearch('/rechercher')

    expect(await screen.findByRole('heading', { name: 'Que veux-tu cuisiner ?' })).toBeVisible()
    expect(screen.getByRole('complementary', { name: 'Filtres' })).toBeVisible()
    expect(screen.queryByRole('combobox', { name: /Trier/ })).not.toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Lancer une recherche' }))

    expect(openSearch).toHaveBeenCalledOnce()
    expect(backend.recipeQueries).toHaveLength(0)
  })

  it('lists again as soon as an ingredient is chosen in the column, by searching it as one types', async () => {
    installMatchMedia(1280)
    const backend = serveBackend()
    const { router } = renderSearch('/rechercher?q=tarte')
    const column = await screen.findByRole('complementary', { name: 'Filtres' })
    const user = userEvent.setup()

    await user.type(
      await within(column).findByRole('combobox', { name: 'Chercher un ingrédient' }),
      'far',
    )
    await user.click(await within(column).findByRole('option', { name: 'Farine' }))

    expect(router.state.location.search).toBe('?q=tarte&ingredient=i-farine')
    expect(await screen.findByRole('button', { name: 'Retirer le filtre Farine' })).toBeVisible()
    await waitFor(() => {
      expect(backend.lastIngredientIds()).toEqual(['i-farine'])
    })
  })

  it('keeps every tag chosen in the column, each written into the address and asked of the API', async () => {
    installMatchMedia(1280)
    const backend = serveBackend()
    const { router } = renderSearch('/rechercher?q=tarte')
    const column = await screen.findByRole('complementary', { name: 'Filtres' })
    const user = userEvent.setup()

    await user.click(await within(column).findByRole('button', { name: 'Fruits' }))
    await user.click(within(column).getByRole('button', { name: 'Four' }))

    expect(router.state.location.search).toBe('?q=tarte&tag=t-fruits&tag=t-four')
    expect(within(column).getByRole('button', { name: 'Fruits' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(column).getByRole('button', { name: 'Four' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await waitFor(() => {
      expect(backend.lastTagIds()).toEqual(['t-fruits', 't-four'])
    })
  })

  it('lists again as soon as a filter of the column is chosen', async () => {
    installMatchMedia(1280)
    const backend = serveBackend()
    renderSearch('/rechercher')
    const column = await screen.findByRole('complementary', { name: 'Filtres' })

    await userEvent.setup().click(await within(column).findByRole('radio', { name: 'Plats' }))

    expect(await screen.findByRole('link', { name: 'Recette 1' })).toBeVisible()
    expect(backend.lastQuery()).toMatchObject({ categoryId: 'plats' })
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

describe('the address of a results page that changes under it', () => {
  afterEach(removeMatchMedia)

  it('follows « back » to a search with nothing to search for, and invites', async () => {
    serveBackend()
    const { router } = renderSearch('/rechercher')
    await screen.findByRole('heading', { name: 'Que veux-tu cuisiner ?' })

    await act(() => router.navigate('/rechercher?q=gratin'))
    expect(await screen.findByRole('link', { name: 'Recette 1' })).toBeVisible()
    await act(() => router.navigate(-1))

    expect(await screen.findByRole('heading', { name: 'Que veux-tu cuisiner ?' })).toBeVisible()
  })
})
