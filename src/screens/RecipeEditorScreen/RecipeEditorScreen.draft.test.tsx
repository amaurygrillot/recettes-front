import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { sessionStore } from '../../api/sessionStore'
import { installMatchMedia, removeMatchMedia } from '../../test/matchMedia'
import { draftKey, loadDraft, markInterrupted, saveDraft, wasInterrupted } from './editorDraft'
import { validValues } from './editorFixtures'
import { newRecipeValues } from './editorModel'
import { findForm, renderEditor, signInAsMember, useEditorBackend } from './editor.testkit'

const title = () => screen.getByLabelText('Titre')

/** A draft someone left on this device: a recipe being written, with a title and nothing else. */
function leaveADraft(recipeId: string | undefined, text = 'Tarte à moitié écrite') {
  saveDraft(draftKey(recipeId), { ...newRecipeValues(), title: text })
}

describe('RecipeEditorScreen: the draft', () => {
  beforeEach(() => {
    installMatchMedia(390)
    signInAsMember()
  })

  afterEach(() => {
    removeMatchMedia()
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('being written', () => {
    it('is kept on the device a moment after the typing, and says so', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.type(title(), 'Tarte')

      expect(await screen.findByText('Brouillon enregistré sur cet appareil')).toBeVisible()
      expect(loadDraft(draftKey(undefined))?.values.title).toBe('Tarte')
    })

    it('is not kept when everything is back to what the form started with', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.type(title(), 'T')
      await waitFor(() => {
        expect(loadDraft(draftKey(undefined))).toBeDefined()
      })
      await user.clear(title())

      await waitFor(() => {
        expect(loadDraft(draftKey(undefined))).toBeUndefined()
      })
    })

    it('says when the device would not keep it, and goes on', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Quota', 'QuotaExceededError')
      })

      await user.type(title(), 'Tarte')

      expect(await screen.findByText('Brouillon non enregistré sur cet appareil')).toBeVisible()
      expect(title()).toHaveValue('Tarte')
    })

    it('is one per recipe: another recipe’s draft is not offered', async () => {
      useEditorBackend()
      leaveADraft('r-2')
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      expect(screen.queryByText('Reprendre ton brouillon ?')).not.toBeInTheDocument()
    })
  })

  describe('found again', () => {
    it('is offered, with when it was kept, above the sections', async () => {
      useEditorBackend()
      leaveADraft(undefined)
      renderEditor('/recettes/nouvelle')
      await findForm()

      const offer = screen.getByRole('region', { name: 'Reprendre ton brouillon ?' })
      expect(offer).toHaveTextContent(
        /Tu avais commencé une recette sur cet appareil, aujourd’hui à \d+ h \d{2}\./,
      )
      expect(title()).toHaveValue('')
    })

    it('is taken up with « Reprendre »', async () => {
      useEditorBackend()
      leaveADraft(undefined)
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.click(screen.getByRole('button', { name: 'Reprendre' }))

      expect(title()).toHaveValue('Tarte à moitié écrite')
      expect(screen.queryByText('Reprendre ton brouillon ?')).not.toBeInTheDocument()
    })

    it('is offered for a recipe being changed too, and replaces what it holds only when taken up', async () => {
      useEditorBackend()
      saveDraft(draftKey('r-1'), { ...validValues(), title: 'Tarte tatin, version du brouillon' })
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()
      expect(title()).toHaveValue('Tarte fine aux pommes')

      await user.click(screen.getByRole('button', { name: 'Reprendre' }))

      expect(title()).toHaveValue('Tarte tatin, version du brouillon')
    })

    it('is not offered when it holds what the recipe holds already', async () => {
      useEditorBackend()
      saveDraft(draftKey('r-1'), {
        title: 'Tarte fine aux pommes',
        introduction: '<p>La tarte de tous les dimanches.</p>',
        categories: [{ id: 'tartes', label: 'Desserts › Tartes' }],
        tags: [{ id: 't-fruits', label: 'Fruits' }],
        photos: [
          { mediaId: 'm-1', altText: 'La tarte entière' },
          { mediaId: 'm-2', altText: '' },
        ],
        groups: [
          {
            title: 'Pour la pâte',
            lines: [
              {
                ingredient: { id: 'i-farine', label: 'farine de blé' },
                quantity: '250',
                unitId: 'u-g',
                note: '',
              },
              {
                ingredient: { id: 'i-beurre', label: 'beurre' },
                quantity: '125',
                unitId: '',
                note: 'froid',
              },
            ],
          },
        ],
        steps: [
          { html: '<p>Mélange tout.</p>', photos: [{ mediaId: 'm-3', altText: '' }] },
          { html: '<p>Fais cuire.</p>', photos: [] },
        ],
        advice: '<p>Prépare la pâte la veille.</p>',
      })
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      expect(screen.queryByText('Reprendre ton brouillon ?')).not.toBeInTheDocument()
    })

    it('is erased only after being asked again: « Recommencer » opens a question whose first answer keeps it', async () => {
      useEditorBackend()
      leaveADraft(undefined)
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.click(screen.getByRole('button', { name: 'Recommencer' }))

      const question = screen.getByRole('alertdialog', { name: 'Effacer le brouillon ?' })
      expect(question).toBeVisible()
      expect(screen.getByRole('button', { name: 'Garder le brouillon' })).toHaveFocus()

      await user.click(screen.getByRole('button', { name: 'Garder le brouillon' }))

      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
      expect(screen.getByText('Reprendre ton brouillon ?')).toBeVisible()
      expect(loadDraft(draftKey(undefined))).toBeDefined()
    })

    it('is erased when that is confirmed, and the form starts again from nothing', async () => {
      useEditorBackend()
      leaveADraft(undefined)
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.click(screen.getByRole('button', { name: 'Recommencer' }))
      await user.click(screen.getByRole('button', { name: 'Effacer le brouillon' }))

      expect(loadDraft(draftKey(undefined))).toBeUndefined()
      expect(screen.queryByText('Reprendre ton brouillon ?')).not.toBeInTheDocument()
      expect(title()).toHaveValue('')
    })

    it('is not written over by typing before the question was answered', async () => {
      useEditorBackend()
      leaveADraft(undefined)
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.type(title(), 'Autre chose')
      await new Promise((resolve) => setTimeout(resolve, 800))

      expect(loadDraft(draftKey(undefined))?.values.title).toBe('Tarte à moitié écrite')
    })
  })

  describe('after a lost session', () => {
    it('is not replaced by the form when the session ends before the question was answered', async () => {
      useEditorBackend()
      leaveADraft(undefined)
      renderEditor('/recettes/nouvelle')
      await findForm()

      act(() => {
        sessionStore.expire(sessionStore.getToken() ?? '')
      })

      expect(loadDraft(draftKey(undefined))?.values.title).toBe('Tarte à moitié écrite')
      expect(wasInterrupted(draftKey(undefined))).toBe(false)
    })

    it('is taken up again without asking, and says that nothing was lost', async () => {
      useEditorBackend()
      leaveADraft(undefined)
      markInterrupted(draftKey(undefined))
      renderEditor('/recettes/nouvelle')
      await findForm()

      expect(title()).toHaveValue('Tarte à moitié écrite')
      expect(screen.queryByText('Reprendre ton brouillon ?')).not.toBeInTheDocument()
      expect(await screen.findByText('Te revoilà : ton brouillon est intact.')).toBeVisible()
      expect(wasInterrupted(draftKey(undefined))).toBe(false)
    })

    it('does not make the next draft taken up without asking: the note is only for one return', async () => {
      useEditorBackend()
      markInterrupted(draftKey(undefined))
      renderEditor('/recettes/nouvelle')
      await findForm()

      expect(wasInterrupted(draftKey(undefined))).toBe(false)
      expect(screen.queryByText('Te revoilà : ton brouillon est intact.')).not.toBeInTheDocument()
    })
  })
})

describe('RecipeEditorScreen: leaving', () => {
  beforeEach(() => {
    installMatchMedia(390)
    signInAsMember()
  })

  afterEach(() => {
    removeMatchMedia()
    window.localStorage.clear()
  })

  const close = () => screen.getByRole('button', { name: 'Fermer l’éditeur' })

  it('leaves at once when nothing was changed', async () => {
    useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()

    await user.click(close())

    expect(await screen.findByText('Page d’accueil')).toBeVisible()
  })

  it('goes back to the recipe when it was a recipe being changed', async () => {
    useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/r-1/modifier')
    await findForm()

    await user.click(close())

    expect(await screen.findByText('Page de la recette')).toBeVisible()
  })

  it('asks first when something was changed, and the first answer is to stay', async () => {
    useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await user.type(title(), 'Tarte')

    await user.click(close())

    expect(screen.getByRole('alertdialog', { name: 'Quitter sans enregistrer ?' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Continuer à modifier' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Continuer à modifier' }))

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(title()).toHaveValue('Tarte')
  })

  it('leaves when that is chosen, and the draft stays on the device', async () => {
    useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await user.type(title(), 'Tarte')

    await user.click(close())
    await user.click(screen.getByRole('button', { name: 'Quitter' }))

    expect(await screen.findByText('Page d’accueil')).toBeVisible()
    expect(loadDraft(draftKey(undefined))?.values.title).toBe('Tarte')
  })

  it('asks the same with « Annuler »', async () => {
    useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await user.type(title(), 'Tarte')

    await user.click(screen.getByRole('button', { name: 'Annuler' }))

    expect(screen.getByRole('alertdialog', { name: 'Quitter sans enregistrer ?' })).toBeVisible()
  })

  it('does not ask once the session is lost: the draft is kept, and the way out is the login', async () => {
    useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await user.type(title(), 'Tarte')

    act(() => {
      sessionStore.expire(sessionStore.getToken() ?? '')
    })
    await user.click(close())

    expect(await screen.findByText('Page d’accueil')).toBeVisible()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(loadDraft(draftKey(undefined))?.values.title).toBe('Tarte')
  })

  it('does not ask when what was changed was changed back', async () => {
    useEditorBackend()
    const user = userEvent.setup()
    renderEditor('/recettes/nouvelle')
    await findForm()
    await user.type(title(), 'T')
    await user.clear(title())

    await user.click(close())

    expect(await screen.findByText('Page d’accueil')).toBeVisible()
  })
})
