import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiRequestError, type ApiFailure } from '../../api/failure'
import { uploadMedia } from '../../api/media'
import { installMatchMedia, removeMatchMedia } from '../../test/matchMedia'
import {
  deferred,
  fillMinimalRecipe,
  findForm,
  picture,
  renderEditor,
  signInAsMember,
  useEditorBackend,
} from './editor.testkit'

// The request itself (its multipart body, its answers 413, 429 and 503) is the API layer's and has its
// own tests: here the picture is what the editor does with the answer, at the moment the test chooses.
vi.mock(import('../../api/media'), async (importOriginal) => ({
  ...(await importOriginal()),
  uploadMedia: vi.fn(),
}))

const upload = vi.mocked(uploadMedia)
const save = () => screen.getByRole('button', { name: /^Enregistrer|Enregistrement…/ })

/** The cover photos: the section of the page that has them, since each step has photos of its own. */
const cover = () => within(screen.getByRole('region', { name: 'Photos de couverture' }))

/** The file chooser behind « Galerie »: where a phone's gallery hands its pictures over. */
const gallery = () => cover().getByLabelText('Photos à envoyer')

/** What is written in the fields of description, in the order of the photos. */
const descriptions = () =>
  cover()
    .getAllByLabelText(/^Texte alternatif/)
    .map((input) => (input instanceof HTMLInputElement ? input.value : ''))

/** Every picture is stored at once, with an id of its own in the order they arrive. */
function storeEveryPicture() {
  let count = 0
  upload.mockImplementation(() => {
    count += 1
    return Promise.resolve({ id: `m-up${count}` })
  })
}

const refusedWith = (failure: ApiFailure) => () => Promise.reject(new ApiRequestError(failure))
const problem = { status: 0, detail: undefined } as const

describe('RecipeEditorScreen: the cover photos', () => {
  beforeEach(() => {
    installMatchMedia(390)
    signInAsMember()
    upload.mockReset()
  })

  afterEach(() => {
    removeMatchMedia()
    window.localStorage.clear()
  })

  describe('adding', () => {
    it('starts with the frame that says what is accepted, and the two ways to give a picture', async () => {
      useEditorBackend()
      renderEditor('/recettes/nouvelle')
      await findForm()

      expect(
        screen.getByText('JPEG ou PNG, 8 Mo au plus. La première photo sera la couverture.'),
      ).toBeVisible()
      expect(screen.getByRole('button', { name: 'Prendre une photo' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Galerie' })).toBeVisible()
    })

    it('shows the picture on its way, then in the list as the cover', async () => {
      useEditorBackend()
      const answer = deferred<{ id: string }>()
      upload.mockReturnValue(answer.promise)
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.upload(gallery(), picture())

      const sending = await cover().findByRole('group', { name: 'Envoi en cours' })
      expect(within(sending).getByRole('progressbar', { name: 'Envoi de la photo' })).toBeVisible()
      answer.resolve({ id: 'm-up1' })
      expect(await cover().findByRole('group', { name: 'Photo 1 sur 1' })).toHaveTextContent(
        'Couverture',
      )
      expect(cover().queryByRole('group', { name: 'Envoi en cours' })).not.toBeInTheDocument()
    })

    it('sends several pictures one after the other, so that the list keeps the order they were chosen in', async () => {
      useEditorBackend()
      const first = deferred<{ id: string }>()
      const second = deferred<{ id: string }>()
      upload.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.upload(gallery(), [picture('a.jpg'), picture('b.png', 'image/png')])
      await cover().findAllByRole('group', { name: 'Envoi en cours' })

      // The second does not leave before the first has arrived.
      expect(upload).toHaveBeenCalledTimes(1)
      expect(upload.mock.calls[0]?.[0].name).toBe('a.jpg')
      first.resolve({ id: 'm-a' })
      await waitFor(() => {
        expect(upload).toHaveBeenCalledTimes(2)
      })
      expect(upload.mock.calls[1]?.[0].name).toBe('b.png')
      second.resolve({ id: 'm-b' })
      await cover().findByRole('group', { name: 'Photo 2 sur 2' })
    })

    it('puts what was stored in the recipe when it is saved', async () => {
      const backend = useEditorBackend()
      storeEveryPicture()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()
      await fillMinimalRecipe(user)
      await user.upload(gallery(), picture())
      await cover().findByRole('group', { name: 'Photo 1 sur 1' })
      await user.type(cover().getByLabelText(/^Texte alternatif/), 'La tarte')

      await user.click(save())

      await screen.findByText('Page de la recette')
      expect(backend.sent[0]).toMatchObject({
        coverPictures: [{ mediaId: 'm-up1', altText: 'La tarte' }],
      })
    })

    it('opens a sheet from the tile that adds one more, and closes it as soon as a choice is made', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      await user.click(cover().getByRole('button', { name: 'Ajouter une photo' }))
      const sheet = await screen.findByRole('dialog', { name: 'Ajouter une photo' })
      expect(within(sheet).getByText('JPEG ou PNG, 8 Mo au plus.')).toBeVisible()
      await user.click(within(sheet).getByRole('button', { name: 'Choisir dans la galerie' }))

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('refuses what is not a JPEG or a PNG before sending anything, and offers only to remove it', async () => {
      useEditorBackend()
      const user = userEvent.setup({ applyAccept: false })
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.upload(gallery(), picture('dessin.gif', 'image/gif'))

      const refusal = await cover().findByRole('alert')
      expect(refusal).toHaveTextContent('JPEG ou PNG uniquement')
      expect(within(refusal).queryByRole('button', { name: 'Réessayer' })).not.toBeInTheDocument()
      expect(upload).not.toHaveBeenCalled()

      await user.click(within(refusal).getByRole('button', { name: 'Retirer' }))
      expect(cover().queryByRole('alert')).not.toBeInTheDocument()
    })

    it('refuses what is over 8 MB before sending anything', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()
      const heavy = picture()
      Object.defineProperty(heavy, 'size', { value: 8 * 1024 * 1024 + 1 })

      await user.upload(gallery(), heavy)

      expect(await cover().findByRole('alert')).toHaveTextContent('8 Mo maximum')
      expect(upload).not.toHaveBeenCalled()
    })

    it('says the same when the back end refuses the weight (413), without offering to send it again', async () => {
      useEditorBackend()
      upload.mockImplementation(refusedWith({ kind: 'payload-too-large', ...problem, status: 413 }))
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.upload(gallery(), picture())

      const refusal = await cover().findByRole('alert')
      expect(refusal).toHaveTextContent('8 Mo maximum')
      expect(within(refusal).queryByRole('button', { name: 'Réessayer' })).not.toBeInTheDocument()
    })

    it('says to wait when pictures were sent too often (429), and wakes the button when the time is up', async () => {
      useEditorBackend()
      upload.mockImplementationOnce(
        refusedWith({ kind: 'rate-limited', ...problem, status: 429, retryAfterSeconds: 2 }),
      )
      storeEveryPicture()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.upload(gallery(), picture())

      const refusal = await cover().findByRole('alert')
      expect(refusal).toHaveTextContent('Trop d’envois d’affilée, réessaie dans 2 secondes')
      expect(within(refusal).getByRole('button', { name: 'Réessayer dans 2 s' })).toBeDisabled()

      const retry = await within(refusal).findByRole(
        'button',
        { name: 'Réessayer' },
        { timeout: 3500 },
      )
      expect(retry).toBeEnabled()
      await user.click(retry)

      await cover().findByRole('group', { name: 'Photo 1 sur 1' })
    }, 10_000)

    it('says that the service is saturated (503), and sends the same picture again when asked', async () => {
      useEditorBackend()
      upload.mockImplementationOnce(
        refusedWith({ kind: 'unavailable', ...problem, status: 503, retryAfterSeconds: undefined }),
      )
      storeEveryPicture()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()
      const file = picture()

      await user.upload(gallery(), file)
      const refusal = await cover().findByRole('alert')
      expect(refusal).toHaveTextContent('Service momentanément saturé, réessaie')
      await user.click(within(refusal).getByRole('button', { name: 'Réessayer' }))

      await cover().findByRole('group', { name: 'Photo 1 sur 1' })
      expect(upload).toHaveBeenCalledTimes(2)
      expect(upload.mock.calls[1]?.[0]).toBe(file)
    })

    it('says that the connection is lost, and lets the picture be sent again or given up', async () => {
      useEditorBackend()
      upload.mockImplementation(refusedWith({ kind: 'network' }))
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()

      await user.upload(gallery(), picture())

      const refusal = await cover().findByRole('alert')
      expect(refusal).toHaveTextContent('Impossible de joindre le serveur.')
      expect(within(refusal).getByRole('button', { name: 'Réessayer' })).toBeVisible()
      expect(within(refusal).getByRole('button', { name: 'Retirer' })).toBeVisible()
    })

    it('lets a picture on its way be given up, which stops its request, and does not add it if it arrives anyway', async () => {
      useEditorBackend()
      const answer = deferred<{ id: string }>()
      upload.mockReturnValue(answer.promise)
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()
      await user.upload(gallery(), picture())

      await user.click(await cover().findByRole('button', { name: 'Annuler l’envoi' }))
      answer.resolve({ id: 'm-late' })
      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(upload.mock.calls[0]?.[1]?.aborted).toBe(true)
      expect(cover().queryByRole('group', { name: 'Envoi en cours' })).not.toBeInTheDocument()
      expect(cover().queryByRole('group', { name: /^Photo 1/ })).not.toBeInTheDocument()
    })

    it('does not send the recipe while a picture is still on its way, and says why', async () => {
      const backend = useEditorBackend()
      upload.mockReturnValue(deferred<{ id: string }>().promise)
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()
      await fillMinimalRecipe(user)
      await user.upload(gallery(), picture())
      await cover().findByRole('group', { name: 'Envoi en cours' })

      await user.click(save())

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Une photo est encore en cours d’envoi.',
      )
      expect(backend.sent).toEqual([])
    })
  })

  describe('arranging', () => {
    it('moves a photo with the arrows, renames the cover, and says where it went', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()
      const second = () => cover().getByRole('group', { name: 'Photo 2 sur 2' })
      expect(second()).toHaveTextContent('Photo 2')

      await user.click(
        within(second()).getByRole('button', { name: 'Déplacer la photo 2 vers la gauche' }),
      )

      expect(cover().getByRole('group', { name: 'Photo 1 sur 2' })).toHaveTextContent('Couverture')
      expect(descriptions()).toEqual(['', 'La tarte entière'])
      expect(screen.getByText('Photo 2 déplacée en position 1 sur 2')).toBeInTheDocument()
    })

    it('has no arrow that leads nowhere: the first cannot go back, the last cannot go forward', async () => {
      useEditorBackend()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      expect(
        cover().getByRole('button', { name: 'Déplacer la photo 1 vers la gauche' }),
      ).toBeDisabled()
      expect(
        cover().getByRole('button', { name: 'Déplacer la photo 2 vers la droite' }),
      ).toBeDisabled()
      expect(
        cover().getByRole('button', { name: 'Déplacer la photo 1 vers la droite' }),
      ).toBeEnabled()
    })

    it('keeps the focus on the arrow that was used, so that it can be used again', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      await user.click(cover().getByRole('button', { name: 'Déplacer la photo 1 vers la droite' }))

      await waitFor(() => {
        // The photo is now the second: its « right » arrow cannot go further, so the focus is on its « left » one.
        expect(
          cover().getByRole('button', { name: 'Déplacer la photo 2 vers la gauche' }),
        ).toHaveFocus()
      })
    })

    it('removes a photo from the list without asking, and the recipe is sent without it', async () => {
      const backend = useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      await user.click(cover().getByRole('button', { name: 'Retirer la photo 2' }))
      expect(cover().queryByRole('group', { name: 'Photo 2 sur 2' })).not.toBeInTheDocument()
      await user.click(save())

      await screen.findByText('Page de la recette')
      expect(backend.sent[0]).toMatchObject({
        coverPictures: [{ mediaId: 'm-1', altText: 'La tarte entière' }],
      })
    })

    it('refuses a description of more than 500 characters, with its counter', async () => {
      useEditorBackend()
      const user = userEvent.setup()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      const description = cover().getAllByLabelText(/^Texte alternatif/)[1]
      if (description === undefined) throw new Error('No second photo')
      await user.click(description)
      await user.paste('d'.repeat(501))
      await user.click(save())

      expect(screen.getByText('Trop long : 500 caractères au plus.')).toBeVisible()
      expect(screen.getByText('501 / 500')).toBeVisible()
    })

    it('says how to reorder, once there is something to reorder', async () => {
      useEditorBackend()
      renderEditor('/recettes/r-1/modifier')
      await findForm()

      expect(
        screen.getByText(
          'Glisse une photo, ou touche les flèches, pour changer l’ordre. La première est la couverture.',
        ),
      ).toBeVisible()
    })
  })

  describe('in a step', () => {
    it('adds a photo to the step it is chosen in, and nowhere else', async () => {
      const backend = useEditorBackend()
      storeEveryPicture()
      const user = userEvent.setup()
      renderEditor('/recettes/nouvelle')
      await findForm()
      await fillMinimalRecipe(user)
      const step = within(screen.getByRole('article', { name: 'Étape 1' }))

      await user.upload(step.getByLabelText('Photos à envoyer'), picture())

      expect(await step.findByRole('group', { name: 'Photo 1 sur 1' })).toHaveTextContent('Photo 1')
      expect(cover().queryByRole('group', { name: /^Photo/ })).not.toBeInTheDocument()
      await user.click(save())
      await screen.findByText('Page de la recette')
      expect(backend.sent[0]).toMatchObject({
        coverPictures: [],
        steps: [{ pictures: [{ mediaId: 'm-up1' }] }],
      })
    })
  })
})
