import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
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
  writeInRichText,
} from './editor.testkit'

const save = () => screen.getByRole('button', { name: /^Enregistrer|Enregistrement…/ })
const section = () => within(screen.getByRole('region', { name: 'Étapes' }))
const step = (position: number) =>
  within(section().getByRole('article', { name: `Étape ${position}` }))
const texts = () =>
  section()
    .getAllByRole('article')
    .map(
      (article) => within(article).getByRole('textbox', { name: /^Texte de l’étape/ }).textContent,
    )

describe('RecipeEditorScreen: the steps', () => {
  beforeEach(() => {
    installMatchMedia(390)
    signInAsMember()
  })

  afterEach(() => {
    removeMatchMedia()
    window.localStorage.clear()
  })

  it('starts with one step to write, numbered', async () => {
    useEditorBackend()
    renderEditor('/recettes/nouvelle')
    await findForm()

    expect(section().getAllByRole('article')).toHaveLength(1)
    expect(step(1).getByRole('heading', { level: 3, name: 'Étape 1' })).toBeVisible()
    expect(step(1).getByRole('textbox', { name: /^Texte de l’étape/ })).toBeVisible()
    expect(step(1).getByText('Photos de l’étape')).toBeVisible()
  })

  it('adds a step at the end and puts the typing in it', async () => {
    useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/r-1/modifier')
    await findForm()

    await user.click(section().getByRole('button', { name: 'Ajouter une étape' }))

    expect(section().getAllByRole('article')).toHaveLength(3)
    expect(step(3).getByRole('textbox')).toHaveFocus()
  })

  it('writes each step as rich text, and sends them in order', async () => {
    const backend = useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await fillMinimalRecipe(user)
    await user.click(section().getByRole('button', { name: 'Ajouter une étape' }))
    await writeInRichText(step(2).getByRole('textbox'), 'Fais cuire.')

    await user.click(save())

    await screen.findByText('Page de la recette')
    expect(backend.sent[0]).toMatchObject({
      steps: [{ instruction: '<p>Mélange tout.</p>' }, { instruction: '<p>Fais cuire.</p>' }],
    })
  })

  it('says that a step needs its text, in its own field', async () => {
    const backend = useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await fillMinimalRecipe(user)
    await user.click(section().getByRole('button', { name: 'Ajouter une étape' }))

    await user.click(save())

    expect(step(2).getByText('Écris au moins une phrase pour cette étape.')).toBeVisible()
    expect(step(2).getByRole('textbox')).toBeInvalid()
    expect(backend.sent).toEqual([])
  })

  describe('removing', () => {
    it('removes a step without asking, renumbers the others, and takes it back from the notification', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      await user.click(step(1).getByRole('button', { name: 'Retirer l’étape 1' }))

      expect(texts()).toEqual(['Fais cuire.'])
      expect(step(1).getByRole('heading', { level: 3, name: 'Étape 1' })).toBeVisible()
      expect(await screen.findByText('Étape retirée.')).toBeVisible()
      await user.click(
        within(screen.getByRole('region', { name: 'Notifications' })).getByRole('button', {
          name: 'Annuler',
        }),
      )

      expect(texts()).toEqual(['Mélange tout.', 'Fais cuire.'])
      expect(step(1).getByRole('group', { name: 'Photo 1 sur 1' })).toBeVisible()
    })

    it('says that a recipe needs a step once none is left', async () => {
      const backend = useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()
      await fillMinimalRecipe(user)
      await user.click(step(1).getByRole('button', { name: 'Retirer l’étape 1' }))

      await user.click(save())

      expect(section().getByText('Ajoute au moins une étape.')).toBeVisible()
      expect(backend.sent).toEqual([])
    })
  })

  describe('arranging', () => {
    it('moves a step down and up, the number following the place', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      await user.click(step(1).getByRole('button', { name: 'Descendre l’étape 1' }))

      expect(texts()).toEqual(['Fais cuire.', 'Mélange tout.'])
      expect(step(2).getByRole('group', { name: 'Photo 1 sur 1' })).toBeVisible()
      expect(screen.getByText('Étape 1 déplacée en position 2 sur 2')).toBeInTheDocument()

      await user.click(step(2).getByRole('button', { name: 'Monter l’étape 2' }))
      expect(texts()).toEqual(['Mélange tout.', 'Fais cuire.'])
    })

    it('has no button that leads nowhere', async () => {
      useEditorBackend()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      expect(step(1).getByRole('button', { name: 'Monter l’étape 1' })).toBeDisabled()
      expect(step(2).getByRole('button', { name: 'Descendre l’étape 2' })).toBeDisabled()
    })

    it('keeps the focus on the button that was used', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      await user.click(step(1).getByRole('button', { name: 'Descendre l’étape 1' }))

      await waitFor(() => {
        expect(step(2).getByRole('button', { name: 'Monter l’étape 2' })).toHaveFocus()
      })
    })
  })
})

describe('RecipeEditorScreen: the introduction and the tip', () => {
  beforeEach(() => {
    installMatchMedia(1280)
    signInAsMember()
  })

  afterEach(() => {
    removeMatchMedia()
    window.localStorage.clear()
  })

  const tip = () => screen.getByRole('textbox', { name: /^le petit conseil/ })

  it('sends the tip with the recipe, and nothing for a tip not written', async () => {
    const backend = useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await fillMinimalRecipe(user)
    await user.click(save())
    await screen.findByText('Page de la recette')
    expect(backend.sent[0]).not.toHaveProperty('recommendations')
    expect(backend.sent[0]).not.toHaveProperty('introduction')
  })

  it('writes the tip', async () => {
    const backend = useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await fillMinimalRecipe(user)
    await writeInRichText(tip(), 'Prépare la pâte la veille.')

    await user.click(save())

    await screen.findByText('Page de la recette')
    expect(backend.sent[0]).toMatchObject({ recommendations: '<p>Prépare la pâte la veille.</p>' })
  })

  it('tells the back end to remove a tip and an introduction that were emptied', async () => {
    const backend = useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/r-1/modifier')
    await findForm()
    for (const box of [tip(), screen.getByRole('textbox', { name: /^Introduction/ })]) {
      await user.click(box)
      await user.keyboard('{Control>}a{/Control}{Backspace}')
    }

    await user.click(save())

    await screen.findByText('Page de la recette')
    expect(backend.sent[0]).toMatchObject({ recommendations: '', introduction: { text: '' } })
  })
})

describe('RecipeEditorScreen: deleting the recipe', () => {
  beforeEach(() => {
    installMatchMedia(390)
    signInAsMember()
  })

  afterEach(() => {
    removeMatchMedia()
    window.localStorage.clear()
  })

  it('asks first, naming the recipe, and the first answer is to keep it', async () => {
    useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/r-1/modifier')
    await findForm()

    await user.click(screen.getByRole('button', { name: 'Supprimer la recette' }))

    const question = screen.getByRole('alertdialog', { name: 'Supprimer cette recette ?' })
    expect(question).toHaveTextContent('« Tarte fine aux pommes » sera supprimée pour toujours')
    expect(within(question).getByRole('button', { name: 'Annuler' })).toHaveFocus()
  })

  it('deletes it when that is confirmed, and goes to the recipes', async () => {
    useEditorBackend()
    let deleted = false
    server.use(
      http.delete(`${API}/recipes/:id`, () => {
        deleted = true
        return new HttpResponse(null, { status: 204 })
      }),
    )
    const user = userEvent.setup()
    const { router } = renderEditor('/recettes/r-1/modifier')
    await findForm()

    await user.click(screen.getByRole('button', { name: 'Supprimer la recette' }))
    await user.click(
      within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Supprimer la recette' }),
    )

    expect(await screen.findByText('Page de recherche')).toBeVisible()
    expect(deleted).toBe(true)
    expect(router.state.location.pathname).toBe('/rechercher')
  })

  it('says why it could not be deleted, and tries again', async () => {
    useEditorBackend()
    server.use(http.delete(`${API}/recipes/:id`, () => problemResponse(500)))
    const user = userEvent.setup()
    renderEditor('/recettes/r-1/modifier')
    await findForm()
    await user.click(screen.getByRole('button', { name: 'Supprimer la recette' }))

    await user.click(
      within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Supprimer la recette' }),
    )

    const failure = await screen.findByRole('alert')
    expect(failure).toHaveTextContent('Suppression impossible.')
    expect(within(failure).getByRole('button', { name: 'Réessayer' })).toBeVisible()
    expect(screen.getByLabelText('Titre')).toHaveValue('Tarte fine aux pommes')
  })
})
