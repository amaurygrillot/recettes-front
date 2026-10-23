import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { API_BASE_URL } from '../../api/apiConfig'
import { sessionStore } from '../../api/sessionStore'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { fakeToken } from '../../test/fakeToken'
import { problemResponse } from '../../test/problem'
import { renderRoutes } from '../../test/renderRoutes'
import { server } from '../../test/server'
import { RegisterScreen } from './RegisterScreen'

const createUrl = `${API_BASE_URL}/users/create`
const loginUrl = `${API_BASE_URL}/auth/login`

function renderRegister() {
  return renderRoutes(
    [
      { path: '/inscription', element: <RegisterScreen /> },
      { path: '/connexion', element: <p>Page de connexion</p> },
      { path: '/mot-de-passe-oublie', element: <p>Page du mot de passe oublié</p> },
      { path: '/', element: <p>Page d’accueil</p> },
    ],
    '/inscription',
  )
}

const created = () => HttpResponse.json({ id: 'u-1', username: 'odile74' }, { status: 201 })

interface Typed {
  username?: string
  email?: string
  password?: string
  firstname?: string
  lastname?: string
}

async function fill(user: ReturnType<typeof userEvent.setup>, typed: Typed) {
  if (typed.username) await user.type(screen.getByLabelText("Nom d'utilisateur"), typed.username)
  if (typed.email) await user.type(screen.getByLabelText('Adresse e-mail'), typed.email)
  if (typed.password) await user.type(screen.getByLabelText('Mot de passe'), typed.password)
  if (typed.firstname) await user.type(screen.getByLabelText(/^Prénom/), typed.firstname)
  if (typed.lastname) await user.type(screen.getByLabelText(/^Nom facultatif/), typed.lastname)
}

const submitButton = () => screen.getByRole('button', { name: 'Créer mon compte' })

const VALID: Typed = { username: 'odile74', email: 'odile@exemple.fr', password: 'motdepasse' }

async function registerWith(typed: Typed = VALID) {
  const user = userEvent.setup()
  await fill(user, typed)
  await user.click(submitButton())
  return user
}

describe('RegisterScreen', () => {
  describe('the form', () => {
    it('asks for five fields, the last two said to be optional, and tells password managers what they are', () => {
      renderRegister()

      expect(screen.getByRole('heading', { level: 1, name: 'Créer un compte' })).toBeVisible()
      expect(screen.getByLabelText("Nom d'utilisateur")).toHaveAttribute('autocomplete', 'username')
      expect(screen.getByLabelText('Adresse e-mail')).toHaveAttribute('autocomplete', 'email')
      expect(screen.getByLabelText('Mot de passe')).toHaveAttribute('autocomplete', 'new-password')
      expect(screen.getByLabelText(/^Prénom/)).toHaveAttribute('autocomplete', 'given-name')
      expect(screen.getByLabelText(/^Nom facultatif/)).toHaveAttribute(
        'autocomplete',
        'family-name',
      )
      expect(screen.getAllByText('facultatif')).toHaveLength(2)
    })

    it('has a way back and a way to sign in instead', () => {
      renderRegister()

      expect(screen.getByRole('link', { name: 'Retour' })).toHaveAttribute('href', '/connexion')
      expect(
        screen.getByRole('link', { name: 'Tu as déjà un compte ? Se connecter' }),
      ).toHaveAttribute('href', '/connexion')
    })

    it('explains the limits of the name and of the password', () => {
      renderRegister()

      expect(screen.getByLabelText("Nom d'utilisateur")).toHaveAccessibleDescription(
        '3 à 50 caractères',
      )
      expect(screen.getByLabelText('Mot de passe')).toHaveAccessibleDescription(
        '8 caractères minimum',
      )
    })

    it('shows the password rule kept as soon as it is, and only then', async () => {
      const user = userEvent.setup()
      renderRegister()
      const rule = () => screen.getByText('8 caractères minimum')

      await user.type(screen.getByLabelText('Mot de passe'), 'court')
      expect(rule()).not.toHaveClass('text-herb')
      await user.type(screen.getByLabelText('Mot de passe'), 'ement')

      expect(rule()).toHaveClass('text-herb')
    })

    it('has no accessibility violation', async () => {
      const { container } = renderRegister()

      await expectNoAccessibilityViolations(container)
    })
  })

  describe('what is checked before asking the server', () => {
    it('says what is missing under each required field, and sends nothing', async () => {
      let calls = 0
      server.use(
        http.post(createUrl, () => {
          calls += 1
          return created()
        }),
      )
      renderRegister()

      await registerWith({})

      expect(await screen.findByText("Indique ton nom d'utilisateur.")).toBeVisible()
      expect(screen.getByText('Indique ton adresse e-mail.')).toBeVisible()
      expect(screen.getByLabelText('Mot de passe')).toBeInvalid()
      expect(screen.getByLabelText(/^Prénom/)).toBeValid()
      expect(calls).toBe(0)
    })

    it('asks for at least 3 characters in the username', async () => {
      renderRegister()

      await registerWith({ ...VALID, username: 'od' })

      expect(await screen.findByText('Au moins 3 caractères.')).toBeVisible()
    })

    it('asks for an address that looks like one, with an example', async () => {
      renderRegister()

      await registerWith({ ...VALID, email: 'odile@exemple' })

      expect(
        await screen.findByText(
          "Cette adresse e-mail n'a pas l'air valide. Exemple : prenom@exemple.fr",
        ),
      ).toBeVisible()
    })

    it('puts the password rule itself in error when the password is too short', async () => {
      renderRegister()

      await registerWith({ ...VALID, password: 'abc123' })

      const password = screen.getByLabelText('Mot de passe')
      await waitFor(() => {
        expect(password).toBeInvalid()
      })
      expect(password).toHaveAccessibleDescription('8 caractères minimum')
    })

    it('puts the focus on the first field to correct', async () => {
      renderRegister()

      await registerWith({ ...VALID, username: 'od' })

      await waitFor(() => {
        expect(screen.getByLabelText("Nom d'utilisateur")).toHaveFocus()
      })
    })
  })

  describe('when the account is created (201)', () => {
    it('sends what was typed, without the optional fields left empty, and trims the names', async () => {
      let sent: unknown
      server.use(
        http.post(createUrl, async ({ request }) => {
          sent = await request.json()
          return created()
        }),
        http.post(loginUrl, () => HttpResponse.text(fakeToken())),
      )
      renderRegister()

      await registerWith({ ...VALID, username: '  odile74 ', email: ' odile@exemple.fr ' })

      await screen.findByRole('heading', { level: 1, name: /^Bienvenue/ })
      expect(sent).toEqual({
        username: 'odile74',
        email: 'odile@exemple.fr',
        password: 'motdepasse',
      })
    })

    it('sends the first name and the last name when they are given', async () => {
      let sent: unknown
      server.use(
        http.post(createUrl, async ({ request }) => {
          sent = await request.json()
          return created()
        }),
        http.post(loginUrl, () => HttpResponse.text(fakeToken())),
      )
      renderRegister()

      await registerWith({ ...VALID, firstname: 'Odile', lastname: ' Martin ' })

      await screen.findByRole('heading', { level: 1, name: /^Bienvenue/ })
      expect(sent).toMatchObject({ firstname: 'Odile', lastname: 'Martin' })
    })

    it('welcomes the new member by name, signs them in with what they typed, and leads to the recipes', async () => {
      let signedInWith: unknown
      server.use(
        http.post(createUrl, created),
        http.post(loginUrl, async ({ request }) => {
          signedInWith = await request.json()
          return HttpResponse.text(fakeToken({ username: 'odile74' }))
        }),
      )
      renderRegister()

      await registerWith()

      expect(
        await screen.findByRole('heading', { level: 1, name: /^Bienvenue, odile74\s!$/ }),
      ).toBeVisible()
      expect(await screen.findByText('Te voilà connecté.')).toBeVisible()
      expect(screen.getByRole('link', { name: 'Découvrir les recettes' })).toHaveAttribute(
        'href',
        '/',
      )
      expect(signedInWith).toEqual({ username: 'odile74', password: 'motdepasse' })
      expect(sessionStore.getSnapshot()).toMatchObject({ status: 'member', username: 'odile74' })
    })

    it('says it is signing in while the sign-in is on its way', async () => {
      server.use(
        http.post(createUrl, created),
        http.post(loginUrl, async () => {
          await delay('infinite')
          return HttpResponse.text(fakeToken())
        }),
      )
      renderRegister()

      await registerWith()

      expect(await screen.findByText("On t'installe à table…")).toBeVisible()
      expect(screen.getByRole('button', { name: 'Connexion…' })).toHaveAttribute(
        'aria-busy',
        'true',
      )
      expect(screen.queryByRole('link', { name: 'Découvrir les recettes' })).not.toBeInTheDocument()
    })

    it('starts the welcome on its title, since the form that had the focus is gone', async () => {
      server.use(
        http.post(createUrl, created),
        http.post(loginUrl, () => HttpResponse.text(fakeToken())),
      )
      renderRegister()

      await registerWith()

      expect(await screen.findByRole('heading', { level: 1, name: /^Bienvenue/ })).toHaveFocus()
    })

    it('leaves the way in to the sign-in page when the automatic sign-in fails', async () => {
      server.use(
        http.post(createUrl, created),
        http.post(loginUrl, () => problemResponse(500)),
      )
      renderRegister()

      await registerWith()

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Ton compte est créé, mais la connexion automatique a échoué.',
      )
      expect(screen.getByRole('link', { name: 'Se connecter' })).toHaveAttribute(
        'href',
        '/connexion',
      )
      expect(sessionStore.getSnapshot()).toEqual({ status: 'visitor' })
    })

    it('has no accessibility violation once welcomed', async () => {
      server.use(
        http.post(createUrl, created),
        http.post(loginUrl, () => HttpResponse.text(fakeToken())),
      )
      const { container } = renderRegister()

      await registerWith()
      await screen.findByText('Te voilà connecté.')

      await expectNoAccessibilityViolations(container)
    })
  })

  describe('when the server refuses (409)', () => {
    it('says the username is taken on the username field, keeps the rest, and focuses it', async () => {
      server.use(http.post(createUrl, () => problemResponse(409, 'Username already exists')))
      renderRegister()

      await registerWith({ ...VALID, firstname: 'Odile' })

      const username = screen.getByLabelText("Nom d'utilisateur")
      expect(await screen.findByText("Ce nom d'utilisateur est déjà pris.")).toBeVisible()
      expect(username).toBeInvalid()
      await waitFor(() => {
        expect(username).toHaveFocus()
      })
      expect(screen.getByLabelText('Adresse e-mail')).toHaveValue('odile@exemple.fr')
      expect(screen.getByLabelText(/^Prénom/)).toHaveValue('Odile')
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('says the address is already used, and offers « Mot de passe oublié ? » right away', async () => {
      server.use(http.post(createUrl, () => problemResponse(409, 'Email already exists')))
      renderRegister()

      await registerWith()

      expect(await screen.findByText('Cette adresse e-mail est déjà utilisée.')).toBeVisible()
      expect(screen.getByLabelText('Adresse e-mail')).toBeInvalid()
      expect(screen.getByRole('link', { name: 'Mot de passe oublié ?' })).toHaveAttribute(
        'href',
        '/mot-de-passe-oublie',
      )
    })

    it('does not offer « Mot de passe oublié ? » for a taken username', async () => {
      server.use(http.post(createUrl, () => problemResponse(409, 'Username already exists')))
      renderRegister()

      await registerWith()

      await screen.findByText("Ce nom d'utilisateur est déjà pris.")
      expect(screen.queryByRole('link', { name: 'Mot de passe oublié ?' })).not.toBeInTheDocument()
    })

    it('lets the member correct the field and try again', async () => {
      server.use(http.post(createUrl, () => problemResponse(409, 'Username already exists')))
      renderRegister()
      const user = await registerWith()
      await screen.findByText("Ce nom d'utilisateur est déjà pris.")
      server.use(
        http.post(createUrl, created),
        http.post(loginUrl, () => HttpResponse.text(fakeToken())),
      )

      await user.type(screen.getByLabelText("Nom d'utilisateur"), '75')
      await waitFor(() => {
        expect(screen.queryByText("Ce nom d'utilisateur est déjà pris.")).not.toBeInTheDocument()
      })
      await user.click(submitButton())

      expect(await screen.findByRole('heading', { level: 1, name: /^Bienvenue/ })).toBeVisible()
    })

    it('says so on top when the server names neither field', async () => {
      server.use(http.post(createUrl, () => problemResponse(409, 'Something exists')))
      renderRegister()

      await registerWith()

      expect(await screen.findByRole('alert')).toHaveTextContent(
        "Ce nom d'utilisateur ou cette adresse e-mail est déjà utilisé.",
      )
    })
  })

  describe('when something else goes wrong, it says which', () => {
    it.each([
      [
        'a server that cannot be reached',
        () => HttpResponse.error(),
        'Impossible de joindre le serveur. Vérifie ta connexion, puis réessaie.',
      ],
      [
        'a request the server found invalid (400)',
        () => problemResponse(400, 'password: size must be between 8 and 50'),
        'Certaines informations ne sont pas valides. Vérifie ta saisie, puis réessaie.',
      ],
      [
        'a server at capacity (503, Retry-After)',
        () => problemResponse(503, 'Busy', { 'Retry-After': '30' }),
        'Le serveur est très sollicité. Réessaie dans 30 secondes.',
      ],
      [
        'a server error (500)',
        () => problemResponse(500),
        'Le serveur a rencontré un problème. Réessaie dans un moment.',
      ],
    ])('reports %s, and keeps what was typed', async (_what, answer, sentence) => {
      server.use(http.post(createUrl, answer))
      renderRegister()

      await registerWith()

      expect(await screen.findByRole('alert')).toHaveTextContent(sentence)
      expect(screen.getByLabelText("Nom d'utilisateur")).toHaveValue('odile74')
      expect(screen.getByLabelText('Mot de passe')).toHaveValue('motdepasse')
      expect(screen.getByLabelText("Nom d'utilisateur")).toBeEnabled()
    })
  })

  describe('while the account is being created', () => {
    it('locks the form and cannot be submitted twice', async () => {
      let calls = 0
      server.use(
        http.post(createUrl, async () => {
          calls += 1
          await delay(60)
          return created()
        }),
        http.post(loginUrl, () => HttpResponse.text(fakeToken())),
      )
      renderRegister()
      const user = await registerWith()

      const pending = screen.getByRole('button', { name: 'Création du compte…' })
      expect(pending).toHaveAttribute('aria-busy', 'true')
      expect(screen.getByLabelText("Nom d'utilisateur")).toBeDisabled()
      await user.keyboard('{Enter}')
      await screen.findByRole('heading', { level: 1, name: /^Bienvenue/ })

      expect(calls).toBe(1)
    })
  })

  it('has only its two links and no navigation around it', () => {
    renderRegister()

    const links = screen.getAllByRole('link').map((link) => link.textContent)

    expect(links).toEqual(['Retour', 'Tu as déjà un compte ? Se connecter'])
    expect(within(document.body).queryByRole('navigation')).not.toBeInTheDocument()
  })
})
