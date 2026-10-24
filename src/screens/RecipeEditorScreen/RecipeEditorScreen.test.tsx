import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { sessionStore } from '../../api/sessionStore'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { installMatchMedia, removeMatchMedia } from '../../test/matchMedia'
import { problemResponse } from '../../test/problem'
import { server } from '../../test/server'
import {
  API,
  findForm,
  renderEditor,
  signInAsMember,
  storedRecipe,
  useEditorBackend,
} from './editor.testkit'

describe('RecipeEditorScreen', () => {
  beforeEach(() => {
    installMatchMedia(390)
    signInAsMember()
  })

  afterEach(() => {
    removeMatchMedia()
    window.localStorage.clear()
  })

  describe('a new recipe', () => {
    it('opens on a blank form with the five sections, and the places for an ingredient and a step', async () => {
      useEditorBackend()
      renderEditor('/recettes/nouvelle')

      await findForm()

      expect(screen.getByRole('heading', { level: 1, name: 'Nouvelle recette' })).toBeVisible()
      expect(
        screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent),
      ).toEqual([
        '1Informations',
        '2Photos de couverture',
        '3Ingrédients',
        '4Étapes',
        '5Recommandations',
      ])
      expect(screen.getByLabelText('Titre')).toHaveValue('')
      expect(screen.getByRole('group', { name: 'Ingrédient 1' })).toBeVisible()
      expect(screen.getByRole('article', { name: 'Étape 1' })).toBeVisible()
      expect(screen.queryByRole('button', { name: 'Supprimer la recette' })).not.toBeInTheDocument()
    })

    it('waits for its vocabulary, then opens', async () => {
      useEditorBackend()
      server.use(
        http.get(`${API}/tags`, async () => {
          await delay(80)
          return HttpResponse.json([])
        }),
      )
      renderEditor('/recettes/nouvelle')

      expect(screen.queryByRole('heading', { name: 'Informations' })).not.toBeInTheDocument()
      await findForm()
    })

    it('says that the choices could not be loaded, and tries again', async () => {
      useEditorBackend()
      server.use(http.get(`${API}/units`, () => problemResponse(500)))
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')

      expect(await screen.findByRole('alert')).toHaveTextContent('Impossible d’ouvrir l’éditeur')
      server.use(http.get(`${API}/units`, () => HttpResponse.json([])))
      await user.click(screen.getByRole('button', { name: 'Réessayer' }))

      await findForm()
    })

    it('has no accessibility violation', async () => {
      useEditorBackend()
      const { container } = renderEditor('/recettes/nouvelle')
      await findForm()

      await expectNoAccessibilityViolations(container)
    })
  })

  describe('an existing recipe', () => {
    it('opens with what it holds in every section', async () => {
      useEditorBackend()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      expect(screen.getByRole('heading', { level: 1, name: 'Modifier la recette' })).toBeVisible()
      expect(screen.getByLabelText('Titre')).toHaveValue('Tarte fine aux pommes')
      expect(screen.getByRole('textbox', { name: /^Introduction/ })).toHaveTextContent(
        'La tarte de tous les dimanches.',
      )
      expect(
        screen.getByRole('button', { name: 'Retirer la catégorie Desserts › Tartes' }),
      ).toBeVisible()
      expect(screen.getByRole('button', { name: 'Retirer le tag Fruits' })).toBeVisible()
      expect(screen.getByRole('group', { name: 'Photo 1 sur 2' })).toBeVisible()
      expect(screen.getAllByLabelText(/^Texte alternatif/)[0]).toHaveValue('La tarte entière')
      expect(screen.getByRole('group', { name: 'Groupe Pour la pâte' })).toBeVisible()
      expect(
        screen
          .getAllByRole('combobox', { name: 'Ingrédient' })
          .map((field) => (field instanceof HTMLInputElement ? field.value : '')),
      ).toEqual(['farine de blé', 'beurre'])
      expect(screen.getByRole('article', { name: 'Étape 1' })).toHaveTextContent('Mélange tout.')
      expect(screen.getByRole('article', { name: 'Étape 2' })).toHaveTextContent('Fais cuire.')
      expect(screen.getByRole('textbox', { name: /^le petit conseil/ })).toHaveTextContent(
        'Prépare la pâte la veille.',
      )
    })

    it('does not start a draft by only being opened', async () => {
      useEditorBackend()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      await new Promise((resolve) => setTimeout(resolve, 800))
      expect(window.localStorage.length).toBe(0)
    })

    it('offers to delete the recipe, at the end of the page', async () => {
      useEditorBackend()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      expect(screen.getByRole('button', { name: 'Supprimer la recette' })).toBeVisible()
    })

    it('says so when the recipe does not exist, in place of a form', async () => {
      useEditorBackend()
      server.use(http.get(`${API}/recipes/:id`, () => problemResponse(404)))
      renderEditor('/recettes/r-9/modifier')

      expect(
        await screen.findByRole('heading', { level: 2, name: 'Cette recette n’existe plus.' }),
      ).toBeVisible()
      expect(screen.getByRole('link', { name: 'Voir les recettes' })).toHaveAttribute(
        'href',
        '/rechercher',
      )
      expect(screen.queryByRole('heading', { name: 'Informations' })).not.toBeInTheDocument()
    })

    it('says when it cannot be loaded, and loads it again', async () => {
      useEditorBackend()
      server.use(http.get(`${API}/recipes/:id`, () => problemResponse(500)))
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')

      expect(await screen.findByRole('alert')).toHaveTextContent('Impossible d’ouvrir l’éditeur')
      server.use(http.get(`${API}/recipes/:id`, () => HttpResponse.json(storedRecipe())))
      await user.click(screen.getByRole('button', { name: 'Réessayer' }))

      await findForm()
    })

    it('does not open for someone who may not change it', async () => {
      useEditorBackend({ recipe: storedRecipe({ author: { id: 'u-2', username: 'Hugo' } }) })
      renderEditor('/recettes/r-1/modifier')

      const refusal = await screen.findByRole('alert')
      expect(refusal).toHaveTextContent('Tu n’as pas le droit de modifier cette recette.')
      expect(within(refusal).getByRole('link', { name: 'Retour à la recette' })).toHaveAttribute(
        'href',
        '/recettes/r-1',
      )
      expect(screen.queryByRole('heading', { name: 'Informations' })).not.toBeInTheDocument()
    })

    it('opens for an administrator on someone else’s recipe', async () => {
      sessionStore.signOut()
      signInAsMember(['USER', 'ADMIN'])
      useEditorBackend({ recipe: storedRecipe({ author: { id: 'u-2', username: 'Hugo' } }) })
      renderEditor('/recettes/r-1/modifier')

      await findForm()
    })

    it('opens with the recipe it is now asked for, not the one it showed before', async () => {
      useEditorBackend()
      server.use(
        http.get(`${API}/recipes/:id`, ({ params }) =>
          HttpResponse.json(storedRecipe({ id: params.id, title: `Recette ${String(params.id)}` })),
        ),
      )
      const { router } = renderEditor('/recettes/r-1/modifier')
      await findForm()
      expect(screen.getByLabelText('Titre')).toHaveValue('Recette r-1')

      await act(() => router.navigate('/recettes/r-2/modifier'))

      await waitFor(() => {
        expect(screen.getByLabelText('Titre')).toHaveValue('Recette r-2')
      })
    })

    it('has no accessibility violation', async () => {
      useEditorBackend()
      const { container } = renderEditor('/recettes/r-1/modifier')
      await findForm()

      await expectNoAccessibilityViolations(container)
    })
  })
})
