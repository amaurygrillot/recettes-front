import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { installMatchMedia, removeMatchMedia } from '../../test/matchMedia'
import { problemResponse } from '../../test/problem'
import { server } from '../../test/server'
import {
  API,
  fillMinimalRecipe,
  findForm,
  renderEditor,
  signInAsMember,
  useEditorBackend,
} from './editor.testkit'

const save = () => screen.getByRole('button', { name: /^Enregistrer|Enregistrement…/ })

/** The ingredients section, since the steps and the photos have fields of their own. */
const section = () => within(screen.getByRole('region', { name: 'Ingrédients' }))
const line = (position: number) =>
  within(section().getByRole('group', { name: `Ingrédient ${position}` }))
const ingredientField = (position: number) =>
  line(position).getByRole('combobox', { name: 'Ingrédient' })
const chosenIngredients = () =>
  section()
    .getAllByRole('combobox', { name: 'Ingrédient' })
    .map((field) => (field instanceof HTMLInputElement ? field.value : ''))

/** What the open list of suggestions says, line by line. */
const suggestions = () =>
  within(screen.getByRole('listbox', { name: 'Ingrédients existants' }))
    .getAllByRole('option')
    .map((option) => option.textContent)

describe('RecipeEditorScreen: the ingredients', () => {
  beforeEach(() => {
    installMatchMedia(390)
    signInAsMember()
  })

  afterEach(() => {
    removeMatchMedia()
    window.localStorage.clear()
  })

  describe('choosing an ingredient', () => {
    it('suggests what exists as it is typed, with the letters typed in bold', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.type(ingredientField(1), 'farine')

      await screen.findByRole('option', { name: 'Créer « farine »' })
      expect(suggestions()).toEqual(['farine de blé', 'farine de maïs', 'Créer « farine »'])
      expect(
        within(screen.getByRole('listbox', { name: 'Ingrédients existants' })).getAllByText(
          'farine',
          {
            selector: 'b',
          },
        ),
      ).toHaveLength(2)
    })

    it('chooses nothing by itself: the recipe is not complete with only text typed', async () => {
      const backend = useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()
      await fillMinimalRecipe(user)
      await user.clear(ingredientField(1))
      await user.type(ingredientField(1), 'farine de blé')

      await user.click(save())

      expect(section().getByText('Choisis un ingrédient de la liste, ou crée-le.')).toBeVisible()
      expect(backend.sent).toEqual([])
    })

    it('takes the choice back when the text is changed afterwards', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()
      await fillMinimalRecipe(user)

      await user.type(ingredientField(1), 's')
      await user.click(save())

      expect(section().getByText('Choisis un ingrédient de la liste, ou crée-le.')).toBeVisible()
    })

    it('has no way to create an ingredient that exists already', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.type(ingredientField(1), 'Beurre')

      await screen.findByRole('option', { name: 'beurre' })
      expect(suggestions()).toEqual(['beurre'])
    })

    it('sends the unit, the quantity and the note with the ingredient', async () => {
      const backend = useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()
      await fillMinimalRecipe(user)

      await user.type(line(1).getByLabelText('Quantité'), '250')
      await user.selectOptions(line(1).getByLabelText('Unité'), 'g')
      await user.type(line(1).getByLabelText('Note'), 'tamisée')
      await user.click(save())

      await screen.findByText('Page de la recette')
      expect(backend.sent[0]).toMatchObject({
        ingredientGroups: [
          {
            ingredients: [
              { ingredientId: 'i-farine', quantity: 250, unitId: 'u-g', note: 'tamisée' },
            ],
          },
        ],
      })
    })

    it('offers the units that exist, and none for a line without one', async () => {
      useEditorBackend()
      renderEditor('/recettes/nouvelle')
      await findForm()

      expect(
        within(line(1).getByLabelText('Unité'))
          .getAllByRole('option')
          .map((option) => option.textContent),
      ).toEqual(['—', 'g', 'pincée'])
    })
  })

  describe('creating an ingredient on the spot', () => {
    it('creates it, chooses it, and says so', async () => {
      useEditorBackend()
      let created: unknown
      server.use(
        http.post(`${API}/ingredients`, async ({ request }) => {
          created = await request.json()
          return HttpResponse.json({ id: 'i-kiwi', name: 'kiwi' }, { status: 201 })
        }),
      )
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.type(ingredientField(1), 'kiwi')
      await user.click(await screen.findByRole('option', { name: 'Créer « kiwi »' }))

      expect(await screen.findByText('Ingrédient créé, il est dans la liste')).toBeVisible()
      expect(created).toEqual({ name: 'kiwi' })
      expect(ingredientField(1)).toHaveValue('kiwi')
      expect(ingredientField(1)).not.toBeInvalid()
    })

    it('locks the field while it is being created, and says what is going on', async () => {
      useEditorBackend()
      server.use(
        http.post(`${API}/ingredients`, async () => {
          await delay(150)
          return HttpResponse.json({ id: 'i-kiwi', name: 'kiwi' }, { status: 201 })
        }),
      )
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.type(ingredientField(1), 'kiwi')
      await user.click(await screen.findByRole('option', { name: 'Créer « kiwi »' }))

      expect(ingredientField(1)).toBeDisabled()
      expect(screen.getByRole('listbox', { name: 'Ingrédients existants' })).toHaveTextContent(
        'Création de « kiwi »…',
      )
      await screen.findByText('Ingrédient créé, il est dans la liste')
      expect(ingredientField(1)).toBeEnabled()
    })

    it('chooses the one that exists when someone created it first (409), and says it calmly', async () => {
      useEditorBackend()
      let conflict = false
      server.use(
        http.get(`${API}/ingredients`, ({ request }) => {
          const prefix = new URL(request.url).searchParams.get('namePrefix')
          const content =
            conflict && prefix?.toLowerCase() === 'pois chiche'
              ? [{ id: 'i-pois', name: 'Pois chiche' }]
              : []
          return HttpResponse.json({ content, number: 0, last: true })
        }),
        http.post(`${API}/ingredients`, () => {
          conflict = true
          return problemResponse(409)
        }),
      )
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.type(ingredientField(1), 'pois chiche')
      await user.click(await screen.findByRole('option', { name: 'Créer « pois chiche »' }))

      expect(
        await screen.findByText('« Pois chiche » existe déjà. On l’a choisi pour toi.'),
      ).toBeVisible()
      expect(ingredientField(1)).toHaveValue('Pois chiche')
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('says it when the ingredient could not be created, keeps the text, and tries again', async () => {
      useEditorBackend()
      let attempts = 0
      server.use(
        http.post(`${API}/ingredients`, () => {
          attempts += 1
          return attempts === 1
            ? problemResponse(500)
            : HttpResponse.json({ id: 'i-kiwi', name: 'kiwi' }, { status: 201 })
        }),
      )
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.type(ingredientField(1), 'kiwi')
      await user.click(await screen.findByRole('option', { name: 'Créer « kiwi »' }))

      const failure = await screen.findByRole('alert')
      expect(failure).toHaveTextContent('Impossible de créer « kiwi ». Réessaie dans un instant.')
      expect(ingredientField(1)).toHaveValue('kiwi')
      await user.click(within(failure).getByRole('button', { name: 'Réessayer' }))

      expect(await screen.findByText('Ingrédient créé, il est dans la liste')).toBeVisible()
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('says it when the network is down', async () => {
      useEditorBackend()
      server.use(http.post(`${API}/ingredients`, () => HttpResponse.error()))
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.type(ingredientField(1), 'kiwi')
      await user.click(await screen.findByRole('option', { name: 'Créer « kiwi »' }))

      expect(await screen.findByRole('alert')).toHaveTextContent('Impossible de créer « kiwi ».')
    })
  })

  describe('the lines of a group', () => {
    it('adds a line and puts the typing in it', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      await user.click(section().getByRole('button', { name: 'Ajouter un ingrédient' }))

      expect(section().getByRole('group', { name: 'Ingrédient 3' })).toBeVisible()
      expect(ingredientField(3)).toHaveFocus()
      expect(section().getByText('3 ingrédients')).toBeVisible()
    })

    it('removes a line without asking, and takes it back from the notification', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      await user.click(line(1).getByRole('button', { name: 'Retirer l’ingrédient 1' }))

      expect(chosenIngredients()).toEqual(['beurre'])
      expect(await screen.findByText('Ingrédient retiré.')).toBeVisible()
      await user.click(
        within(screen.getByRole('region', { name: 'Notifications' })).getByRole('button', {
          name: 'Annuler',
        }),
      )

      expect(chosenIngredients()).toEqual(['farine de blé', 'beurre'])
      expect(line(1).getByLabelText('Quantité')).toHaveValue('250')
    })

    it('says that a group needs a line once its last one is removed, where the line was', async () => {
      const backend = useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()
      await fillMinimalRecipe(user)
      await user.click(line(1).getByRole('button', { name: 'Retirer l’ingrédient 1' }))

      await user.click(save())

      expect(section().getByText('Ajoute au moins un ingrédient à ce groupe.')).toBeVisible()
      expect(backend.sent).toEqual([])
    })

    it('moves a line down and up with its buttons', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      await user.click(line(1).getByRole('button', { name: 'Descendre l’ingrédient 1' }))
      expect(chosenIngredients()).toEqual(['beurre', 'farine de blé'])
      expect(line(2).getByLabelText('Quantité')).toHaveValue('250')

      await user.click(line(2).getByRole('button', { name: 'Monter l’ingrédient 2' }))
      expect(chosenIngredients()).toEqual(['farine de blé', 'beurre'])
    })

    it('has no button that leads nowhere', async () => {
      useEditorBackend()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      expect(line(1).getByRole('button', { name: 'Monter l’ingrédient 1' })).toBeDisabled()
      expect(line(2).getByRole('button', { name: 'Descendre l’ingrédient 2' })).toBeDisabled()
    })
  })

  describe('the groups', () => {
    it('starts with a group that has no title, which the page calls so', async () => {
      useEditorBackend()
      renderEditor('/recettes/nouvelle')
      await findForm()

      expect(section().getByRole('group', { name: 'Groupe sans titre' })).toBeVisible()
      expect(section().getByRole('heading', { level: 3, name: 'Groupe sans titre' })).toBeVisible()
      expect(section().getByRole('button', { name: 'Ajouter un titre' })).toBeVisible()
    })

    it('adds a group and puts the typing in its first line', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      await user.click(section().getByRole('button', { name: 'Ajouter un groupe' }))

      expect(
        section()
          .getAllByRole('heading', { level: 3 })
          .map((h) => h.textContent),
      ).toEqual(['Pour la pâte', 'Groupe sans titre'])
      expect(section().getAllByRole('combobox', { name: 'Ingrédient' }).at(-1)).toHaveFocus()
    })

    it('renames a group in place, with the same button to validate it', async () => {
      const backend = useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      await user.click(section().getByRole('button', { name: 'Renommer' }))
      const title = section().getByLabelText(/^Titre du groupe/)
      expect(title).toHaveFocus()
      await user.clear(title)
      await user.type(title, 'Pour la garniture')
      await user.click(section().getByRole('button', { name: 'Valider le titre' }))

      expect(section().getByRole('heading', { level: 3, name: 'Pour la garniture' })).toBeVisible()
      await user.click(save())
      await screen.findByText('Page de la recette')
      expect(backend.sent[0]).toMatchObject({ ingredientGroups: [{ title: 'Pour la garniture' }] })
    })

    it('refuses a title of more than 200 characters', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()
      await user.click(section().getByRole('button', { name: 'Renommer' }))

      await user.click(section().getByLabelText(/^Titre du groupe/))
      await user.paste('t'.repeat(201))
      await user.click(save())

      expect(section().getByText('Trop long : 200 caractères au plus.')).toBeVisible()
    })

    it('removes at once a group with nothing in it', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.click(section().getByRole('button', { name: 'Retirer le groupe' }))

      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
      expect(section().getByText('Aucun ingrédient pour l’instant')).toBeVisible()
    })

    it('asks before removing a group that has something in it, the first answer being to keep it', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      await user.click(section().getByRole('button', { name: 'Retirer le groupe' }))

      const question = screen.getByRole('alertdialog', { name: 'Retirer ce groupe ?' })
      expect(question).toHaveTextContent(
        '« Pour la pâte » et ses 2 ingrédients seront retirés de la recette. Rien n’est supprimé tant que tu n’as pas enregistré.',
      )
      expect(within(question).getByRole('button', { name: 'Annuler' })).toHaveFocus()

      await user.click(within(question).getByRole('button', { name: 'Annuler' }))
      expect(section().getByRole('heading', { level: 3, name: 'Pour la pâte' })).toBeVisible()

      await user.click(section().getByRole('button', { name: 'Retirer le groupe' }))
      await user.click(screen.getByRole('button', { name: 'Retirer le groupe', description: '' }))
      await waitFor(() => {
        expect(
          section().queryByRole('heading', { level: 3, name: 'Pour la pâte' }),
        ).not.toBeInTheDocument()
      })
    })

    it('moves a group down and up, and has no button that leads nowhere', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()
      await user.click(section().getByRole('button', { name: 'Ajouter un groupe' }))
      const groups = () => section().getAllByRole('group', { name: /^Groupe / })
      expect(groups()).toHaveLength(2)

      const [first, second] = groups()
      if (first === undefined || second === undefined) throw new Error('Two groups expected')
      expect(within(first).getByRole('button', { name: 'Monter le groupe' })).toBeDisabled()
      expect(within(second).getByRole('button', { name: 'Descendre le groupe' })).toBeDisabled()

      await user.click(within(first).getByRole('button', { name: 'Descendre le groupe' }))

      expect(
        section()
          .getAllByRole('heading', { level: 3 })
          .map((h) => h.textContent),
      ).toEqual(['Groupe sans titre', 'Pour la pâte'])
    })

    it('says that a recipe needs an ingredient once there is no group left', async () => {
      const backend = useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()
      await fillMinimalRecipe(user)
      await user.click(section().getByRole('button', { name: 'Retirer le groupe' }))
      await user.click(screen.getByRole('button', { name: 'Retirer le groupe' }))

      await user.click(save())

      expect(section().getByText('Ajoute au moins un groupe avec un ingrédient.')).toBeVisible()
      expect(section().getByRole('button', { name: 'Ajouter un groupe' })).toBeVisible()
      expect(backend.sent).toEqual([])
    })
  })
})
