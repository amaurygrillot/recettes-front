import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { sessionStore } from '../api/sessionStore'
import { expectNoAccessibilityViolations } from '../test/expectNoAccessibilityViolations'
import { fakeToken } from '../test/fakeToken'
import { serveBackend } from '../test/fakeRecipeBackend'
import { installMatchMedia, removeMatchMedia } from '../test/matchMedia'
import { renderRoutes } from '../test/renderRoutes'
import { routes } from './router'

const overlay = () => screen.findByRole('dialog', { name: 'Rechercher' })
const textField = () => screen.getByRole('searchbox', { name: 'Chercher une recette' })
const searchButton = () => screen.getByRole('button', { name: 'Rechercher' })
/** The field of the page behind: the home page's, the results page's, the bar's. */
const pageField = () => screen.getByRole('button', { name: /^Chercher une recette/ })

function location(router: { state: { location: { pathname: string; search: string } } }) {
  return router.state.location.pathname + router.state.location.search
}

describe('the search over the page', () => {
  afterEach(removeMatchMedia)

  describe('from the home page, on a phone', () => {
    it('opens empty, with the keyboard ready, and leads to the results of what is validated', async () => {
      serveBackend()
      const user = userEvent.setup()
      const { router } = renderRoutes(routes, '/')
      await screen.findByRole('link', { name: 'Recette 1' })

      await user.click(pageField())
      await overlay()
      expect(textField()).toHaveValue('')
      expect(textField()).toHaveFocus()
      expect(searchButton()).toBeDisabled()
      await user.type(textField(), 'tarte{Enter}')

      await waitFor(() => {
        expect(location(router)).toBe('/rechercher?q=tarte')
      })
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(await screen.findByRole('link', { name: 'Recette 1' })).toBeVisible()
    })

    it('adds the results to the history, so « back » returns to the page the search was opened from', async () => {
      serveBackend()
      const user = userEvent.setup()
      const { router } = renderRoutes(routes, '/')
      await user.click(await screen.findByRole('button', { name: /^Chercher une recette/ }))
      await overlay()
      await user.type(textField(), 'tarte')
      await user.click(searchButton())
      await waitFor(() => {
        expect(location(router)).toBe('/rechercher?q=tarte')
      })

      await act(() => router.navigate(-1))

      expect(location(router)).toBe('/')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('changes nothing when it is closed, whatever was typed, and gives the focus back', async () => {
      serveBackend()
      const user = userEvent.setup()
      const { router } = renderRoutes(routes, '/')
      await user.click(await screen.findByRole('button', { name: /^Chercher une recette/ }))
      await overlay()
      await user.type(textField(), 'tarte')

      await user.keyboard('{Escape}')

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(location(router)).toBe('/')
      await waitFor(() => {
        expect(pageField()).toHaveFocus()
      })
    })

    it('opens empty again after being closed, not on the draft that was dropped', async () => {
      serveBackend()
      const user = userEvent.setup()
      renderRoutes(routes, '/')
      await user.click(await screen.findByRole('button', { name: /^Chercher une recette/ }))
      await overlay()
      await user.type(textField(), 'tarte')
      await user.keyboard('{Escape}')

      await user.click(pageField())
      await overlay()

      expect(textField()).toHaveValue('')
    })

    it('has no accessibility violation while it is open', async () => {
      serveBackend()
      const user = userEvent.setup()
      renderRoutes(routes, '/')
      await user.click(await screen.findByRole('button', { name: /^Chercher une recette/ }))
      const sheet = await overlay()
      await within(sheet).findByRole('radio', { name: 'Plats' })

      await expectNoAccessibilityViolations(sheet)
    })
  })

  describe('from the « Rechercher » tab of a phone', () => {
    it('opens over any page and leaves it where it is', async () => {
      serveBackend()
      const user = userEvent.setup()
      const { router } = renderRoutes(routes, '/rechercher?q=tarte')
      await screen.findByRole('link', { name: 'Recette 1' })
      const tabs = screen.getByRole('navigation', { name: 'Navigation principale' })
      const tab = within(tabs).getByRole('button', { name: 'Rechercher' })
      expect(tab).toHaveAttribute('aria-current', 'page')

      await user.click(tab)

      await overlay()
      expect(location(router)).toBe('/rechercher?q=tarte')
    })

    it('is not the current tab on another page', async () => {
      serveBackend()
      renderRoutes(routes, '/')
      await screen.findByRole('link', { name: 'Recette 1' })

      const tabs = screen.getByRole('navigation', { name: 'Navigation principale' })
      expect(within(tabs).getByRole('button', { name: 'Rechercher' })).not.toHaveAttribute(
        'aria-current',
      )
    })
  })

  describe('from a results page', () => {
    it('starts from the criteria of the page, and replaces the page with the new results', async () => {
      serveBackend()
      const user = userEvent.setup()
      const { router } = renderRoutes(routes, '/')
      await act(() => router.navigate('/rechercher?q=tarte&categorie=plats&tri=titre-az'))
      await user.click(await screen.findByRole('button', { name: /^Chercher une recette/ }))
      const sheet = await overlay()
      expect(textField()).toHaveValue('tarte')
      expect(await within(sheet).findByRole('radio', { name: 'Plats' })).toBeChecked()

      await user.clear(textField())
      await user.type(textField(), 'gratin{Enter}')

      await waitFor(() => {
        expect(location(router)).toBe('/rechercher?q=gratin&categorie=plats&tri=titre-az')
      })
      // The results replaced the previous ones: one « back » leaves the search, it does not walk through it.
      await act(() => router.navigate(-1))
      expect(location(router)).toBe('/')
    })

    it('opens from « Filtres » on the filters, with no keyboard to hide them', async () => {
      serveBackend()
      const user = userEvent.setup()
      renderRoutes(routes, '/rechercher?q=tarte&tag=t-four')
      await user.click(await screen.findByRole('button', { name: 'Filtres, 1 actif' }))

      const sheet = await overlay()

      expect(within(sheet).getByRole('heading', { name: 'Rechercher' })).toHaveFocus()
      expect(await within(sheet).findByRole('button', { name: 'Four' })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
    })

    it('opens from the invitation shown when nothing is left to search for', async () => {
      serveBackend()
      const user = userEvent.setup()
      renderRoutes(routes, '/rechercher')

      await user.click(await screen.findByRole('button', { name: 'Lancer une recherche' }))

      await overlay()
      expect(textField()).toHaveFocus()
    })

    it('carries a key typed on the field into the text, after the word already there', async () => {
      serveBackend()
      const user = userEvent.setup()
      renderRoutes(routes, '/rechercher?q=tart')
      await screen.findByRole('link', { name: 'Recette 1' })
      pageField().focus()

      await user.keyboard('e')

      await overlay()
      expect(textField()).toHaveValue('tarte')
    })
  })

  describe('from « Mes recettes »', () => {
    it('has no author field, searches with nothing typed, and stays in « Mes recettes »', async () => {
      expect(sessionStore.signIn(fakeToken({ userId: 'u-42' }))).toBe(true)
      serveBackend()
      const user = userEvent.setup()
      const { router } = renderRoutes(routes, '/mes-recettes?q=tarte')
      await user.click(await screen.findByRole('button', { name: /^Chercher une recette/ }))
      const sheet = await overlay()
      await within(sheet).findByRole('button', { name: 'Four' })
      expect(within(sheet).queryByLabelText("Nom de l'auteur")).not.toBeInTheDocument()

      await user.clear(textField())
      expect(searchButton()).toBeEnabled()
      await user.click(searchButton())

      await waitFor(() => {
        expect(location(router)).toBe('/mes-recettes')
      })
    })

    it('does not search « Mes recettes » when it is opened from anywhere else', async () => {
      expect(sessionStore.signIn(fakeToken())).toBe(true)
      serveBackend()
      const user = userEvent.setup()
      const { router } = renderRoutes(routes, '/')
      await user.click(await screen.findByRole('button', { name: /^Chercher une recette/ }))
      await overlay()
      await user.type(textField(), 'tarte{Enter}')

      await waitFor(() => {
        expect(location(router)).toBe('/rechercher?q=tarte')
      })
    })
  })

  describe('on a tablet', () => {
    it('has no « Rechercher » tab, and a header with the field on the pages that have none of their own', async () => {
      installMatchMedia(768)
      serveBackend()
      const user = userEvent.setup()
      renderRoutes(routes, '/nulle-part')
      await screen.findByRole('heading', { name: "Cette page n'existe pas" })

      const tabs = screen.getByRole('navigation', { name: 'Navigation principale' })
      expect(within(tabs).queryByRole('button', { name: 'Rechercher' })).not.toBeInTheDocument()
      expect(within(tabs).queryByRole('link', { name: 'Rechercher' })).not.toBeInTheDocument()
      const header = screen.getByRole('banner')
      expect(within(header).getByRole('link', { name: /retour à l'accueil/ })).toBeVisible()

      await user.click(within(header).getByRole('button', { name: /^Chercher une recette/ }))

      const panel = await overlay()
      expect(textField()).toHaveFocus()
      expect(panel).toBeVisible()
    })

    it.each([
      ['the home page', '/'],
      ['the results', '/rechercher?q=tarte'],
      ['« Mes recettes »', '/mes-recettes'],
    ])('has no header on %s, which have a field of their own', async (_page, path) => {
      installMatchMedia(768)
      expect(sessionStore.signIn(fakeToken())).toBe(true)
      serveBackend()
      renderRoutes(routes, path)
      await screen.findByRole('link', { name: 'Recette 1' })

      expect(screen.queryByRole('banner')).not.toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: /^Chercher une recette/ })).toHaveLength(1)
    })
  })

  describe('on a desktop', () => {
    it('has the field in the bar and no « Rechercher » link; a key typed on it opens the panel with that key', async () => {
      installMatchMedia(1280)
      serveBackend()
      const user = userEvent.setup()
      renderRoutes(routes, '/')
      await screen.findByRole('link', { name: 'Recette 1' })
      const bar = screen.getByRole('navigation', { name: 'Navigation principale, ordinateur' })
      expect(within(bar).queryByRole('link', { name: 'Rechercher' })).not.toBeInTheDocument()
      within(bar)
        .getByRole('button', { name: /^Chercher une recette/ })
        .focus()

      await user.keyboard('t')

      const panel = await overlay()
      expect(textField()).toHaveValue('t')
      expect(textField()).toHaveFocus()
      expect(
        within(panel).queryByRole('button', { name: 'Glisser vers le bas pour fermer' }),
      ).not.toBeInTheDocument()
    })

    it('shows the word searched in the bar of a results page, and clears it in place', async () => {
      installMatchMedia(1280)
      serveBackend()
      const user = userEvent.setup()
      const { router } = renderRoutes(routes, '/rechercher?q=tarte&tag=t-four')
      await screen.findByRole('link', { name: 'Recette 1' })
      const bar = screen.getByRole('navigation', { name: 'Navigation principale, ordinateur' })
      expect(
        within(bar).getByRole('button', { name: 'Chercher une recette : tarte' }),
      ).toBeVisible()

      await user.click(within(bar).getByRole('button', { name: 'Effacer la recherche' }))

      expect(location(router)).toBe('/rechercher?tag=t-four')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
