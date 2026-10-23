import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { Outlet } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { API_BASE_URL } from '../../api/apiConfig'
import { sessionStore } from '../../api/sessionStore'
import { accountKeys, type Account } from '../../api/users'
import { ToastsProvider } from '../../app/ToastsProvider'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { fakeToken } from '../../test/fakeToken'
import { installMatchMedia, removeMatchMedia } from '../../test/matchMedia'
import { problemResponse } from '../../test/problem'
import { renderRoutes } from '../../test/renderRoutes'
import { server } from '../../test/server'
import { AccountScreen } from './AccountScreen'

const updateUrl = `${API_BASE_URL}/users/update`
const MEMBER = { username: 'odile74', userId: 'u-1' }
const KNOWN: Account = {
  id: 'u-1',
  username: 'odile74',
  email: 'odile@exemple.fr',
  firstname: 'Odile',
  lastname: 'Martin',
  roles: ['USER'],
}

function renderAccount({ known }: { known?: Account } = {}) {
  return renderRoutes(
    [
      {
        element: (
          <ToastsProvider>
            <Outlet />
          </ToastsProvider>
        ),
        children: [
          { path: '/compte', element: <AccountScreen /> },
          { path: '/', element: <p>Page d’accueil</p> },
          { path: '/mes-recettes', element: <p>Page de mes recettes</p> },
        ],
      },
    ],
    '/compte',
    (client) => {
      if (known !== undefined) client.setQueryData(accountKeys.of(MEMBER.userId), known)
    },
  )
}

/** What the back end answers to a change: the account as stored, with what was sent applied. */
function updated(sent: unknown = {}) {
  return HttpResponse.json({ ...KNOWN, ...(typeof sent === 'object' ? sent : {}) })
}

function signInAsMember(roles: readonly string[] = ['USER']) {
  expect(sessionStore.signIn(fakeToken({ ...MEMBER, roles }))).toBe(true)
}

const username = () => screen.getByLabelText("Nom d'utilisateur")
const firstname = () => screen.getByLabelText(/^Prénom/)
const lastname = () => screen.getByLabelText(/^Nom facultatif/)
const saveProfile = () => screen.getByRole('button', { name: /^Enregistrer|Enregistrement…/ })

function card(name: string) {
  return within(screen.getByRole('region', { name }))
}

describe('AccountScreen', () => {
  beforeEach(() => {
    signInAsMember()
  })

  afterEach(() => {
    removeMatchMedia()
  })

  describe('the page', () => {
    it('shows who is signed in, and the three cards, each with its own title', () => {
      renderAccount()

      expect(screen.getByRole('heading', { level: 1, name: 'Compte' })).toBeVisible()
      expect(screen.getByText('odile74')).toBeVisible()
      expect(screen.getByText('Membre')).toBeVisible()
      expect(
        screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent),
      ).toEqual(['Profil', 'Adresse e-mail', 'Mot de passe'])
    })

    it('calls an administrator by their role', () => {
      sessionStore.signOut()
      signInAsMember(['USER', 'ADMIN'])
      renderAccount()

      expect(screen.getByText('Administrateur')).toBeVisible()
      expect(screen.queryByText('Membre')).not.toBeInTheDocument()
    })

    it('has a row to the member’s recipes', () => {
      renderAccount()

      expect(screen.getByRole('link', { name: 'Mes recettes' })).toHaveAttribute(
        'href',
        '/mes-recettes',
      )
    })

    it('shows the address of the account once it is known, under the username', () => {
      renderAccount({ known: KNOWN })

      expect(screen.getAllByText('odile@exemple.fr')).toHaveLength(2)
    })

    it('shows nothing for a visitor', () => {
      sessionStore.signOut()
      renderAccount()

      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    })

    it.each([
      ['a phone', 390],
      ['a tablet', 768],
      ['a desktop', 1280],
    ])('has no accessibility violation on %s', async (_screen, width) => {
      installMatchMedia(width)
      const { container } = renderAccount({ known: KNOWN })

      await expectNoAccessibilityViolations(container)
    })
  })

  describe('on a phone', () => {
    it('has « Se déconnecter » at the bottom of the page and no column of sections', () => {
      renderAccount()

      expect(screen.getByRole('button', { name: 'Se déconnecter' })).toBeVisible()
      expect(
        screen.queryByRole('navigation', { name: 'Sections du compte' }),
      ).not.toBeInTheDocument()
    })
  })

  describe('from a tablet', () => {
    beforeEach(() => {
      installMatchMedia(768)
    })

    it('has a column of sections that scrolls to each card, with « Se déconnecter » after the rule', async () => {
      const user = userEvent.setup()
      renderAccount()
      const index = within(screen.getByRole('navigation', { name: 'Sections du compte' }))

      expect(index.getAllByRole('link').map((link) => link.textContent)).toEqual([
        'Profil',
        'Adresse e-mail',
        'Mot de passe',
      ])
      expect(index.getByRole('link', { name: 'Profil' })).toHaveAttribute('aria-current', 'true')
      await user.click(index.getByRole('link', { name: 'Mot de passe' }))

      expect(index.getByRole('link', { name: 'Mot de passe' })).toHaveAttribute(
        'aria-current',
        'true',
      )
      expect(index.getByRole('button', { name: 'Se déconnecter' })).toBeVisible()
    })

    it('has only one « Se déconnecter »: the one of the column', () => {
      renderAccount()

      expect(screen.getAllByRole('button', { name: 'Se déconnecter' })).toHaveLength(1)
    })
  })

  describe('« Se déconnecter »', () => {
    it('asks first, with « Rester connecté » in focus and as the main answer', async () => {
      const user = userEvent.setup()
      renderAccount()

      await user.click(screen.getByRole('button', { name: 'Se déconnecter' }))

      const dialog = await screen.findByRole('alertdialog', { name: 'Te déconnecter ?' })
      expect(
        within(dialog).getByText(
          'Tes recettes restent en sécurité. Tu pourras te reconnecter quand tu veux.',
        ),
      ).toBeVisible()
      expect(within(dialog).getByRole('button', { name: 'Rester connecté' })).toHaveFocus()
    })

    it('stays signed in when the answer is « Rester connecté »', async () => {
      const user = userEvent.setup()
      renderAccount()
      await user.click(screen.getByRole('button', { name: 'Se déconnecter' }))

      await user.click(await screen.findByRole('button', { name: 'Rester connecté' }))

      await waitFor(() => {
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
      })
      expect(sessionStore.getSnapshot()).toMatchObject({ status: 'member' })
    })

    it('signs out and goes to the home page once confirmed', async () => {
      const user = userEvent.setup()
      renderAccount()
      await user.click(screen.getByRole('button', { name: 'Se déconnecter' }))

      const dialog = await screen.findByRole('alertdialog')
      await user.click(within(dialog).getByRole('button', { name: 'Se déconnecter' }))

      expect(await screen.findByText('Page d’accueil')).toBeVisible()
      expect(sessionStore.getSnapshot()).toEqual({ status: 'visitor' })
    })

    it('signs out from the column too, on a tablet', async () => {
      installMatchMedia(768)
      const user = userEvent.setup()
      renderAccount()
      await user.click(screen.getByRole('button', { name: 'Se déconnecter' }))

      const dialog = await screen.findByRole('alertdialog')
      await user.click(within(dialog).getByRole('button', { name: 'Se déconnecter' }))

      expect(await screen.findByText('Page d’accueil')).toBeVisible()
    })
  })

  describe('the profile card', () => {
    it('starts with the username, nothing to save, and says that the names are not shown', () => {
      renderAccount()

      expect(username()).toHaveValue('odile74')
      expect(username()).toHaveAccessibleDescription('3 à 50 caractères')
      expect(firstname()).toHaveValue('')
      expect(saveProfile()).toBeDisabled()
      expect(
        screen.getByText(
          "Ton prénom et ton nom ne s'affichent pas ici : laisse-les vides pour les garder tels quels.",
        ),
      ).toBeVisible()
    })

    it('shows the names once they are known, without that note', () => {
      renderAccount({ known: KNOWN })

      expect(firstname()).toHaveValue('Odile')
      expect(lastname()).toHaveValue('Martin')
      expect(screen.queryByText(/laisse-les vides/)).not.toBeInTheDocument()
    })

    it('keeps its note and its empty names when another card teaches the names, so nothing it shows is untrue', async () => {
      server.use(http.put(updateUrl, () => updated({ email: 'n@exemple.fr' })))
      const user = userEvent.setup()
      renderAccount()

      await user.click(screen.getByRole('button', { name: 'Modifier' }))
      await user.type(screen.getByLabelText('Nouvelle adresse e-mail'), 'n@exemple.fr')
      await user.type(card('Adresse e-mail').getByLabelText('Mot de passe actuel'), 'motdepasse')
      await user.click(screen.getByRole('button', { name: "Changer l'adresse" }))

      await screen.findByText('Adresse e-mail modifiée')
      expect(screen.getByText(/laisse-les vides/)).toBeVisible()
      expect(firstname()).toHaveValue('')
    })

    it('shows the unsaved mark and a button that can be pressed as soon as a value changes', async () => {
      const user = userEvent.setup()
      renderAccount()
      expect(card('Profil').queryByText('Modifications non enregistrées')).not.toBeInTheDocument()

      await user.type(username(), '5')

      expect(card('Profil').getByText('Modifications non enregistrées')).toBeVisible()
      expect(saveProfile()).toBeEnabled()
    })

    it('does not mark the other cards as changed', async () => {
      const user = userEvent.setup()
      renderAccount()

      await user.type(username(), '5')

      expect(
        card('Mot de passe').queryByText('Modifications non enregistrées'),
      ).not.toBeInTheDocument()
      expect(
        card('Adresse e-mail').queryByText('Modifications non enregistrées'),
      ).not.toBeInTheDocument()
    })

    it('sends only what changed, and says it was saved', async () => {
      let sent: unknown
      server.use(
        http.put(updateUrl, async ({ request }) => {
          sent = await request.json()
          return updated(sent)
        }),
      )
      const user = userEvent.setup()
      renderAccount({ known: KNOWN })

      await user.clear(username())
      await user.type(username(), 'odile75')
      await user.click(saveProfile())

      expect(await screen.findByText('Profil mis à jour')).toBeVisible()
      expect(sent).toEqual({ username: 'odile75' })
    })

    it('sends a first name that was typed when the names were not known, and leaves the last name alone', async () => {
      let sent: unknown
      server.use(
        http.put(updateUrl, async ({ request }) => {
          sent = await request.json()
          return updated()
        }),
      )
      const user = userEvent.setup()
      renderAccount()

      await user.type(firstname(), 'Odile')
      await user.click(saveProfile())

      await screen.findByText('Profil mis à jour')
      expect(sent).toEqual({ firstname: 'Odile' })
    })

    it('goes back to nothing to save once saved, and shows what the back end stored', async () => {
      server.use(http.put(updateUrl, () => updated({ firstname: 'Odile', lastname: 'Martin' })))
      const user = userEvent.setup()
      renderAccount()
      await user.type(firstname(), 'Odile')

      await user.click(saveProfile())

      await screen.findByText('Profil mis à jour')
      await waitFor(() => {
        expect(saveProfile()).toBeDisabled()
      })
      expect(lastname()).toHaveValue('Martin')
      expect(card('Profil').queryByText('Modifications non enregistrées')).not.toBeInTheDocument()
    })

    it('shows the new username everywhere once it is saved', async () => {
      server.use(http.put(updateUrl, () => updated({ username: 'odile75' })))
      const user = userEvent.setup()
      renderAccount({ known: KNOWN })

      await user.clear(username())
      await user.type(username(), 'odile75')
      await user.click(saveProfile())

      await screen.findByText('Profil mis à jour')
      expect(screen.getByText('odile75', { selector: 'p' })).toBeVisible()
      expect(sessionStore.getSnapshot()).toMatchObject({ username: 'odile75' })
    })

    it('asks for at least 3 characters, and sends nothing', async () => {
      let calls = 0
      server.use(
        http.put(updateUrl, () => {
          calls += 1
          return updated()
        }),
      )
      const user = userEvent.setup()
      renderAccount()

      await user.clear(username())
      await user.type(username(), 'od')
      await user.click(saveProfile())

      expect(await screen.findByText('Au moins 3 caractères.')).toBeVisible()
      expect(username()).toBeInvalid()
      expect(calls).toBe(0)
    })

    it('says a username is taken (409) on its field, keeps what was typed, and focuses it', async () => {
      server.use(http.put(updateUrl, () => problemResponse(409, 'Username already exists')))
      const user = userEvent.setup()
      renderAccount({ known: KNOWN })

      await user.clear(username())
      await user.type(username(), 'mamie')
      await user.click(saveProfile())

      expect(await screen.findByText("Ce nom d'utilisateur est déjà pris.")).toBeVisible()
      expect(username()).toBeInvalid()
      expect(username()).toHaveValue('mamie')
      await waitFor(() => {
        expect(username()).toHaveFocus()
      })
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('locks the card while it is being saved, and cannot be sent twice', async () => {
      let calls = 0
      server.use(
        http.put(updateUrl, async () => {
          calls += 1
          await delay(60)
          return updated()
        }),
      )
      const user = userEvent.setup()
      renderAccount()
      await user.type(username(), '5')

      await user.click(saveProfile())

      expect(screen.getByRole('button', { name: 'Enregistrement…' })).toHaveAttribute(
        'aria-busy',
        'true',
      )
      expect(username()).toBeDisabled()
      await user.keyboard('{Enter}')
      await screen.findByText('Profil mis à jour')
      expect(calls).toBe(1)
    })
  })

  describe('when a save fails for another reason, a notification says which and keeps what was typed', () => {
    async function failToSave(answer: () => Response) {
      server.use(http.put(updateUrl, answer))
      const user = userEvent.setup()
      renderAccount()
      await user.type(username(), '5')
      await user.click(saveProfile())
      return user
    }

    it.each([
      [
        'a server that cannot be reached',
        () => HttpResponse.error(),
        'Impossible de joindre le serveur. Vérifie ta connexion, puis réessaie.',
      ],
      [
        'a server error (500)',
        () => problemResponse(500),
        'Le serveur a rencontré un problème. Réessaie dans un moment.',
      ],
      [
        'a server at capacity (503, Retry-After)',
        () => problemResponse(503, 'Busy', { 'Retry-After': '30' }),
        'Le serveur est très sollicité. Réessaie dans 30 secondes.',
      ],
    ])('reports %s, and offers « Réessayer »', async (_what, answer, sentence) => {
      await failToSave(answer)

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Enregistrement impossible.')
      expect(alert).toHaveTextContent(sentence)
      expect(within(alert).getByRole('button', { name: 'Réessayer' })).toBeVisible()
      expect(username()).toHaveValue('odile745')
      expect(saveProfile()).toBeEnabled()
      expect(card('Profil').getByText('Modifications non enregistrées')).toBeVisible()
    })

    it('sends exactly what was typed again when « Réessayer » is pressed', async () => {
      const bodies: unknown[] = []
      let answers = 0
      server.use(
        http.put(updateUrl, async ({ request }) => {
          bodies.push(await request.json())
          answers += 1
          return answers === 1 ? problemResponse(500) : updated({ username: 'odile745' })
        }),
      )
      const user = userEvent.setup()
      renderAccount()
      await user.type(username(), '5')
      await user.click(saveProfile())

      await user.click(await screen.findByRole('button', { name: 'Réessayer' }))

      expect(await screen.findByText('Profil mis à jour')).toBeVisible()
      expect(bodies).toEqual([{ username: 'odile745' }, { username: 'odile745' }])
    })

    it.each([
      ['not allowed (403)', 403, "Tu n'as pas le droit de faire cette action."],
      [
        'refused as invalid (400)',
        400,
        'Certaines informations ne sont pas valides. Vérifie ta saisie, puis réessaie.',
      ],
    ])('says it was %s, without offering to repeat it', async (_what, status, sentence) => {
      await failToSave(() => problemResponse(status))

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent(sentence)
      expect(within(alert).queryByRole('button', { name: 'Réessayer' })).not.toBeInTheDocument()
    })

    it('keeps the page and what was typed when the session expires (401)', async () => {
      await failToSave(() => problemResponse(401))

      await waitFor(() => {
        expect(sessionStore.getSnapshot()).toEqual({ status: 'expired' })
      })
      expect(screen.getByRole('heading', { level: 1, name: 'Compte' })).toBeVisible()
      expect(username()).toHaveValue('odile745')
    })
  })

  describe('the e-mail card', () => {
    const newAddress = () => screen.getByLabelText('Nouvelle adresse e-mail')
    const currentPassword = () => card('Adresse e-mail').getByLabelText('Mot de passe actuel')
    const submitAddress = () => screen.getByRole('button', { name: "Changer l'adresse" })

    async function openEmailCard(known?: Account) {
      const user = userEvent.setup()
      renderAccount(known === undefined ? {} : { known })
      await user.click(screen.getByRole('button', { name: 'Modifier' }))
      return user
    }

    it('shows the current address and « Modifier », and no field yet', () => {
      renderAccount({ known: KNOWN })

      expect(card('Adresse e-mail').getByText('Adresse actuelle')).toBeVisible()
      expect(card('Adresse e-mail').getByText('odile@exemple.fr')).toBeVisible()
      expect(screen.getByRole('button', { name: 'Modifier' })).toBeVisible()
      expect(screen.queryByLabelText('Nouvelle adresse e-mail')).not.toBeInTheDocument()
    })

    it('says the address is not shown when it is not known, and still lets it be replaced', () => {
      renderAccount()

      expect(
        screen.getByText("Ton adresse actuelle ne s'affiche pas ici. Tu peux la remplacer."),
      ).toBeVisible()
      expect(screen.getByRole('button', { name: 'Modifier' })).toBeVisible()
    })

    it('opens the new address and the current password on « Modifier »', async () => {
      await openEmailCard(KNOWN)

      expect(newAddress()).toHaveAttribute('type', 'email')
      expect(currentPassword()).toHaveAttribute('autocomplete', 'current-password')
      expect(submitAddress()).toBeVisible()
      expect(screen.getByRole('button', { name: 'Annuler' })).toBeVisible()
    })

    it('closes and forgets what was typed on « Annuler »', async () => {
      const user = await openEmailCard(KNOWN)
      await user.type(newAddress(), 'nouvelle@exemple.fr')

      await user.click(screen.getByRole('button', { name: 'Annuler' }))
      await user.click(screen.getByRole('button', { name: 'Modifier' }))

      expect(newAddress()).toHaveValue('')
      expect(
        card('Adresse e-mail').queryByText('Modifications non enregistrées'),
      ).not.toBeInTheDocument()
    })

    it('marks the card as changed once something is typed', async () => {
      const user = await openEmailCard(KNOWN)

      await user.type(newAddress(), 'n')

      expect(card('Adresse e-mail').getByText('Modifications non enregistrées')).toBeVisible()
    })

    it('sends the address and the current password, says it was changed, and closes with the new address', async () => {
      let sent: unknown
      server.use(
        http.put(updateUrl, async ({ request }) => {
          sent = await request.json()
          return updated({ email: 'odile.martin@exemple.fr' })
        }),
      )
      const user = await openEmailCard(KNOWN)

      await user.type(newAddress(), 'odile.martin@exemple.fr')
      await user.type(currentPassword(), 'motdepasse')
      await user.click(submitAddress())

      expect(await screen.findByText('Adresse e-mail modifiée')).toBeVisible()
      expect(sent).toEqual({ email: 'odile.martin@exemple.fr', currentPassword: 'motdepasse' })
      expect(screen.queryByLabelText('Nouvelle adresse e-mail')).not.toBeInTheDocument()
      expect(card('Adresse e-mail').getByText('odile.martin@exemple.fr')).toBeVisible()
      expect(screen.getAllByText('odile.martin@exemple.fr')).toHaveLength(2)
    })

    it('asks for an address that looks like one, and for the current password', async () => {
      let calls = 0
      server.use(
        http.put(updateUrl, () => {
          calls += 1
          return updated()
        }),
      )
      const user = await openEmailCard(KNOWN)

      await user.type(newAddress(), 'odile@exemple')
      await user.click(submitAddress())

      expect(
        await screen.findByText(
          "Cette adresse e-mail n'a pas l'air valide. Exemple : prenom@exemple.fr",
        ),
      ).toBeVisible()
      expect(screen.getByText('Indique ton mot de passe actuel.')).toBeVisible()
      expect(calls).toBe(0)
    })

    it('says the current password is wrong (403) on its field, and keeps the rest', async () => {
      server.use(http.put(updateUrl, () => problemResponse(403)))
      const user = await openEmailCard(KNOWN)

      await user.type(newAddress(), 'odile.martin@exemple.fr')
      await user.type(currentPassword(), 'mauvais')
      await user.click(submitAddress())

      expect(await screen.findByText('Le mot de passe actuel est incorrect.')).toBeVisible()
      expect(currentPassword()).toBeInvalid()
      expect(currentPassword()).toHaveValue('mauvais')
      expect(newAddress()).toHaveValue('odile.martin@exemple.fr')
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('says the address is already used (409) on the address field', async () => {
      server.use(http.put(updateUrl, () => problemResponse(409, 'Email already exists')))
      const user = await openEmailCard(KNOWN)

      await user.type(newAddress(), 'mamie@exemple.fr')
      await user.type(currentPassword(), 'motdepasse')
      await user.click(submitAddress())

      expect(await screen.findByText('Cette adresse e-mail est déjà utilisée.')).toBeVisible()
      expect(newAddress()).toBeInvalid()
      expect(newAddress()).toHaveValue('mamie@exemple.fr')
    })

    it('reports a failure of the server in a notification, and sends the same thing again on « Réessayer »', async () => {
      let answers = 0
      server.use(
        http.put(updateUrl, () => {
          answers += 1
          return answers === 1 ? problemResponse(500) : updated({ email: 'n@exemple.fr' })
        }),
      )
      const user = await openEmailCard(KNOWN)
      await user.type(newAddress(), 'n@exemple.fr')
      await user.type(currentPassword(), 'motdepasse')
      await user.click(submitAddress())

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Enregistrement impossible.')
      expect(newAddress()).toHaveValue('n@exemple.fr')
      await user.click(within(alert).getByRole('button', { name: 'Réessayer' }))

      expect(await screen.findByText('Adresse e-mail modifiée')).toBeVisible()
    })

    it('shows the password on demand', async () => {
      const user = await openEmailCard(KNOWN)

      await user.click(
        card('Adresse e-mail').getByRole('button', { name: 'Afficher le mot de passe' }),
      )

      expect(currentPassword()).toHaveAttribute('type', 'text')
    })
  })

  describe('the password card', () => {
    const current = () => card('Mot de passe').getByLabelText('Mot de passe actuel')
    const newPassword = () => card('Mot de passe').getByLabelText('Nouveau mot de passe')
    const confirmation = () =>
      card('Mot de passe').getByLabelText('Confirmer le nouveau mot de passe')
    const change = () =>
      screen.getByRole('button', { name: /^Changer le mot de passe|Modification…/ })

    it('can show each of its three passwords, and has nothing to save at first', async () => {
      const user = userEvent.setup()
      renderAccount()
      expect(change()).toBeDisabled()
      const eyes = card('Mot de passe').getAllByRole('button', { name: 'Afficher le mot de passe' })
      expect(eyes).toHaveLength(3)

      const confirmationEye = eyes.at(2)
      if (confirmationEye === undefined) throw new Error('No eye on the confirmation')
      await user.click(confirmationEye)

      expect(confirmation()).toHaveAttribute('type', 'text')
      expect(current()).toHaveAttribute('type', 'password')
    })

    it('marks the card as changed, and turns the button on, as soon as something is typed', async () => {
      const user = userEvent.setup()
      renderAccount()

      await user.type(current(), 'm')

      expect(card('Mot de passe').getByText('Modifications non enregistrées')).toBeVisible()
      expect(change()).toBeEnabled()
    })

    it('shows the rule kept once the new password is long enough', async () => {
      const user = userEvent.setup()
      renderAccount()
      const rule = () => card('Mot de passe').getByText('8 caractères minimum')

      await user.type(newPassword(), 'court')
      expect(rule()).not.toHaveClass('text-herb')
      await user.type(newPassword(), 'ement')

      expect(rule()).toHaveClass('text-herb')
    })

    it('sends the new password with the current one, says it was changed, and empties the fields', async () => {
      let sent: unknown
      server.use(
        http.put(updateUrl, async ({ request }) => {
          sent = await request.json()
          return updated()
        }),
      )
      const user = userEvent.setup()
      renderAccount()

      await user.type(current(), 'motdepasse')
      await user.type(newPassword(), 'nouveaumdp7')
      await user.type(confirmation(), 'nouveaumdp7')
      await user.click(change())

      expect(await screen.findByText('Mot de passe modifié', { selector: 'p' })).toBeVisible()
      expect(sent).toEqual({ password: 'nouveaumdp7', currentPassword: 'motdepasse' })
      expect(current()).toHaveValue('')
      expect(newPassword()).toHaveValue('')
      expect(confirmation()).toHaveValue('')
      expect(sessionStore.getSnapshot()).toMatchObject({ status: 'member' })
      await waitFor(() => {
        expect(change()).toBeDisabled()
      })
    })

    it('says the two new passwords differ, on the confirmation, and sends nothing', async () => {
      let calls = 0
      server.use(
        http.put(updateUrl, () => {
          calls += 1
          return updated()
        }),
      )
      const user = userEvent.setup()
      renderAccount()

      await user.type(current(), 'motdepasse')
      await user.type(newPassword(), 'nouveaumdp7')
      await user.type(confirmation(), 'nouveaumdp8')
      await user.click(change())

      expect(
        await screen.findByText('Les deux mots de passe ne sont pas identiques.'),
      ).toBeVisible()
      expect(confirmation()).toBeInvalid()
      expect(newPassword()).toBeValid()
      expect(calls).toBe(0)
    })

    it('puts the rule in error for a new password that is too short, and asks for the current one', async () => {
      const user = userEvent.setup()
      renderAccount()

      await user.type(newPassword(), 'abc123')
      await user.type(confirmation(), 'abc123')
      await user.click(change())

      await waitFor(() => {
        expect(newPassword()).toBeInvalid()
      })
      expect(newPassword()).toHaveAccessibleDescription('8 caractères minimum')
      expect(screen.getByText('Indique ton mot de passe actuel.')).toBeVisible()
    })

    it('says the current password is wrong (403) on its field, and keeps the typing', async () => {
      server.use(http.put(updateUrl, () => problemResponse(403)))
      const user = userEvent.setup()
      renderAccount()

      await user.type(current(), 'mauvais')
      await user.type(newPassword(), 'nouveaumdp7')
      await user.type(confirmation(), 'nouveaumdp7')
      await user.click(change())

      expect(await screen.findByText('Le mot de passe actuel est incorrect.')).toBeVisible()
      expect(current()).toBeInvalid()
      expect(current()).toHaveValue('mauvais')
      expect(newPassword()).toHaveValue('nouveaumdp7')
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('reports a failure of the server in a notification, keeps the fields, and retries on demand', async () => {
      let answers = 0
      server.use(
        http.put(updateUrl, () => {
          answers += 1
          return answers === 1 ? HttpResponse.error() : updated()
        }),
      )
      const user = userEvent.setup()
      renderAccount()
      await user.type(current(), 'motdepasse')
      await user.type(newPassword(), 'nouveaumdp7')
      await user.type(confirmation(), 'nouveaumdp7')
      await user.click(change())

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent(
        'Impossible de joindre le serveur. Vérifie ta connexion, puis réessaie.',
      )
      expect(newPassword()).toHaveValue('nouveaumdp7')
      await user.click(within(alert).getByRole('button', { name: 'Réessayer' }))

      expect(await screen.findByText('Mot de passe modifié', { selector: 'p' })).toBeVisible()
    })
  })
})
