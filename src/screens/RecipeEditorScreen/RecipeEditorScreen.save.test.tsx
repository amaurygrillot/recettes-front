import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { sessionStore } from '../../api/sessionStore'
import { installMatchMedia, removeMatchMedia } from '../../test/matchMedia'
import { problemResponse } from '../../test/problem'
import { server } from '../../test/server'
import { draftKey, loadDraft } from './editorDraft'
import {
  API,
  fillMinimalRecipe,
  findForm,
  renderEditor,
  signInAsMember,
  useEditorBackend,
} from './editor.testkit'

const save = () => screen.getByRole('button', { name: /^Enregistrer|Enregistrement…/ })

describe('RecipeEditorScreen: what is missing', () => {
  beforeEach(() => {
    installMatchMedia(390)
    signInAsMember()
  })

  afterEach(() => {
    removeMatchMedia()
    window.localStorage.clear()
  })

  it('sends nothing from a blank form, and says what is missing once, at the top, and under each field', async () => {
    const backend = useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()

    await user.click(save())

    expect(backend.sent).toEqual([])
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Il reste 4 choses à corriger : un titre, une catégorie, un ingrédient à compléter, une étape à écrire.',
    )
    expect(screen.getByLabelText('Titre')).toHaveAccessibleDescription('Le titre est obligatoire.')
    expect(screen.getByText('Choisis au moins une catégorie.')).toBeVisible()
    expect(screen.getByText('Choisis un ingrédient de la liste, ou crée-le.')).toBeVisible()
    expect(screen.getByText('Écris au moins une phrase pour cette étape.')).toBeVisible()
  })

  it('puts the focus on the first field to correct', async () => {
    useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()

    await user.click(save())

    expect(screen.getByLabelText('Titre')).toHaveFocus()
  })

  it('takes the person to what a link of the summary names', async () => {
    useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await user.click(save())

    await user.click(screen.getByRole('button', { name: 'Aller aux catégories' }))

    expect(screen.getByRole('button', { name: 'Choisir des catégories' })).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Aller aux ingrédients' }))
    expect(screen.getByRole('combobox', { name: 'Ingrédient' })).toHaveFocus()
  })

  it('keeps the summary true as it is mended, and takes it away when all is there', async () => {
    useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await user.click(save())

    await user.type(screen.getByLabelText('Titre'), 'Tarte')
    expect(screen.getByRole('alert')).toHaveTextContent('Il reste 3 choses à corriger')
    expect(screen.getByLabelText('Titre')).not.toBeInvalid()

    await fillMinimalRecipe(user)
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  it('refuses a quantity that is not a number, and one below zero, under the line that has it', async () => {
    const backend = useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await fillMinimalRecipe(user)
    const line = within(screen.getByRole('group', { name: 'Ingrédient 1' }))

    await user.type(line.getByLabelText('Quantité'), 'abc')
    await user.click(save())
    expect(line.getByText('La quantité doit être un nombre, par exemple 250 ou 1,5.')).toBeVisible()

    await user.clear(line.getByLabelText('Quantité'))
    await user.type(line.getByLabelText('Quantité'), '-2')
    expect(line.getByText('La quantité ne peut pas être négative.')).toBeVisible()
    expect(backend.sent).toEqual([])
  })

  it('accepts the French decimal comma', async () => {
    const backend = useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await fillMinimalRecipe(user)
    await user.type(
      within(screen.getByRole('group', { name: 'Ingrédient 1' })).getByLabelText('Quantité'),
      '1,5',
    )

    await user.click(save())

    await waitFor(() => {
      expect(backend.sent).toHaveLength(1)
    })
    expect(backend.sent[0]).toMatchObject({
      ingredientGroups: [{ ingredients: [{ ingredientId: 'i-farine', quantity: 1.5 }] }],
    })
  })

  it('refuses a title of more than 200 characters, with its counter', async () => {
    const backend = useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await fillMinimalRecipe(user)

    await user.click(screen.getByLabelText('Titre'))
    await user.paste('x'.repeat(200))
    await user.click(save())

    expect(screen.getByText('Trop long : 200 caractères au plus.')).toBeVisible()
    expect(screen.getByText(/^\d+ \/ 200$/)).toBeVisible()
    expect(backend.sent).toEqual([])
  })

  it('refuses a note of more than 200 characters under its line', async () => {
    useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await fillMinimalRecipe(user)
    const line = within(screen.getByRole('group', { name: 'Ingrédient 1' }))

    await user.click(line.getByLabelText('Note'))
    await user.paste('n'.repeat(201))
    await user.click(save())

    expect(line.getByText('La note est trop longue : 200 caractères au plus.')).toBeVisible()
    expect(line.getByText('201 / 200')).toBeVisible()
  })
})

describe('RecipeEditorScreen: sending', () => {
  beforeEach(() => {
    installMatchMedia(390)
    signInAsMember()
  })

  afterEach(() => {
    removeMatchMedia()
    window.localStorage.clear()
  })

  it('creates the recipe from what was written, then shows it', async () => {
    const backend = useEditorBackend()
    const user = userEvent.setup()
    const { router } = renderEditor('/recettes/nouvelle')
    await findForm()
    await fillMinimalRecipe(user)

    await user.click(save())

    expect(await screen.findByText('Page de la recette')).toBeVisible()
    expect(router.state.location.pathname).toBe('/recettes/r-new')
    expect(backend.sent).toEqual([
      {
        title: 'Tarte aux pommes',
        categoryIds: ['tartes'],
        tagIds: [],
        coverPictures: [],
        ingredientGroups: [{ ingredients: [{ ingredientId: 'i-farine' }] }],
        steps: [{ instruction: '<p>Mélange tout.</p>' }],
      },
    ])
    expect(screen.getByRole('status')).toHaveTextContent('Recette enregistrée.')
  })

  it('replaces what the recipe held with the whole form, and shows it', async () => {
    const backend = useEditorBackend()
    const user = userEvent.setup()
    const { router } = renderEditor('/recettes/r-1/modifier')
    await findForm()

    await user.clear(screen.getByLabelText('Titre'))
    await user.type(screen.getByLabelText('Titre'), 'Tarte tatin')
    await user.click(save())

    expect(await screen.findByText('Page de la recette')).toBeVisible()
    expect(router.state.location.pathname).toBe('/recettes/r-1')
    expect(backend.sent).toHaveLength(1)
    expect(backend.sent[0]).toMatchObject({
      title: 'Tarte tatin',
      categoryIds: ['tartes'],
      tagIds: ['t-fruits'],
      coverPictures: [{ mediaId: 'm-1', altText: 'La tarte entière' }, { mediaId: 'm-2' }],
      ingredientGroups: [
        {
          title: 'Pour la pâte',
          ingredients: [
            { ingredientId: 'i-farine', quantity: 250, unitId: 'u-g' },
            { ingredientId: 'i-beurre', quantity: 125, note: 'froid' },
          ],
        },
      ],
    })
  })

  it('does not come back to the editor with the back button after a save', async () => {
    useEditorBackend()
    const user = userEvent.setup()
    const { router } = renderEditor('/recettes/nouvelle')
    await findForm()
    await fillMinimalRecipe(user)

    await user.click(save())
    await screen.findByText('Page de la recette')

    expect(router.state.historyAction).toBe('REPLACE')
  })

  it('locks the form while the recipe is on its way, and sends it once', async () => {
    const backend = useEditorBackend()
    server.use(
      http.post(`${API}/recipes`, async ({ request }) => {
        backend.sent.push(await request.json())
        await delay(150)
        return HttpResponse.json({ id: 'r-new' }, { status: 201 })
      }),
    )
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await fillMinimalRecipe(user)

    await user.click(save())

    expect(save()).toHaveAccessibleName('Enregistrement…')
    expect(save()).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByLabelText('Titre')).toBeDisabled()
    await user.click(save())
    await screen.findByText('Page de la recette')
    expect(backend.sent).toHaveLength(1)
  })

  it('forgets the draft once the recipe is saved', async () => {
    useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await fillMinimalRecipe(user)
    await waitFor(() => {
      expect(loadDraft(draftKey(undefined))).toBeDefined()
    })

    await user.click(save())
    await screen.findByText('Page de la recette')

    expect(loadDraft(draftKey(undefined))).toBeUndefined()
  })

  describe('when it fails', () => {
    async function fillAndSave() {
      const user = userEvent.setup()
      const rendered = renderEditor('/recettes/nouvelle')
      await findForm()
      await fillMinimalRecipe(user)
      await user.click(save())
      return { user, ...rendered }
    }

    it('keeps the form and says why a refusal of the data cannot be mended by trying again (400)', async () => {
      useEditorBackend()
      server.use(http.post(`${API}/recipes`, () => problemResponse(400)))

      await fillAndSave()

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Enregistrement impossible.')
      expect(alert).toHaveTextContent(
        'Certaines informations ne sont pas valides. Vérifie ta saisie, puis réessaie.',
      )
      expect(within(alert).queryByRole('button', { name: 'Réessayer' })).not.toBeInTheDocument()
      expect(screen.getByLabelText('Titre')).toHaveValue('Tarte aux pommes')
      expect(save()).toHaveAccessibleName('Enregistrer')
    })

    it('offers to try again when the server could not answer (500), and sends the same recipe', async () => {
      const backend = useEditorBackend()
      let attempts = 0
      server.use(
        http.post(`${API}/recipes`, async ({ request }) => {
          backend.sent.push(await request.json())
          attempts += 1
          return attempts === 1
            ? problemResponse(500)
            : HttpResponse.json({ id: 'r-new' }, { status: 201 })
        }),
      )

      const { user } = await fillAndSave()
      await user.click(await screen.findByRole('button', { name: 'Réessayer' }))

      expect(await screen.findByText('Page de la recette')).toBeVisible()
      expect(backend.sent).toHaveLength(2)
      expect(backend.sent[1]).toEqual(backend.sent[0])
    })

    it('offers to try again when the network is down', async () => {
      useEditorBackend()
      server.use(http.post(`${API}/recipes`, () => HttpResponse.error()))

      await fillAndSave()

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Enregistrement impossible.')
      expect(within(alert).getByRole('button', { name: 'Réessayer' })).toBeVisible()
    })

    it('says for how long to wait when the service is saturated (503)', async () => {
      useEditorBackend()
      server.use(
        http.post(`${API}/recipes`, () => problemResponse(503, 'Busy', { 'Retry-After': '30' })),
      )

      await fillAndSave()

      expect(await screen.findByRole('alert')).toHaveTextContent('30 secondes')
    })

    it('replaces the form with a page when the person may not change the recipe (403)', async () => {
      useEditorBackend()
      server.use(http.put(`${API}/recipes/:id`, () => problemResponse(403)))
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()
      await user.type(screen.getByLabelText('Titre'), ' bis')

      await user.click(save())

      expect(
        await screen.findByRole('heading', {
          level: 2,
          name: 'Tu n’as pas le droit de modifier cette recette.',
        }),
      ).toBeVisible()
      expect(screen.queryByRole('heading', { name: 'Informations' })).not.toBeInTheDocument()
    })

    it('replaces the form with a page when the recipe was deleted meanwhile (404), keeping the draft', async () => {
      useEditorBackend()
      server.use(http.put(`${API}/recipes/:id`, () => problemResponse(404)))
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()
      await user.type(screen.getByLabelText('Titre'), ' bis')

      await user.click(save())

      expect(
        await screen.findByRole('heading', { level: 2, name: 'Cette recette n’existe plus.' }),
      ).toBeVisible()
      await waitFor(() => {
        expect(loadDraft(draftKey('r-1'))?.values.title).toBe('Tarte fine aux pommes bis')
      })
    })

    it('keeps the work when the session ends: the draft is kept at once, and the dialog of the app answers', async () => {
      useEditorBackend()
      server.use(http.post(`${API}/recipes`, () => problemResponse(401)))

      await fillAndSave()

      await waitFor(() => {
        expect(sessionStore.getSnapshot().status).toBe('expired')
      })
      expect(loadDraft(draftKey(undefined))?.values.title).toBe('Tarte aux pommes')
      // The editor is still there behind it, nothing typed is lost, and nothing asks about leaving.
      expect(screen.getByLabelText('Titre')).toHaveValue('Tarte aux pommes')
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
  })
})
