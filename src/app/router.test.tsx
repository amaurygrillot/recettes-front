import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { API_BASE_URL } from '../api/apiConfig'
import { sessionStore } from '../api/sessionStore'
import { expectNoAccessibilityViolations } from '../test/expectNoAccessibilityViolations'
import { fakeToken } from '../test/fakeToken'
import { renderRoutes } from '../test/renderRoutes'
import { server } from '../test/server'
import { routes } from './router'

const phoneBar = () => screen.getByRole('navigation', { name: 'Navigation principale' })
const desktopBar = () =>
  screen.getByRole('navigation', { name: 'Navigation principale, ordinateur' })

function signIn(options: Parameters<typeof fakeToken>[0] = {}) {
  expect(sessionStore.signIn(fakeToken(options))).toBe(true)
}

function labelsOf(bar: HTMLElement): (string | null)[] {
  return within(bar)
    .getAllByRole('link')
    .map((link) => link.textContent)
}

// The home page asks the back end for its feed and its categories; these tests are about routing.
function serveRecipes(content: object[]) {
  server.use(
    http.get(`${API_BASE_URL}/recipes`, () =>
      HttpResponse.json({ content, number: 0, last: true, totalElements: content.length }),
    ),
    http.get(`${API_BASE_URL}/categories`, () => HttpResponse.json([])),
    http.get(`${API_BASE_URL}/categories/hierarchy`, () => HttpResponse.json([])),
    http.get(`${API_BASE_URL}/tags`, () => HttpResponse.json([])),
  )
}

// Whatever the page, the back end has nothing to say unless a test says otherwise.
beforeEach(() => {
  serveRecipes([])
})

describe('the pages with navigation', () => {
  it.each([
    ['/', 'Il en reste un peu'],
    ['/rechercher', 'Rechercher'],
    ['/recettes/42', 'Recette'],
  ])('serves %s to a visitor, with the navigation around it', async (path, title) => {
    const { container } = renderRoutes(routes, path)

    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeVisible()
    expect(phoneBar()).toBeInTheDocument()
    expect(desktopBar()).toBeInTheDocument()
    await expectNoAccessibilityViolations(container)
  })

  it('gives a visitor three tabs and no way to create', async () => {
    renderRoutes(routes, '/')
    await screen.findByRole('heading', { level: 1 })

    expect(labelsOf(phoneBar())).toEqual(['Accueil', 'Rechercher', 'Se connecter'])
    expect(screen.queryByRole('link', { name: 'Nouvelle recette' })).not.toBeInTheDocument()
  })

  it('gives a member four tabs, and two ways to create: the « + » on a phone, a button on a desktop', async () => {
    serveRecipes([{ id: '1', title: 'Gratin dauphinois' }])
    signIn()
    renderRoutes(routes, '/')
    await screen.findByRole('link', { name: 'Gratin dauphinois' })

    expect(labelsOf(phoneBar())).toEqual(['Accueil', 'Rechercher', 'Mes recettes', 'Compte'])
    // CSS shows the « + » below 1024 px and the button above; neither exists in jsdom's layout.
    const creates = screen.getAllByRole('link', { name: 'Nouvelle recette' })
    expect(creates).toHaveLength(2)
    creates.forEach((link) => {
      expect(link).toHaveAttribute('href', '/recettes/nouvelle')
    })
    expect(within(desktopBar()).queryByRole('link', { name: 'Nouvelle recette' })).toBeNull()
  })

  it('marks the tab of the page you are on', async () => {
    signIn()
    renderRoutes(routes, '/mes-recettes')
    await screen.findByRole('heading', { level: 1, name: 'Mes recettes' })

    const current = within(phoneBar())
      .getAllByRole('link')
      .filter((link) => link.ariaCurrent === 'page')
    expect(current.map((link) => link.textContent)).toEqual(['Mes recettes'])
  })

  it('does not offer to create to a member without the USER role', async () => {
    serveRecipes([{ id: '1', title: 'Gratin dauphinois' }])
    signIn({ roles: [] })
    renderRoutes(routes, '/')
    await screen.findByRole('link', { name: 'Gratin dauphinois' })

    expect(screen.queryByRole('link', { name: 'Nouvelle recette' })).not.toBeInTheDocument()
  })

  it('moves between pages with the tabs', async () => {
    renderRoutes(routes, '/')
    await screen.findByRole('heading', { level: 1 })

    await userEvent.setup().click(within(phoneBar()).getByRole('link', { name: 'Rechercher' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Rechercher' })).toBeVisible()
  })

  it('shows an unknown address as a page that does not exist, still with the navigation', async () => {
    renderRoutes(routes, '/nulle-part')

    expect(await screen.findByRole('heading', { name: "Cette page n'existe pas" })).toBeVisible()
    expect(phoneBar()).toBeInTheDocument()
  })
})

describe('the style guide', () => {
  it('is served at /styleguide in development, with no navigation', async () => {
    renderRoutes(routes, '/styleguide')

    expect(await screen.findByRole('heading', { level: 1, name: 'Guide de style' })).toBeVisible()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
})

describe('the full-screen pages', () => {
  it.each([
    ['/inscription', 'Créer un compte'],
    ['/mot-de-passe-oublie', 'Mot de passe oublié'],
    ['/reset-password', 'Nouveau mot de passe'],
    ['/recettes/42/pas-a-pas', 'Pas à pas'],
  ])('serves %s with no navigation', async (path, title) => {
    renderRoutes(routes, path)

    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeVisible()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('keeps the query of the password-reset link the back end writes in its e-mails', async () => {
    const { router } = renderRoutes(routes, '/reset-password?token=abc&email=camille%40example.org')
    await screen.findByRole('heading', { level: 1, name: 'Nouveau mot de passe' })

    expect(router.state.location.search).toBe('?token=abc&email=camille%40example.org')
  })
})

describe('a page that needs a login', () => {
  it.each([
    ['/mes-recettes', '/connexion?retour=%2Fmes-recettes'],
    ['/compte', '/connexion?retour=%2Fcompte'],
    ['/recettes/nouvelle', '/connexion?retour=%2Frecettes%2Fnouvelle'],
    ['/recettes/42/modifier', '/connexion?retour=%2Frecettes%2F42%2Fmodifier'],
  ])('sends a visitor from %s to the login, remembering the way back', async (path, login) => {
    const { router } = renderRoutes(routes, path)

    expect(await screen.findByRole('heading', { level: 1, name: 'Se connecter' })).toBeVisible()
    expect(router.state.location.pathname + router.state.location.search).toBe(login)
  })

  it.each([
    ['/mes-recettes', 'Mes recettes'],
    ['/compte', 'Compte'],
    ['/recettes/nouvelle', 'Nouvelle recette'],
    ['/recettes/42/modifier', 'Modifier la recette'],
  ])('lets a member into %s', async (path, title) => {
    signIn()
    renderRoutes(routes, path)

    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeVisible()
  })

  it('brings the visitor back to the page they asked for once logged in', async () => {
    server.use(
      http.post(`${API_BASE_URL}/auth/login`, () =>
        HttpResponse.text(fakeToken({ username: 'camille' })),
      ),
    )
    const user = userEvent.setup()
    const { router } = renderRoutes(routes, '/mes-recettes?tri=recent')
    await screen.findByRole('heading', { level: 1, name: 'Se connecter' })

    await user.type(screen.getByLabelText("Nom d'utilisateur"), 'camille')
    await user.type(screen.getByLabelText('Mot de passe'), 'a-long-password')
    await user.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Mes recettes' })).toBeVisible()
    expect(router.state.location.pathname + router.state.location.search).toBe(
      '/mes-recettes?tri=recent',
    )
    expect(phoneBar()).toBeInTheDocument()
  })

  it('goes to the home page after a login that was not asked for by a page', async () => {
    serveRecipes([])
    server.use(http.post(`${API_BASE_URL}/auth/login`, () => HttpResponse.text(fakeToken())))
    const user = userEvent.setup()
    renderRoutes(routes, '/connexion')
    await screen.findByRole('heading', { level: 1, name: 'Se connecter' })

    await user.type(screen.getByLabelText("Nom d'utilisateur"), 'camille')
    await user.type(screen.getByLabelText('Mot de passe'), 'a-long-password')
    await user.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Il en reste un peu' }),
    ).toBeVisible()
  })

  it('lets a member log out from the account page and back to a visitor’s navigation', async () => {
    signIn()
    const user = userEvent.setup()
    renderRoutes(routes, '/compte')
    await user.click(await screen.findByRole('button', { name: 'Se déconnecter' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Il en reste un peu' }),
    ).toBeVisible()
    expect(labelsOf(phoneBar())).toEqual(['Accueil', 'Rechercher', 'Se connecter'])
    expect(sessionStore.getToken()).toBeNull()
  })
})

describe('a session that expires', () => {
  it('interrupts the page with a dialog whose one answer is to log in again', async () => {
    signIn()
    renderRoutes(routes, '/mes-recettes')
    await screen.findByRole('heading', { level: 1, name: 'Mes recettes' })

    sessionStore.expire(sessionStore.getToken() ?? '')

    const dialog = await screen.findByRole('alertdialog', { name: 'Ta session a expiré.' })
    expect(within(dialog).getByRole('button', { name: 'Se reconnecter' })).toHaveFocus()
  })

  it('does not take the page away while the dialog is open', async () => {
    signIn()
    renderRoutes(routes, '/recettes/nouvelle')
    await screen.findByRole('heading', { level: 1, name: 'Nouvelle recette' })

    sessionStore.expire(sessionStore.getToken() ?? '')

    await screen.findByRole('alertdialog')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Nouvelle recette', hidden: true }),
    ).toBeInTheDocument()
  })

  it('takes the member to the login with the page they were on as the way back', async () => {
    signIn()
    const user = userEvent.setup()
    const { router } = renderRoutes(routes, '/recettes/42/modifier?etape=3')
    await screen.findByRole('heading', { level: 1, name: 'Modifier la recette' })
    sessionStore.expire(sessionStore.getToken() ?? '')

    await user.click(await screen.findByRole('button', { name: 'Se reconnecter' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Se connecter' })).toBeVisible()
    expect(router.state.location.search).toBe('?retour=%2Frecettes%2F42%2Fmodifier%3Fetape%3D3')
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })
})
