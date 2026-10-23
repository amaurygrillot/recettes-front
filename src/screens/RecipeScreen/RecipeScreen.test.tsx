import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'
import { API_BASE_URL } from '../../api/apiConfig'
import { sessionStore } from '../../api/sessionStore'
import { saveCookingStep } from '../../app/cookingProgress'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { fakeToken } from '../../test/fakeToken'
import { installMatchMedia, removeMatchMedia } from '../../test/matchMedia'
import { problemResponse } from '../../test/problem'
import { renderRoutes } from '../../test/renderRoutes'
import { server } from '../../test/server'
import { RecipeScreen } from './RecipeScreen'

const recipeUrl = `${API_BASE_URL}/recipes/r-1`

const RECIPE = {
  id: 'r-1',
  title: 'Tarte fine aux pommes',
  introduction: { id: 'i', text: '<p>La tarte de tous les dimanches chez nous.</p>' },
  recommendations: '<p>Prépare la pâte la veille.</p>',
  author: { id: 'u-hugo', username: 'Hugo' },
  categories: [{ id: 'c-1', name: 'Dessert', categoryType: 'MAIN' }],
  tags: [
    { id: 't-1', name: 'Fruits' },
    { id: 't-2', name: 'Rapide' },
  ],
  coverPictures: [
    { mediaId: 'm-1', altText: null },
    { mediaId: 'm-2', altText: null },
  ],
  ingredientGroups: [
    {
      title: 'Pour la pâte',
      ingredients: [
        {
          ingredient: { id: 'a', name: 'farine' },
          quantity: 250,
          unit: { id: 'g', name: 'gramme', abbreviation: 'g' },
        },
        {
          ingredient: { id: 'b', name: 'beurre froid' },
          quantity: 125,
          unit: { id: 'g', name: 'gramme', abbreviation: 'g' },
          note: 'coupé en dés',
        },
        { ingredient: { id: 'c', name: 'sel' }, note: 'selon le goût' },
      ],
    },
    {
      title: 'Pour la garniture',
      ingredients: [{ ingredient: { id: 'd', name: 'pommes' }, quantity: 4, note: 'type golden' }],
    },
  ],
  steps: [
    { instruction: '<p>Préchauffe le four à 200 °C.</p>' },
    {
      instruction: '<p>Ajoute l&apos;œuf puis forme une boule.</p>',
      pictures: [{ mediaId: 'm-3', altText: 'La boule de pâte' }],
    },
    {
      instruction: '<p>Épluche les pommes.</p>',
      pictures: [
        { mediaId: 'm-4', altText: null },
        { mediaId: 'm-5', altText: null },
      ],
    },
  ],
  createdAt: '2026-10-12T12:00:00Z',
  updatedAt: '2026-10-18T12:00:00Z',
}

function serveRecipe(recipe: object = RECIPE) {
  server.use(http.get(recipeUrl, () => HttpResponse.json(recipe)))
}

function signInAs(options: Parameters<typeof fakeToken>[0] = {}) {
  expect(sessionStore.signIn(fakeToken(options))).toBe(true)
}

function renderRecipe() {
  return renderRoutes(
    [
      { path: '/recettes/:id', element: <RecipeScreen /> },
      { path: '/recettes/:id/modifier', element: <p>Page de modification</p> },
      { path: '/recettes/:id/pas-a-pas', element: <p>Page du pas à pas</p> },
      { path: '/rechercher', element: <p>Page de recherche</p> },
      { path: '/', element: <p>Page d’accueil</p> },
    ],
    '/recettes/r-1',
  )
}

describe('RecipeScreen', () => {
  afterEach(() => {
    removeMatchMedia()
    window.localStorage.clear()
  })

  describe('the recipe', () => {
    it('shows its title, categories, tags, author and the day it was added', async () => {
      serveRecipe()
      renderRecipe()

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Tarte fine aux pommes' }),
      ).toBeVisible()
      expect(screen.getByText('Dessert')).toBeVisible()
      expect(screen.getByText('Fruits')).toBeVisible()
      expect(screen.getByText('Rapide')).toBeVisible()
      expect(screen.getByText('Hugo')).toBeVisible()
      expect(screen.getByText(/ajoutée le 12 octobre 2026/)).toBeVisible()
      expect(screen.getByText('modifiée le 18 octobre 2026')).toBeVisible()
    })

    it('shows the introduction', async () => {
      serveRecipe()
      renderRecipe()

      expect(await screen.findByText('La tarte de tous les dimanches chez nous.')).toBeVisible()
    })

    it('shows the ingredients in their groups, the quantity in bold, the notes quieter', async () => {
      serveRecipe()
      renderRecipe()

      expect(
        await screen.findByRole('heading', { level: 2, name: 'Les ingrédients' }),
      ).toBeVisible()
      expect(screen.getByRole('heading', { level: 3, name: 'Pour la pâte' })).toBeVisible()
      expect(screen.getByRole('heading', { level: 3, name: 'Pour la garniture' })).toBeVisible()
      const lines = screen.getAllByRole('listitem').map((item) => item.textContent.trim())
      expect(lines).toContain('250 g de farine')
      expect(lines).toContain('125 g de beurre froid coupé en dés')
      expect(lines).toContain('sel selon le goût')
      expect(lines).toContain('4 pommes type golden')
      expect(screen.getByText('250').tagName).toBe('B')
    })

    it('shows the steps in order, each announced by its number', async () => {
      serveRecipe()
      renderRecipe()

      await screen.findByRole('heading', { level: 2, name: 'La préparation' })

      expect(
        screen
          .getAllByRole('heading', { level: 3, name: /^Étape \d$/ })
          .map((heading) => heading.textContent),
      ).toEqual(['Étape 1', 'Étape 2', 'Étape 3'])
      expect(screen.getByText('Préchauffe le four à 200 °C.')).toBeVisible()
    })

    it("shows the cook's tip in its own frame, and leaves the frame out without a tip", async () => {
      serveRecipe()
      const { unmount } = renderRecipe()
      expect(
        await screen.findByRole('complementary', { name: 'Le conseil de la cuisinière' }),
      ).toHaveTextContent('Prépare la pâte la veille.')
      unmount()

      serveRecipe({ ...RECIPE, recommendations: null })
      renderRecipe()
      await screen.findByRole('heading', { level: 1 })

      expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    })

    it('says there are no steps yet, and offers no way to cook, for a recipe without steps', async () => {
      serveRecipe({ ...RECIPE, steps: [] })
      renderRecipe()

      expect(await screen.findByRole('heading', { name: "Pas encore d'étapes" })).toBeVisible()
      expect(screen.queryByRole('link', { name: 'Cuisiner pas à pas' })).not.toBeInTheDocument()
    })

    it('shows no introduction line when there is none', async () => {
      serveRecipe({ ...RECIPE, introduction: undefined })
      renderRecipe()

      await screen.findByRole('heading', { level: 1 })

      expect(
        screen.queryByText('La tarte de tous les dimanches chez nous.'),
      ).not.toBeInTheDocument()
    })

    it('does not show what the library does not have: no rating, time or servings', async () => {
      serveRecipe()
      const { container } = renderRecipe()
      await screen.findByRole('heading', { level: 1 })

      expect(container).not.toHaveTextContent(
        /portion|personnes|difficulté|note|temps de préparation|favori/i,
      )
    })

    it('has no accessibility violation', async () => {
      serveRecipe()
      const { container } = renderRecipe()
      await screen.findByRole('heading', { level: 1 })

      await expectNoAccessibilityViolations(container)
    })
  })

  describe('the photos', () => {
    it('shows the photos of the recipe in a carousel, with the first one in front', async () => {
      serveRecipe()
      renderRecipe()

      const gallery = await screen.findByRole('group', { name: 'Photos de la recette' })

      expect(within(gallery).getByText('1 / 2')).toBeVisible()
      expect(within(gallery).getByRole('button', { name: 'Photo suivante' })).toBeVisible()
    })

    it('shows the butter stand-in for a recipe without photos', async () => {
      serveRecipe({ ...RECIPE, coverPictures: [] })
      renderRecipe()

      const gallery = await screen.findByRole('group', { name: 'Photos de la recette' })

      expect(within(gallery).queryByRole('img')).not.toBeInTheDocument()
      expect(within(gallery).queryByText(/\//)).not.toBeInTheDocument()
    })

    it('opens a step photo at the size of the screen, and closes it', async () => {
      serveRecipe()
      renderRecipe()
      const user = userEvent.setup()

      await user.click(await screen.findByRole('button', { name: 'Agrandir la photo' }))
      const viewer = await screen.findByRole('dialog', { name: 'Photo 1 sur 1' })
      expect(within(viewer).getByRole('img', { name: 'La boule de pâte' })).toBeVisible()
      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('opens the one that was touched among several, and moves between them', async () => {
      serveRecipe()
      renderRecipe()
      const user = userEvent.setup()

      await user.click(await screen.findByRole('button', { name: 'Agrandir la photo 2 sur 2' }))
      const viewer = await screen.findByRole('dialog', { name: 'Photo 2 sur 2' })
      await user.click(within(viewer).getByRole('button', { name: 'Photo suivante' }))

      expect(await screen.findByRole('dialog', { name: 'Photo 1 sur 2' })).toBeVisible()
    })
  })

  describe('cooking step by step', () => {
    it('offers « Cuisiner pas à pas », a link to the cooking page', async () => {
      serveRecipe()
      const { router } = renderRecipe()

      await userEvent.setup().click(await screen.findByRole('link', { name: 'Cuisiner pas à pas' }))

      expect(router.state.location.pathname).toBe('/recettes/r-1/pas-a-pas')
    })

    it('offers to resume where this device left the recipe', async () => {
      saveCookingStep('r-1', 2)
      serveRecipe()
      renderRecipe()

      expect(await screen.findByRole('link', { name: "Reprendre à l'étape 2" })).toHaveAttribute(
        'href',
        '/recettes/r-1/pas-a-pas',
      )
      expect(screen.queryByRole('link', { name: 'Cuisiner pas à pas' })).not.toBeInTheDocument()
    })

    it('starts over when the step kept is beyond the steps the recipe has now', async () => {
      saveCookingStep('r-1', 9)
      serveRecipe()
      renderRecipe()

      expect(await screen.findByRole('link', { name: 'Cuisiner pas à pas' })).toBeVisible()
    })
  })

  describe('for whoever is looking', () => {
    it('offers nothing to change to a visitor', async () => {
      serveRecipe()
      renderRecipe()
      await screen.findByRole('heading', { level: 1 })

      expect(
        screen.queryByRole('button', { name: 'Actions sur la recette' }),
      ).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: 'Modifier' })).not.toBeInTheDocument()
    })

    it('offers nothing to a member who is not the author', async () => {
      signInAs({ userId: 'u-other' })
      serveRecipe()
      renderRecipe()
      await screen.findByRole('heading', { level: 1 })

      expect(
        screen.queryByRole('button', { name: 'Actions sur la recette' }),
      ).not.toBeInTheDocument()
    })

    it.each([
      ['the author', { userId: 'u-hugo' }],
      ['an administrator', { userId: 'u-other', roles: ['USER', 'ADMIN'] }],
    ])(
      'gives %s a menu with « Modifier » and « Supprimer » over the photo',
      async (_who, token) => {
        signInAs(token)
        serveRecipe()
        renderRecipe()
        const user = userEvent.setup()

        await user.click(await screen.findByRole('button', { name: 'Actions sur la recette' }))

        expect(await screen.findByRole('menuitem', { name: 'Modifier' })).toHaveAttribute(
          'href',
          '/recettes/r-1/modifier',
        )
        expect(screen.getByRole('menuitem', { name: 'Supprimer' })).toBeVisible()
      },
    )

    it('shows the author two buttons beside the title on a desktop, and no menu', async () => {
      installMatchMedia(1280)
      signInAs({ userId: 'u-hugo' })
      serveRecipe()
      renderRecipe()

      expect(await screen.findByRole('link', { name: 'Modifier' })).toHaveAttribute(
        'href',
        '/recettes/r-1/modifier',
      )
      expect(screen.getByRole('button', { name: 'Supprimer' })).toBeVisible()
      expect(
        screen.queryByRole('button', { name: 'Actions sur la recette' }),
      ).not.toBeInTheDocument()
    })
  })

  describe('deleting', () => {
    async function askToDelete() {
      signInAs({ userId: 'u-hugo' })
      const user = userEvent.setup()
      await user.click(await screen.findByRole('button', { name: 'Actions sur la recette' }))
      await user.click(await screen.findByRole('menuitem', { name: 'Supprimer' }))
      return {
        user,
        dialog: await screen.findByRole('alertdialog', { name: 'Supprimer cette recette ?' }),
      }
    }

    it('asks first, naming the recipe, with « Annuler » in focus', async () => {
      serveRecipe()
      renderRecipe()

      const { dialog } = await askToDelete()

      expect(
        within(dialog).getByText(/« Tarte fine aux pommes » sera supprimée pour toujours/),
      ).toBeVisible()
      expect(within(dialog).getByRole('button', { name: 'Annuler' })).toHaveFocus()
    })

    it('deletes nothing when the question is answered « Annuler »', async () => {
      let deleted = false
      serveRecipe()
      server.use(
        http.delete(recipeUrl, () => {
          deleted = true
          return new HttpResponse(null, { status: 204 })
        }),
      )
      renderRecipe()
      const { user, dialog } = await askToDelete()

      await user.click(within(dialog).getByRole('button', { name: 'Annuler' }))

      await waitFor(() => {
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
      })
      expect(deleted).toBe(false)
    })

    it('deletes the recipe once confirmed and leaves for the search', async () => {
      serveRecipe()
      server.use(http.delete(recipeUrl, () => new HttpResponse(null, { status: 204 })))
      const { router } = renderRecipe()
      const { user, dialog } = await askToDelete()

      await user.click(within(dialog).getByRole('button', { name: 'Supprimer la recette' }))

      await waitFor(() => {
        expect(router.state.location.pathname).toBe('/rechercher')
      })
    })

    it('keeps the question up, busy, while the request is on its way', async () => {
      serveRecipe()
      server.use(
        http.delete(recipeUrl, async () => {
          await delay('infinite')
          return new HttpResponse(null, { status: 204 })
        }),
      )
      renderRecipe()
      const { user, dialog } = await askToDelete()

      await user.click(within(dialog).getByRole('button', { name: 'Supprimer la recette' }))

      expect(screen.getByRole('alertdialog')).toBeVisible()
      expect(within(dialog).getByRole('button', { name: /Supprimer la recette/ })).toHaveAttribute(
        'aria-busy',
        'true',
      )
      expect(within(dialog).getByRole('button', { name: 'Annuler' })).toBeDisabled()
    })

    it('counts a recipe that is already gone as deleted', async () => {
      serveRecipe()
      server.use(http.delete(recipeUrl, () => problemResponse(404)))
      const { router } = renderRecipe()
      const { user, dialog } = await askToDelete()

      await user.click(within(dialog).getByRole('button', { name: 'Supprimer la recette' }))

      await waitFor(() => {
        expect(router.state.location.pathname).toBe('/rechercher')
      })
    })

    it('says deleting was impossible, keeps the page, and tries again on demand', async () => {
      let answers = 0
      serveRecipe()
      server.use(
        http.delete(recipeUrl, () => {
          answers += 1
          return answers === 1 ? problemResponse(500) : new HttpResponse(null, { status: 204 })
        }),
      )
      const { router } = renderRecipe()
      const { user, dialog } = await askToDelete()

      await user.click(within(dialog).getByRole('button', { name: 'Supprimer la recette' }))

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Suppression impossible.')
      expect(alert).toHaveTextContent('Le serveur a rencontré un problème.')
      expect(screen.getByRole('heading', { level: 1, name: 'Tarte fine aux pommes' })).toBeVisible()
      await user.click(within(alert).getByRole('button', { name: 'Réessayer' }))

      await waitFor(() => {
        expect(router.state.location.pathname).toBe('/rechercher')
      })
    })

    it('says so when the author is no longer allowed to delete (403)', async () => {
      serveRecipe()
      server.use(http.delete(recipeUrl, () => problemResponse(403)))
      renderRecipe()
      const { user, dialog } = await askToDelete()

      await user.click(within(dialog).getByRole('button', { name: 'Supprimer la recette' }))

      expect(await screen.findByRole('alert')).toHaveTextContent(
        "Tu n'as pas le droit de faire cette action.",
      )
    })
  })

  describe('the states', () => {
    it('shows a skeleton of the page while it loads, announced once', async () => {
      server.use(
        http.get(recipeUrl, async () => {
          await delay('infinite')
          return HttpResponse.json({})
        }),
      )
      renderRecipe()

      expect(await screen.findByText('Chargement de la recette…')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Retour aux recettes' })).toBeEnabled()
    })

    it('says the recipe does not exist, and offers the way back to the recipes', async () => {
      server.use(http.get(recipeUrl, () => problemResponse(404)))
      renderRecipe()

      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: "Cette recette n'existe pas ou a été supprimée",
        }),
      ).toBeVisible()
      expect(screen.getByRole('link', { name: 'Retour aux recettes' })).toHaveAttribute(
        'href',
        '/rechercher',
      )
    })

    it('says there is no connection, and tries again on demand', async () => {
      let up = false
      server.use(http.get(recipeUrl, () => (up ? HttpResponse.json(RECIPE) : HttpResponse.error())))
      renderRecipe()
      const user = userEvent.setup()

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Pas de connexion pour le moment' }),
      ).toBeVisible()
      up = true
      await user.click(screen.getByRole('button', { name: 'Réessayer' }))

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Tarte fine aux pommes' }),
      ).toBeVisible()
    })

    it.each([
      [400, {}, 'Certaines informations ne sont pas valides. Vérifie ta saisie, puis réessaie.'],
      [500, {}, 'Le serveur a rencontré un problème. Réessaie dans un moment.'],
      [503, { 'Retry-After': '30' }, 'Le serveur est très sollicité. Réessaie dans 30 secondes.'],
    ])('answers a %i with the sentence of its cause', async (status, headers, sentence) => {
      server.use(http.get(recipeUrl, () => problemResponse(status, 'detail', headers)))
      renderRecipe()

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Impossible de charger cette recette')
      expect(alert).toHaveTextContent(sentence)
    })

    it('shows an error for a recipe the API answers without an id or a title', async () => {
      serveRecipe({ steps: [] })
      renderRecipe()

      expect(await screen.findByRole('alert')).toHaveTextContent(
        "Quelque chose s'est mal passé. Réessaie.",
      )
    })

    it('has no accessibility violation for a missing recipe or a failure', async () => {
      server.use(http.get(recipeUrl, () => problemResponse(404)))
      const missing = renderRecipe()
      await screen.findByRole('heading', { level: 1 })
      await expectNoAccessibilityViolations(missing.container)
      missing.unmount()

      server.use(http.get(recipeUrl, () => HttpResponse.error()))
      const failed = renderRecipe()
      await screen.findByRole('alert')
      await expectNoAccessibilityViolations(failed.container)
    })
  })

  describe('the way back', () => {
    it('goes to the search when the recipe is the first page of the visit', async () => {
      serveRecipe()
      const { router } = renderRecipe()
      // The button of the skeleton is replaced by the one over the photo: wait for the page.
      await screen.findByRole('heading', { level: 1 })

      await userEvent.setup().click(screen.getByRole('button', { name: 'Retour aux recettes' }))

      await waitFor(() => {
        expect(router.state.location.pathname).toBe('/rechercher')
      })
    })

    it('goes back to the page the visitor came from', async () => {
      serveRecipe()
      const { router } = renderRecipe()
      await screen.findByRole('heading', { level: 1 })
      await router.navigate('/')
      await router.navigate('/recettes/r-1')
      const user = userEvent.setup()

      await user.click(await screen.findByRole('button', { name: 'Retour aux recettes' }))

      expect(router.state.location.pathname).toBe('/')
    })
  })
})
