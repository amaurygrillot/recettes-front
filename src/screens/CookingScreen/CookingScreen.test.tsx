import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { API_BASE_URL } from '../../api/apiConfig'
import { readCookingStep, saveCookingStep } from '../../app/cookingProgress'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { installMatchMedia, removeMatchMedia } from '../../test/matchMedia'
import { problemResponse } from '../../test/problem'
import { renderRoutes } from '../../test/renderRoutes'
import { server } from '../../test/server'
import { CookingScreen } from './CookingScreen'

const url = `${API_BASE_URL}/recipes/42`

const PHOTO = (id: string) => ({ mediaId: id, altText: null })

function recipe(extra: object = {}) {
  return {
    id: '42',
    title: 'Tarte fine aux pommes',
    recommendations: '<p>Prépare la pâte la veille.</p>',
    coverPictures: [{ mediaId: 'm-cover', altText: 'La tarte entière' }],
    ingredientGroups: [
      {
        title: 'Pour la pâte',
        ingredients: [
          { ingredient: { id: 'a', name: 'farine' }, quantity: 250, unit: { abbreviation: 'g' } },
          {
            ingredient: { id: 'b', name: 'beurre froid' },
            quantity: 125,
            unit: { abbreviation: 'g' },
            note: 'coupé en dés',
          },
          { ingredient: { id: 'c', name: 'œuf' }, quantity: 1 },
        ],
      },
      {
        title: 'Pour la garniture',
        ingredients: [
          { ingredient: { id: 'd', name: 'pommes' }, quantity: 4 },
          {
            ingredient: { id: 'e', name: 'sucre' },
            quantity: 2,
            unit: { abbreviation: 'c. à soupe' },
          },
          { ingredient: { id: 'f', name: 'Sel' } },
        ],
      },
    ],
    steps: [
      { instruction: '<p>Préchauffe le four à 200 °C.</p>' },
      { instruction: '<p>Ajoute l’œuf.</p>', pictures: [PHOTO('m-1')] },
      {
        instruction: '<p>Épluche les pommes.</p>',
        pictures: [PHOTO('m-2'), PHOTO('m-3'), PHOTO('m-4')],
      },
    ],
    ...extra,
  }
}

function stepsOf(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    instruction: `<p>Instruction numéro ${index + 1}.</p>`,
  }))
}

function renderCooking(body: object = recipe(), path = '/recettes/42/pas-a-pas') {
  server.use(http.get(url, () => HttpResponse.json(body)))
  return renderRoutes(
    [
      { path: '/recettes/:id/pas-a-pas', element: <CookingScreen /> },
      { path: '/recettes/:id', element: <p>Page de la recette</p> },
      { path: '/rechercher', element: <p>Page de recherche</p> },
    ],
    path,
  )
}

const next = () => screen.getByRole('button', { name: /^(Suivant|Terminer)/ })
const previous = () => screen.getByRole('button', { name: 'Précédent' })
const instruction = (text: string) => screen.getByText(text)

describe('CookingScreen', () => {
  beforeEach(() => {
    installMatchMedia(390)
    // Told once: the tests that look at the hint start from a device that never saw it.
    window.localStorage.setItem('recettes.cooking-hint', '1')
  })

  afterEach(() => {
    removeMatchMedia()
    window.localStorage.clear()
    Reflect.deleteProperty(navigator, 'wakeLock')
  })

  describe('before the first step', () => {
    it('shows a wait', async () => {
      server.use(
        http.get(url, async () => {
          await delay(300)
          return HttpResponse.json(recipe())
        }),
      )
      renderRoutes(
        [{ path: '/recettes/:id/pas-a-pas', element: <CookingScreen /> }],
        '/recettes/42/pas-a-pas',
      )

      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(
        await screen.findByRole('heading', { level: 1, name: 'Tarte fine aux pommes' }),
      ).toBeVisible()
    })

    it('says when the recipe does not exist, and leads to the recipes', async () => {
      server.use(http.get(url, () => problemResponse(404)))
      renderRoutes(
        [
          { path: '/recettes/:id/pas-a-pas', element: <CookingScreen /> },
          { path: '/rechercher', element: <p>Page de recherche</p> },
        ],
        '/recettes/42/pas-a-pas',
      )

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

    it('says when the recipe cannot be loaded, and loads it again', async () => {
      server.use(http.get(url, () => problemResponse(500)))
      const user = userEvent.setup()
      renderRoutes(
        [{ path: '/recettes/:id/pas-a-pas', element: <CookingScreen /> }],
        '/recettes/42/pas-a-pas',
      )
      expect(await screen.findByRole('alert')).toBeVisible()

      server.use(http.get(url, () => HttpResponse.json(recipe())))
      await user.click(screen.getByRole('button', { name: 'Réessayer' }))

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Tarte fine aux pommes' }),
      ).toBeVisible()
    })

    it('is never opened for a recipe without a step: it says why and leads back to the recipe', async () => {
      renderCooking(recipe({ steps: [{ instruction: '<p></p>' }] }))

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Pas encore d’étapes' }),
      ).toBeVisible()
      expect(screen.getByRole('link', { name: 'Revenir à la recette' })).toHaveAttribute(
        'href',
        '/recettes/42',
      )
      expect(screen.queryByRole('button', { name: 'Suivant' })).not.toBeInTheDocument()
    })
  })

  describe('a step', () => {
    it('is the whole screen: the title, where the cook is, the stamp, the instruction and the buttons', async () => {
      renderCooking()

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Tarte fine aux pommes' }),
      ).toBeVisible()
      expect(screen.getByText('Étape 1 sur 3')).toBeVisible()
      expect(screen.getByRole('progressbar', { name: 'Étape 1 sur 3' })).toHaveAttribute(
        'aria-valuenow',
        '1',
      )
      expect(screen.getByText('ÉTAPE')).toBeInTheDocument()
      expect(instruction('Préchauffe le four à 200 °C.')).toBeVisible()
      expect(screen.getByRole('button', { name: 'Quitter' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Ingrédients' })).toBeVisible()
    })

    it('goes forward and back with the buttons, the first having no way back', async () => {
      const user = userEvent.setup()
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')
      expect(previous()).toBeDisabled()

      await user.click(next())
      expect(instruction('Ajoute l’œuf.')).toBeVisible()
      expect(screen.getByText('Étape 2 sur 3')).toBeVisible()
      expect(previous()).toBeEnabled()

      await user.click(previous())
      expect(instruction('Préchauffe le four à 200 °C.')).toBeVisible()
    })

    it('says « Terminer » on the last step', async () => {
      const user = userEvent.setup()
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')

      await user.click(next())
      await user.click(next())

      expect(screen.getByRole('button', { name: 'Terminer' })).toBeVisible()
      expect(screen.queryByRole('button', { name: 'Suivant' })).not.toBeInTheDocument()
    })

    it('has no progress and no way back for a recipe with a single step: only « Terminer »', async () => {
      renderCooking(recipe({ steps: stepsOf(1) }))

      await screen.findByText('Instruction numéro 1.')

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Précédent' })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Terminer' })).toBeVisible()
    })

    it('has a segment for each step up to twelve, the current one marked', async () => {
      renderCooking(recipe({ steps: stepsOf(12) }))
      await screen.findByText('Instruction numéro 1.')

      const bar = screen.getByRole('progressbar', { name: 'Étape 1 sur 12' })

      expect(bar.children).toHaveLength(12)
      expect(bar.querySelector('[aria-current="step"]')).toBe(bar.children[0])
    })

    it('has a thin continuous bar from thirteen steps on', async () => {
      const user = userEvent.setup()
      renderCooking(recipe({ steps: stepsOf(24) }))
      await screen.findByText('Instruction numéro 1.')
      for (let count = 0; count < 16; count += 1) await user.click(next())

      const bar = screen.getByRole('progressbar', { name: 'Étape 17 sur 24' })

      expect(bar).toHaveAttribute('aria-valuenow', '70.83333333333334')
      expect(bar.children).toHaveLength(1)
    })

    it('shows the photo of a step as one large frame, and opens it in the viewer', async () => {
      const user = userEvent.setup()
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')
      await user.click(next())

      await user.click(screen.getByRole('button', { name: 'Agrandir la photo' }))

      expect(await screen.findByRole('dialog', { name: 'Photo 1 sur 1' })).toBeVisible()
    })

    it('shows several photos as a row and opens the one that is touched', async () => {
      const user = userEvent.setup()
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')
      await user.click(next())
      await user.click(next())

      await user.click(screen.getByRole('button', { name: 'Agrandir la photo 2 sur 3' }))

      expect(await screen.findByRole('dialog', { name: 'Photo 2 sur 3' })).toBeVisible()
      expect(screen.getByText('2 / 3')).toBeVisible()
    })

    it('has no accessibility violation', async () => {
      const { container } = renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')

      await expectNoAccessibilityViolations(container)
    })
  })

  describe('changing step', () => {
    it('follows a swipe of the finger, to the left for the next and to the right for the previous', async () => {
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')
      const reading = screen.getByRole('region', { name: 'Étape 1 sur 3' })

      fireEvent.pointerDown(reading, { clientX: 300, clientY: 400, pointerType: 'touch' })
      fireEvent.pointerUp(reading, { clientX: 100, clientY: 410, pointerType: 'touch' })
      expect(instruction('Ajoute l’œuf.')).toBeVisible()

      fireEvent.pointerDown(reading, { clientX: 100, clientY: 400, pointerType: 'touch' })
      fireEvent.pointerUp(reading, { clientX: 300, clientY: 400, pointerType: 'touch' })
      expect(instruction('Préchauffe le four à 200 °C.')).toBeVisible()
    })

    it('does not take scrolling for a swipe', async () => {
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')
      const reading = screen.getByRole('region', { name: 'Étape 1 sur 3' })

      fireEvent.pointerDown(reading, { clientX: 300, clientY: 700, pointerType: 'touch' })
      fireEvent.pointerUp(reading, { clientX: 250, clientY: 300, pointerType: 'touch' })

      expect(instruction('Préchauffe le four à 200 °C.')).toBeVisible()
    })

    it('follows the arrow keys', async () => {
      const user = userEvent.setup()
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')

      await user.keyboard('{ArrowRight}')
      expect(instruction('Ajoute l’œuf.')).toBeVisible()
      await user.keyboard('{ArrowLeft}')
      expect(instruction('Préchauffe le four à 200 °C.')).toBeVisible()
    })

    it('does not go before the first step', async () => {
      const user = userEvent.setup()
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')

      await user.keyboard('{ArrowLeft}')

      expect(screen.getByText('Étape 1 sur 3')).toBeVisible()
    })
  })

  describe('where the cook is', () => {
    it('is remembered from the second step, for « Reprendre à l’étape 2 »', async () => {
      const user = userEvent.setup()
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')
      expect(readCookingStep('42')).toBeUndefined()

      await user.click(next())

      expect(readCookingStep('42')).toBe(2)
    })

    it('is taken up again where it was left', async () => {
      saveCookingStep('42', 2)
      renderCooking()

      expect(await screen.findByText('Étape 2 sur 3')).toBeVisible()
      expect(instruction('Ajoute l’œuf.')).toBeVisible()
    })

    it('never goes past the last step, even if the recipe has lost some since', async () => {
      saveCookingStep('42', 9)
      renderCooking()

      expect(await screen.findByText('Étape 3 sur 3')).toBeVisible()
    })

    it('is forgotten when the cook comes back to the first step', async () => {
      const user = userEvent.setup()
      saveCookingStep('42', 2)
      renderCooking()
      await screen.findByText('Étape 2 sur 3')

      await user.click(previous())

      expect(readCookingStep('42')).toBeUndefined()
    })
  })

  describe('the ingredients on a phone', () => {
    async function openSheet(user: ReturnType<typeof userEvent.setup>) {
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')
      await user.click(screen.getByRole('button', { name: 'Ingrédients' }))
      return screen.findByRole('dialog', { name: 'Ingrédients' })
    }

    it('opens in a sheet, in their groups, nothing ticked', async () => {
      const sheet = within(await openSheet(userEvent.setup()))

      expect(sheet.getByText('0 sur 6 prêts')).toBeVisible()
      expect(sheet.getByRole('heading', { level: 3, name: 'Pour la pâte' })).toBeVisible()
      expect(sheet.getByRole('heading', { level: 3, name: 'Pour la garniture' })).toBeVisible()
      expect(sheet.getAllByRole('checkbox')).toHaveLength(6)
      expect(sheet.getByRole('checkbox', { name: /farine/ })).not.toBeChecked()
    })

    it('counts what is ready, in the sheet and on the button under it, and keeps it', async () => {
      const user = userEvent.setup()
      const sheet = within(await openSheet(user))

      await user.click(sheet.getByRole('checkbox', { name: /farine/ }))
      await user.click(sheet.getByRole('checkbox', { name: /Sel/ }))

      expect(sheet.getByText('2 sur 6 prêts')).toBeVisible()
      // The sheet has a cross at its top and the action of its foot, both named « Fermer »: the foot's is the last.
      const closeAction = sheet.getAllByRole('button', { name: 'Fermer' }).at(-1)
      if (closeAction === undefined) throw new Error('The sheet has no way to close')
      await user.click(closeAction)
      expect(
        await screen.findByRole('button', { name: /Ingrédients.*2 sur 6 prêts/ }),
      ).toBeVisible()

      await user.click(next())
      await user.click(screen.getByRole('button', { name: /Ingrédients/ }))
      const again = within(await screen.findByRole('dialog', { name: 'Ingrédients' }))
      expect(again.getByRole('checkbox', { name: /farine/ })).toBeChecked()
      expect(again.getByRole('checkbox', { name: /beurre froid/ })).not.toBeChecked()
    })

    it('unticks a line that is touched again', async () => {
      const user = userEvent.setup()
      const sheet = within(await openSheet(user))
      const line = sheet.getByRole('checkbox', { name: /œuf/ })

      await user.click(line)
      await user.click(line)

      expect(line).not.toBeChecked()
      expect(sheet.getByText('0 sur 6 prêts')).toBeVisible()
    })

    it('closes with Escape, the step being still there', async () => {
      const user = userEvent.setup()
      await openSheet(user)

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: 'Ingrédients' })).not.toBeInTheDocument()
      })
      expect(instruction('Préchauffe le four à 200 °C.')).toBeVisible()
    })

    it('leaves the arrow keys to the sheet while it is open', async () => {
      const user = userEvent.setup()
      await openSheet(user)

      await user.keyboard('{ArrowRight}')

      expect(screen.getByText('Étape 1 sur 3')).toBeInTheDocument()
    })

    it('has no accessibility violation once open', async () => {
      await openSheet(userEvent.setup())

      await expectNoAccessibilityViolations(document.body)
    })
  })

  describe('the ingredients on a tablet and a desktop', () => {
    beforeEach(() => {
      installMatchMedia(1280)
    })

    it('are a panel at the side, opened from the top, with the step still there', async () => {
      const user = userEvent.setup()
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')
      expect(screen.queryByRole('complementary', { name: 'Ingrédients' })).not.toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Ingrédients' }))

      const panel = within(screen.getByRole('complementary', { name: 'Ingrédients' }))
      expect(panel.getByText('0 sur 6 prêts')).toBeVisible()
      expect(instruction('Préchauffe le four à 200 °C.')).toBeVisible()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('count what is ready beside the button, and the panel closes with its cross', async () => {
      const user = userEvent.setup()
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')
      await user.click(screen.getByRole('button', { name: 'Ingrédients' }))

      await user.click(
        within(screen.getByRole('complementary')).getByRole('checkbox', { name: /pommes/ }),
      )
      expect(screen.getByRole('button', { name: /Ingrédients.*1 sur 6/ })).toBeVisible()
      await user.click(screen.getByRole('button', { name: 'Fermer le panneau' }))

      expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    })

    it('keep the arrow keys for the steps even with the panel open', async () => {
      const user = userEvent.setup()
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')
      await user.click(screen.getByRole('button', { name: 'Ingrédients' }))

      await user.keyboard('{ArrowRight}')

      expect(instruction('Ajoute l’œuf.')).toBeVisible()
    })

    it('say what the keys do from a desktop', async () => {
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')

      expect(screen.getByText('Échap')).toBeInTheDocument()
    })

    it('put the progress in the column of the step, and the ingredients in the header', async () => {
      installMatchMedia(768)
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')

      expect(screen.getByRole('progressbar', { name: 'Étape 1 sur 3' })).toBeVisible()
      expect(screen.queryByText('Échap')).not.toBeInTheDocument()
    })
  })

  describe('leaving', () => {
    it('asks first, and the first answer is to stay', async () => {
      const user = userEvent.setup()
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')

      await user.click(screen.getByRole('button', { name: 'Quitter' }))

      const question = screen.getByRole('alertdialog', { name: 'Quitter le pas à pas ?' })
      expect(question).toHaveTextContent('Tu pourras reprendre là où tu t’es arrêté.')
      expect(within(question).getByRole('button', { name: 'Rester' })).toHaveFocus()
      await user.click(within(question).getByRole('button', { name: 'Rester' }))
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })

    it('goes back to the recipe when that is chosen, keeping the step', async () => {
      const user = userEvent.setup()
      const { router } = renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')
      await user.click(next())

      await user.click(screen.getByRole('button', { name: 'Quitter' }))
      await user.click(
        within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Quitter' }),
      )

      expect(await screen.findByText('Page de la recette')).toBeVisible()
      expect(router.state.location.pathname).toBe('/recettes/42')
      expect(readCookingStep('42')).toBe(2)
    })

    it('asks with Escape too, and does not move on with the arrows meanwhile', async () => {
      const user = userEvent.setup()
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')

      await user.keyboard('{Escape}')
      expect(screen.getByRole('alertdialog', { name: 'Quitter le pas à pas ?' })).toBeVisible()
      await user.keyboard('{ArrowRight}')

      expect(screen.getByText('Étape 1 sur 3')).toBeInTheDocument()
    })
  })

  describe('the end', () => {
    async function cookToTheEnd(body: object = recipe()) {
      const user = userEvent.setup()
      renderCooking(body)
      await screen.findByText('Préchauffe le four à 200 °C.')
      await user.click(next())
      await user.click(next())
      await user.click(next())
      return user
    }

    it('says « Bon appétit ! » with what was cooked, and puts the focus on it', async () => {
      await cookToTheEnd()

      const title = await screen.findByRole('heading', { level: 1, name: /Bon appétit/ })
      expect(title).toHaveFocus()
      expect(
        screen.getByText('Tu as fini les 3 étapes de « Tarte fine aux pommes ».'),
      ).toBeVisible()
      expect(screen.getByRole('img', { name: 'La tarte entière' })).toBeVisible()
    })

    it('shows the cook’s tip when the recipe has one', async () => {
      await cookToTheEnd()

      const tip = await screen.findByRole('complementary', { name: 'Le petit conseil' })

      expect(tip).toHaveTextContent('Prépare la pâte la veille.')
    })

    it('has no frame at all for a recipe without a tip', async () => {
      await cookToTheEnd(recipe({ recommendations: null }))

      await screen.findByRole('heading', { name: /Bon appétit/ })

      expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    })

    it('has a stamp, and no photo, for a recipe without a cover', async () => {
      await cookToTheEnd(recipe({ coverPictures: [] }))

      await screen.findByRole('heading', { name: /Bon appétit/ })

      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('leads back to the recipe, or to the recipes, and forgets the step', async () => {
      await cookToTheEnd()

      expect(await screen.findByRole('link', { name: 'Revenir à la recette' })).toHaveAttribute(
        'href',
        '/recettes/42',
      )
      expect(screen.getByRole('link', { name: 'Retour aux recettes' })).toHaveAttribute(
        'href',
        '/rechercher',
      )
      expect(readCookingStep('42')).toBeUndefined()
    })

    it('says it in the singular for a single step', async () => {
      const user = userEvent.setup()
      renderCooking(recipe({ steps: stepsOf(1) }))
      await screen.findByText('Instruction numéro 1.')

      await user.click(next())

      expect(
        await screen.findByText('Tu as fini l’unique étape de « Tarte fine aux pommes ».'),
      ).toBeVisible()
    })

    it('has no accessibility violation', async () => {
      await cookToTheEnd()
      await screen.findByRole('heading', { name: /Bon appétit/ })

      await expectNoAccessibilityViolations(document.body)
    })
  })

  describe('the swipe hint', () => {
    beforeEach(() => {
      window.localStorage.removeItem('recettes.cooking-hint')
    })

    it('is told the first time, and goes away when the step changes, for good', async () => {
      const user = userEvent.setup()
      renderCooking()
      expect(await screen.findByText('Glisse pour changer d’étape')).toBeVisible()

      await user.click(next())

      expect(screen.queryByText('Glisse pour changer d’étape')).not.toBeInTheDocument()
      expect(window.localStorage.getItem('recettes.cooking-hint')).not.toBeNull()
    })

    it('is not told on a desktop, where nothing is swiped', async () => {
      installMatchMedia(1280)
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')

      expect(screen.queryByText('Glisse pour changer d’étape')).not.toBeInTheDocument()
    })

    it('is not told again on a device that has seen it', async () => {
      window.localStorage.setItem('recettes.cooking-hint', '1')
      renderCooking()
      await screen.findByText('Préchauffe le four à 200 °C.')

      expect(screen.queryByText('Glisse pour changer d’étape')).not.toBeInTheDocument()
    })
  })

  describe('the screen', () => {
    it('is kept on while cooking, and let go at the end', async () => {
      const release = vi.fn(() => Promise.resolve())
      const request = vi.fn(() => Promise.resolve({ release }))
      Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request } })
      const user = userEvent.setup()
      renderCooking(recipe({ steps: stepsOf(1) }))
      await screen.findByText('Instruction numéro 1.')
      await waitFor(() => {
        expect(request).toHaveBeenCalledWith('screen')
      })

      await user.click(next())

      await waitFor(() => {
        expect(release).toHaveBeenCalled()
      })
    })

    it('starts again from its own step when the address is another recipe’s', async () => {
      saveCookingStep('42', 3)
      const { router } = renderCooking()
      await screen.findByText('Étape 3 sur 3')
      server.use(
        http.get(`${API_BASE_URL}/recipes/43`, () =>
          HttpResponse.json(recipe({ id: '43', title: 'Gratin', steps: stepsOf(4) })),
        ),
      )

      await act(() => router.navigate('/recettes/43/pas-a-pas'))

      expect(await screen.findByText('Étape 1 sur 4')).toBeVisible()
      expect(screen.getByRole('heading', { level: 1, name: 'Gratin' })).toBeVisible()
    })
  })
})
