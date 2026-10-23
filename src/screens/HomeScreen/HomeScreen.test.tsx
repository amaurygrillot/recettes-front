import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { API_BASE_URL } from '../../api/apiConfig'
import { sessionStore } from '../../api/sessionStore'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { fakeToken } from '../../test/fakeToken'
import { problemResponse } from '../../test/problem'
import { renderRoutes } from '../../test/renderRoutes'
import { server } from '../../test/server'
import { HomeScreen } from './HomeScreen'

const recipesUrl = `${API_BASE_URL}/recipes`
const categoriesUrl = `${API_BASE_URL}/categories`

const CATEGORIES = [
  { id: 'c-1', name: 'Entrées', categoryType: 'MAIN', parentCategoryId: null },
  { id: 'c-2', name: 'Plats', categoryType: 'MAIN', parentCategoryId: null },
  { id: 'c-3', name: 'Tartes', categoryType: 'SUB', parentCategoryId: 'c-2' },
]

function summary(id: string, extra: object = {}) {
  return {
    id,
    title: `Recette ${id}`,
    categories: [{ id: 'c-2', name: 'Plats', categoryType: 'MAIN' }],
    tags: [{ id: 't-1', name: 'Four' }],
    author: { id: 'u-1', username: 'Odile' },
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    ...extra,
  }
}

function page(number: number, ids: readonly string[], options: { last: boolean; total: number }) {
  return {
    number,
    last: options.last,
    first: number === 0,
    totalElements: options.total,
    content: ids.map((id) => summary(id)),
  }
}

function serveCategories() {
  server.use(http.get(categoriesUrl, () => HttpResponse.json(CATEGORIES)))
}

function serveRecipes(body: object) {
  server.use(http.get(recipesUrl, () => HttpResponse.json(body)))
}

function renderHome() {
  return renderRoutes(
    [
      { path: '/', element: <HomeScreen /> },
      { path: '/rechercher', element: <p>Page de recherche</p> },
      { path: '/recettes/nouvelle', element: <p>Page de création</p> },
      { path: '/recettes/:id', element: <p>Page de la recette</p> },
    ],
    '/',
  )
}

function signInAs(options: Parameters<typeof fakeToken>[0] = {}) {
  expect(sessionStore.signIn(fakeToken(options))).toBe(true)
}

describe('HomeScreen', () => {
  beforeEach(() => {
    serveCategories()
  })

  describe('with recipes', () => {
    beforeEach(() => {
      serveRecipes(page(0, ['1', '2', '3'], { last: true, total: 3 }))
    })

    it('shows the newest recipes as cards, each a link to its page', async () => {
      renderHome()

      const cards = await screen.findAllByRole('link', { name: /^Recette \d$/ })
      expect(cards.map((card) => card.getAttribute('href'))).toEqual([
        '/recettes/1',
        '/recettes/2',
        '/recettes/3',
      ])
      expect(screen.getAllByText('Par Odile · il y a 2 jours')).toHaveLength(3)
    })

    it('asks for the first page of 20, newest first', async () => {
      let query: URLSearchParams | undefined
      server.use(
        http.get(recipesUrl, ({ request }) => {
          query = new URL(request.url).searchParams
          return HttpResponse.json(page(0, ['1'], { last: true, total: 1 }))
        }),
      )
      renderHome()
      await screen.findByRole('link', { name: 'Recette 1' })

      expect(Object.fromEntries(query ?? [])).toEqual({
        sortBy: 'CREATED_AT',
        direction: 'DESC',
        size: '20',
        page: '0',
      })
    })

    it('has one level-1 title for assistive technology, and the feed title under it', async () => {
      renderHome()
      await screen.findByRole('link', { name: 'Recette 1' })

      expect(
        screen.getByRole('heading', { level: 1, name: 'Il en reste un peu' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2, name: 'Fraîchement ajoutées' })).toBeVisible()
      expect(screen.getByText('les dernières recettes de la famille')).toBeVisible()
    })

    it('opens a recipe when its card is touched', async () => {
      const { router } = renderHome()

      await userEvent.setup().click(await screen.findByRole('link', { name: 'Recette 2' }))

      expect(router.state.location.pathname).toBe('/recettes/2')
    })

    it('offers the logo and a fake search field that open the search page', async () => {
      const user = userEvent.setup()
      const { router } = renderHome()
      await screen.findByRole('link', { name: 'Recette 1' })

      expect(screen.getByRole('link', { name: /retour à l'accueil/ })).toHaveAttribute('href', '/')
      await user.click(
        screen.getByRole('link', { name: 'Chercher une recette : ouvrir la recherche' }),
      )

      expect(router.state.location.pathname).toBe('/rechercher')
      expect(router.state.location.search).toBe('')
    })

    it('shows « Toutes » and the main categories, each opening the search on its category', async () => {
      const user = userEvent.setup()
      const { router } = renderHome()

      const tiles = await screen.findByRole('list', { name: 'Catégories' })
      expect(
        within(tiles)
          .getAllByRole('link')
          .map((link) => link.textContent),
      ).toEqual(['Toutes', 'Entrées', 'Plats'])

      await user.click(within(tiles).getByRole('link', { name: 'Plats' }))

      expect(router.state.location.pathname).toBe('/rechercher')
      expect(router.state.location.search).toBe('?categorie=c-2')
    })

    it('says that it has shown everything, when there is nothing more to load', async () => {
      renderHome()

      expect(await screen.findByText('Tu as tout vu : 3 recettes.')).toBeVisible()
      expect(
        screen.queryByRole('button', { name: 'Voir plus de recettes' }),
      ).not.toBeInTheDocument()
    })

    it('has no accessibility violation', async () => {
      const { container } = renderHome()
      await screen.findByRole('link', { name: 'Recette 1' })

      await expectNoAccessibilityViolations(container)
    })
  })

  describe('for a visitor and for a member', () => {
    beforeEach(() => {
      serveRecipes(page(0, ['1'], { last: true, total: 1 }))
    })

    it('shows a visitor the same feed, with no invitation to log in and no way to create', async () => {
      renderHome()
      await screen.findByRole('link', { name: 'Recette 1' })

      expect(screen.queryByRole('link', { name: 'Nouvelle recette' })).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /connecter|compte/i })).not.toBeInTheDocument()
    })

    it('shows a member « Nouvelle recette » beside the feed title, for a desktop', async () => {
      signInAs()
      renderHome()
      await screen.findByRole('link', { name: 'Recette 1' })

      expect(screen.getByRole('link', { name: 'Nouvelle recette' })).toHaveAttribute(
        'href',
        '/recettes/nouvelle',
      )
    })

    it('shows no way to create to a member who may not write recipes', async () => {
      signInAs({ roles: [] })
      renderHome()
      await screen.findByRole('link', { name: 'Recette 1' })

      expect(screen.queryByRole('link', { name: 'Nouvelle recette' })).not.toBeInTheDocument()
    })
  })

  describe('while loading', () => {
    beforeEach(() => {
      server.use(
        http.get(recipesUrl, async () => {
          await delay('infinite')
          return HttpResponse.json({})
        }),
      )
    })

    it('keeps the logo, the search field and the title, and announces the wait for the list', async () => {
      renderHome()

      expect(await screen.findByText('Chargement des recettes…')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2, name: 'Fraîchement ajoutées' })).toBeVisible()
      expect(screen.getByRole('link', { name: /ouvrir la recherche/ })).toBeVisible()
    })

    it('shows the tiles as soon as the categories are there, whatever the feed does', async () => {
      renderHome()

      expect(await screen.findByRole('link', { name: 'Plats' })).toBeVisible()
    })
  })

  describe('with no recipe at all', () => {
    beforeEach(() => {
      serveRecipes(page(0, [], { last: true, total: 0 }))
    })

    it('welcomes a visitor and offers to refresh, with no way to create', async () => {
      renderHome()

      expect(
        await screen.findByRole('heading', { name: 'Bienvenue dans la cuisine de la famille' }),
      ).toBeVisible()
      expect(screen.getByText(/Les premières recettes arrivent bientôt/)).toBeVisible()
      expect(screen.queryByRole('link', { name: 'Créer une recette' })).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: 'Nouvelle recette' })).not.toBeInTheDocument()
    })

    it('shows the recipes that arrived when the visitor refreshes', async () => {
      const user = userEvent.setup()
      renderHome()
      await user.click(await screen.findByRole('button', { name: 'Actualiser' }))

      serveRecipes(page(0, ['9'], { last: true, total: 1 }))
      await user.click(screen.getByRole('button', { name: 'Actualiser' }))

      expect(await screen.findByRole('link', { name: 'Recette 9' })).toBeVisible()
    })

    it('shows that it is refreshing, keeping the button where it is', async () => {
      const user = userEvent.setup()
      renderHome()
      const refresh = await screen.findByRole('button', { name: 'Actualiser' })
      server.use(
        http.get(recipesUrl, async () => {
          await delay('infinite')
          return HttpResponse.json({})
        }),
      )

      await user.click(refresh)

      const busy = await screen.findByRole('button', { name: 'Actualisation…' })
      expect(busy).toHaveAttribute('aria-busy', 'true')
      expect(busy).toHaveFocus()
    })

    it('invites a member to write the first recipe, and says it only once', async () => {
      signInAs()
      const { router } = renderHome()

      expect(
        await screen.findByRole('heading', { name: 'Ton carnet attend sa première recette' }),
      ).toBeVisible()
      await userEvent.setup().click(screen.getByRole('link', { name: 'Créer une recette' }))

      expect(router.state.location.pathname).toBe('/recettes/nouvelle')
    })

    it('has no accessibility violation, for a visitor and for a member', async () => {
      const visitor = renderHome()
      await screen.findByRole('heading', { name: 'Bienvenue dans la cuisine de la famille' })
      await expectNoAccessibilityViolations(visitor.container)
      visitor.unmount()

      signInAs()
      const member = renderHome()
      await screen.findByRole('heading', { name: 'Ton carnet attend sa première recette' })
      await expectNoAccessibilityViolations(member.container)
    })
  })

  describe('when the feed cannot be loaded', () => {
    it('says there is no connection when the back end cannot be reached, and tries again on demand', async () => {
      server.use(http.get(recipesUrl, () => HttpResponse.error()))
      const user = userEvent.setup()
      renderHome()

      const alert = await screen.findByRole('alert')
      expect(
        within(alert).getByRole('heading', { name: 'Pas de connexion pour le moment' }),
      ).toBeVisible()
      expect(alert).toHaveTextContent('Vérifie ta connexion internet, puis réessaie.')

      serveRecipes(page(0, ['1'], { last: true, total: 1 }))
      await user.click(within(alert).getByRole('button', { name: 'Réessayer' }))

      expect(await screen.findByRole('link', { name: 'Recette 1' })).toBeVisible()
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it.each([
      [400, {}, 'Certaines informations ne sont pas valides. Vérifie ta saisie, puis réessaie.'],
      [401, {}, 'Connecte-toi pour continuer.'],
      [403, {}, "Tu n'as pas le droit de faire cette action."],
      [404, {}, "Cet élément n'existe pas ou a été supprimé."],
      [429, { 'Retry-After': '12' }, 'Tu vas un peu vite. Réessaie dans 12 secondes.'],
      [500, {}, 'Le serveur a rencontré un problème. Réessaie dans un moment.'],
      [503, { 'Retry-After': '30' }, 'Le serveur est très sollicité. Réessaie dans 30 secondes.'],
      [503, {}, 'Le serveur est très sollicité. Réessaie dans un instant.'],
      [418, {}, "Quelque chose s'est mal passé. Réessaie."],
    ])('answers a %i with the sentence of its cause (%j)', async (status, headers, sentence) => {
      server.use(http.get(recipesUrl, () => problemResponse(status, 'detail', headers)))
      renderHome()

      const alert = await screen.findByRole('alert')
      expect(
        within(alert).getByRole('heading', { name: 'Impossible de charger les recettes' }),
      ).toBeVisible()
      expect(alert).toHaveTextContent(sentence)
      expect(within(alert).getByRole('button', { name: 'Réessayer' })).toBeEnabled()
    })

    it('keeps the tiles and the title usable', async () => {
      server.use(http.get(recipesUrl, () => problemResponse(500)))
      renderHome()
      await screen.findByRole('alert')

      expect(screen.getByRole('link', { name: 'Plats' })).toBeVisible()
      expect(screen.getByRole('heading', { level: 2, name: 'Fraîchement ajoutées' })).toBeVisible()
    })

    it('has no accessibility violation', async () => {
      server.use(http.get(recipesUrl, () => HttpResponse.error()))
      const { container } = renderHome()
      await screen.findByRole('alert')

      await expectNoAccessibilityViolations(container)
    })
  })

  describe('when the categories cannot be loaded', () => {
    it.each([
      ['the back end cannot be reached', () => HttpResponse.error()],
      ['it answers with an error', () => problemResponse(500)],
    ])('still shows the feed, with « Toutes » alone, when %s', async (_why, answer) => {
      serveRecipes(page(0, ['1'], { last: true, total: 1 }))
      server.use(http.get(categoriesUrl, answer))
      renderHome()

      expect(await screen.findByRole('link', { name: 'Recette 1' })).toBeVisible()
      const tiles = screen.getByRole('list', { name: 'Catégories' })
      expect(
        within(tiles)
          .getAllByRole('link')
          .map((link) => link.textContent),
      ).toEqual(['Toutes'])
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('« Voir plus de recettes »', () => {
    const FIRST_PAGE = page(0, ['1', '2'], { last: false, total: 5 })

    function servePages(
      second: (request: Request) => Response | Promise<Response> = () =>
        HttpResponse.json(page(1, ['3', '4', '5'], { last: true, total: 5 })),
    ) {
      server.use(
        http.get(recipesUrl, ({ request }) =>
          new URL(request.url).searchParams.get('page') === '0'
            ? HttpResponse.json(FIRST_PAGE)
            : second(request),
        ),
      )
    }

    it('counts what is shown and offers the next page, without loading it by itself', async () => {
      servePages()
      renderHome()

      expect(await screen.findByText('2 sur 5 recettes')).toBeVisible()
      expect(screen.getByRole('button', { name: 'Voir plus de recettes' })).toBeVisible()
      expect(screen.queryByRole('link', { name: 'Recette 3' })).not.toBeInTheDocument()
    })

    it('adds the next recipes under the others, announces them, and ends with a sentence', async () => {
      let requestedPage: string | null = null
      servePages(({ url }) => {
        requestedPage = new URL(url).searchParams.get('page')
        return HttpResponse.json(page(1, ['3', '4', '5'], { last: true, total: 5 }))
      })
      const user = userEvent.setup()
      renderHome()

      await user.click(await screen.findByRole('button', { name: 'Voir plus de recettes' }))

      expect(await screen.findByText('Tu as tout vu : 5 recettes.')).toHaveFocus()
      expect(requestedPage).toBe('1')
      const hrefs = screen
        .getAllByRole('link', { name: /^Recette \d$/ })
        .map((link) => link.getAttribute('href'))
      expect(hrefs).toEqual([
        '/recettes/1',
        '/recettes/2',
        '/recettes/3',
        '/recettes/4',
        '/recettes/5',
      ])
      expect(
        screen.getByText('3 recettes de plus chargées', { selector: '[role=status]' }),
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Voir plus de recettes' }),
      ).not.toBeInTheDocument()
    })

    it('lists a recipe once when a new one pushed it onto the next page', async () => {
      servePages(() => HttpResponse.json(page(1, ['2', '3'], { last: true, total: 6 })))
      const user = userEvent.setup()
      renderHome()

      await user.click(await screen.findByRole('button', { name: 'Voir plus de recettes' }))
      await screen.findByRole('link', { name: 'Recette 3' })

      expect(screen.getAllByRole('link', { name: 'Recette 2' })).toHaveLength(1)
    })

    it('keeps the button where it is while loading, with its focus, and says how many are coming', async () => {
      servePages(async () => {
        await delay('infinite')
        return HttpResponse.json({})
      })
      const user = userEvent.setup()
      renderHome()
      await user.click(await screen.findByRole('button', { name: 'Voir plus de recettes' }))

      const busy = await screen.findByRole('button', { name: 'Chargement…' })
      expect(busy).toHaveAttribute('aria-busy', 'true')
      expect(busy).toHaveFocus()
      expect(screen.getAllByText('Chargement de 3 recettes de plus…')).not.toHaveLength(0)
      expect(screen.getByRole('link', { name: 'Recette 1' })).toBeVisible()
    })

    it('does not ask twice when the busy button is pressed again', async () => {
      let requests = 0
      servePages(async () => {
        requests += 1
        await delay('infinite')
        return HttpResponse.json({})
      })
      const user = userEvent.setup()
      renderHome()
      await user.click(await screen.findByRole('button', { name: 'Voir plus de recettes' }))
      const busy = await screen.findByRole('button', { name: 'Chargement…' })

      await user.click(busy)
      await user.keyboard('{Enter}')

      expect(requests).toBe(1)
    })

    it('keeps the recipes already there, says what went wrong, and loads the page on a second try', async () => {
      let answers = 0
      servePages(() => {
        answers += 1
        return answers === 1
          ? problemResponse(503, 'busy', { 'Retry-After': '30' })
          : HttpResponse.json(page(1, ['3', '4', '5'], { last: true, total: 5 }))
      })
      const user = userEvent.setup()
      renderHome()
      await user.click(await screen.findByRole('button', { name: 'Voir plus de recettes' }))

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Le serveur est très sollicité. Réessaie dans 30 secondes.')
      expect(screen.getByRole('link', { name: 'Recette 2' })).toBeVisible()
      expect(screen.getByText('2 sur 5 recettes')).toBeVisible()

      await user.click(screen.getByRole('button', { name: 'Réessayer' }))

      expect(await screen.findByRole('link', { name: 'Recette 5' })).toBeVisible()
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('says « Impossible de charger la suite. » when the network is the cause', async () => {
      servePages(() => HttpResponse.error())
      const user = userEvent.setup()
      renderHome()
      await user.click(await screen.findByRole('button', { name: 'Voir plus de recettes' }))

      expect(await screen.findByRole('alert')).toHaveTextContent('Impossible de charger la suite.')
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Réessayer' })).toHaveFocus()
      })
    })

    it('has no accessibility violation while there is more, while it loads and when it failed', async () => {
      servePages(() => HttpResponse.error())
      const user = userEvent.setup()
      const { container } = renderHome()
      await user.click(await screen.findByRole('button', { name: 'Voir plus de recettes' }))
      await screen.findByRole('alert')

      await expectNoAccessibilityViolations(container)
    })
  })
})
