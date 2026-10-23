import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { API_BASE_URL } from '../../api/apiConfig'
import { sessionStore } from '../../api/sessionStore'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { fakeToken } from '../../test/fakeToken'
import { problemResponse } from '../../test/problem'
import { renderRoutes } from '../../test/renderRoutes'
import { server } from '../../test/server'
import { LoginScreen } from './LoginScreen'

const loginUrl = `${API_BASE_URL}/auth/login`

function renderLogin(path = '/connexion') {
  return renderRoutes(
    [
      { path: '/connexion', element: <LoginScreen /> },
      { path: '/', element: <p>Page d’accueil</p> },
      { path: '/mes-recettes', element: <p>Page des recettes</p> },
    ],
    path,
  )
}

async function fillAndSubmit(username: string, password: string) {
  const user = userEvent.setup()
  if (username) await user.type(screen.getByLabelText("Nom d'utilisateur"), username)
  if (password) await user.type(screen.getByLabelText('Mot de passe'), password)
  await user.click(screen.getByRole('button', { name: 'Se connecter' }))
  return user
}

describe('LoginScreen', () => {
  it('asks for a username and a password, and has a way to reset or register', () => {
    renderLogin()

    expect(screen.getByRole('heading', { level: 1, name: 'Se connecter' })).toBeVisible()
    expect(screen.getByLabelText("Nom d'utilisateur")).toHaveAttribute('autocomplete', 'username')
    expect(screen.getByLabelText('Mot de passe')).toHaveAttribute('type', 'password')
    expect(screen.getByRole('link', { name: 'Mot de passe oublié ?' })).toHaveAttribute(
      'href',
      '/mot-de-passe-oublie',
    )
    expect(screen.getByRole('link', { name: 'Créer un compte' })).toHaveAttribute(
      'href',
      '/inscription',
    )
  })

  it('has no accessibility violation', async () => {
    const { container } = renderLogin()

    await expectNoAccessibilityViolations(container)
  })

  describe('with nothing typed', () => {
    it('says what is missing, next to each field, without calling the server', async () => {
      renderLogin()

      await fillAndSubmit('', '')

      expect(await screen.findByText("Indique ton nom d'utilisateur.")).toBeVisible()
      expect(screen.getByText('Indique ton mot de passe.')).toBeVisible()
      expect(screen.getByLabelText("Nom d'utilisateur")).toBeInvalid()
      expect(screen.getByLabelText("Nom d'utilisateur")).toHaveAccessibleDescription(
        "Indique ton nom d'utilisateur.",
      )
    })
  })

  describe('when the login works (200)', () => {
    it('starts the session and goes to the home page by default', async () => {
      server.use(http.post(loginUrl, () => HttpResponse.text(fakeToken({ username: 'camille' }))))
      renderLogin()

      await fillAndSubmit('camille', 'a-long-password')

      expect(await screen.findByText('Page d’accueil')).toBeVisible()
      expect(sessionStore.getSnapshot()).toMatchObject({ status: 'member', username: 'camille' })
    })

    it('goes back to the page that asked for the login', async () => {
      server.use(http.post(loginUrl, () => HttpResponse.text(fakeToken())))
      renderLogin('/connexion?retour=%2Fmes-recettes')

      await fillAndSubmit('camille', 'a-long-password')

      expect(await screen.findByText('Page des recettes')).toBeVisible()
    })

    it('stays in the app when the way back points elsewhere', async () => {
      server.use(http.post(loginUrl, () => HttpResponse.text(fakeToken())))
      renderLogin(`/connexion?retour=${encodeURIComponent('https://evil.example/')}`)

      await fillAndSubmit('camille', 'a-long-password')

      expect(await screen.findByText('Page d’accueil')).toBeVisible()
    })

    it('sends the username without its stray spaces, and the password as typed', async () => {
      let sent: unknown
      server.use(
        http.post(loginUrl, async ({ request }) => {
          sent = await request.json()
          return HttpResponse.text(fakeToken())
        }),
      )
      renderLogin()

      await fillAndSubmit('  camille ', ' a long password ')

      await screen.findByText('Page d’accueil')
      expect(sent).toEqual({ username: 'camille', password: ' a long password ' })
    })
  })

  describe('when the login is refused', () => {
    it('says so once, in the banner, and keeps what was typed (401)', async () => {
      server.use(http.post(loginUrl, () => problemResponse(401)))
      renderLogin()

      await fillAndSubmit('camille', 'wrong-password')

      expect(await screen.findByRole('alert')).toHaveTextContent(
        "Le nom d'utilisateur ou le mot de passe est incorrect. Essaie encore.",
      )
      expect(screen.getByLabelText("Nom d'utilisateur")).toHaveValue('camille')
      expect(screen.getByLabelText('Mot de passe')).toHaveValue('wrong-password')
      expect(sessionStore.getSnapshot()).toEqual({ status: 'visitor' })
    })

    it('lets the visitor try again with the right password', async () => {
      server.use(http.post(loginUrl, () => problemResponse(401)))
      const { container } = renderLogin()
      const user = await fillAndSubmit('camille', 'wrong-password')
      await screen.findByRole('alert')
      server.use(http.post(loginUrl, () => HttpResponse.text(fakeToken())))

      await user.clear(screen.getByLabelText('Mot de passe'))
      await user.type(screen.getByLabelText('Mot de passe'), 'the-right-one')
      await user.click(screen.getByRole('button', { name: 'Se connecter' }))

      expect(await screen.findByText('Page d’accueil')).toBeVisible()
      await expectNoAccessibilityViolations(container)
    })
  })

  describe('when something else goes wrong, it says which', () => {
    it('reports a server that cannot be reached', async () => {
      server.use(http.post(loginUrl, () => HttpResponse.error()))
      renderLogin()

      await fillAndSubmit('camille', 'a-long-password')

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Impossible de joindre le serveur. Vérifie ta connexion, puis réessaie.',
      )
    })

    it('tells how long to wait when the server is at capacity (503, Retry-After)', async () => {
      server.use(http.post(loginUrl, () => problemResponse(503, 'Busy', { 'Retry-After': '30' })))
      renderLogin()

      await fillAndSubmit('camille', 'a-long-password')

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Le serveur est très sollicité. Réessaie dans 30 secondes.',
      )
    })

    it('reports a server error (500)', async () => {
      server.use(http.post(loginUrl, () => problemResponse(500)))
      renderLogin()

      await fillAndSubmit('camille', 'a-long-password')

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Le serveur a rencontré un problème. Réessaie dans un moment.',
      )
    })

    it('reports a request the server found malformed (400)', async () => {
      server.use(http.post(loginUrl, () => problemResponse(400)))
      renderLogin()

      await fillAndSubmit('camille', 'a-long-password')

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Certaines informations ne sont pas valides. Vérifie ta saisie, puis réessaie.',
      )
    })
  })

  it('cannot be submitted twice while the answer is awaited', async () => {
    let calls = 0
    server.use(
      http.post(loginUrl, async () => {
        calls += 1
        await new Promise((resolve) => setTimeout(resolve, 50))
        return HttpResponse.text(fakeToken())
      }),
    )
    renderLogin()
    const user = await fillAndSubmit('camille', 'a-long-password')

    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeDisabled()
    await user.keyboard('{Enter}')
    await screen.findByText('Page d’accueil')

    expect(calls).toBe(1)
  })
})
