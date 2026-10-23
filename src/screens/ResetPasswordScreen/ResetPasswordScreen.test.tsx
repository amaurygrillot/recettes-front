import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { API_BASE_URL } from '../../api/apiConfig'
import { sessionStore } from '../../api/sessionStore'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { problemResponse } from '../../test/problem'
import { renderRoutes } from '../../test/renderRoutes'
import { server } from '../../test/server'
import { ResetPasswordScreen } from './ResetPasswordScreen'

const resetUrl = `${API_BASE_URL}/users/reinit-password`
const LINK = '/reset-password?token=t-123&email=odile%40exemple.fr'

function renderReset(path = LINK) {
  return renderRoutes(
    [
      { path: '/reset-password', element: <ResetPasswordScreen /> },
      { path: '/connexion', element: <p>Page de connexion</p> },
      { path: '/mot-de-passe-oublie', element: <p>Page du mot de passe oublié</p> },
    ],
    path,
  )
}

const changed = () => new HttpResponse(null, { status: 204 })

const newPassword = () => screen.getByLabelText('Nouveau mot de passe')
const confirmation = () => screen.getByLabelText('Confirmer le mot de passe')
const changeButton = () => screen.getByRole('button', { name: 'Changer mon mot de passe' })

async function choose(first = 'nouveaumdp7', second = first) {
  const user = userEvent.setup()
  if (first) await user.type(newPassword(), first)
  if (second) await user.type(confirmation(), second)
  await user.click(changeButton())
  return user
}

describe('ResetPasswordScreen', () => {
  describe('with the link of the e-mail', () => {
    it('names the account without giving its address away, and asks for the new password twice', () => {
      renderReset()

      expect(screen.getByRole('heading', { level: 1, name: 'Nouveau mot de passe' })).toBeVisible()
      expect(screen.getByText('o***@exemple.fr')).toBeVisible()
      expect(document.body).not.toHaveTextContent('odile@exemple.fr')
      expect(newPassword()).toHaveAttribute('autocomplete', 'new-password')
      expect(confirmation()).toHaveAttribute('autocomplete', 'new-password')
      expect(confirmation()).toHaveAttribute('type', 'password')
    })

    it('can show the first password only: the confirmation stays hidden', () => {
      renderReset()

      expect(screen.getAllByRole('button', { name: 'Afficher le mot de passe' })).toHaveLength(1)
    })

    it('has no way back: the member came from an e-mail', () => {
      renderReset()

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('has no accessibility violation', async () => {
      const { container } = renderReset()

      await expectNoAccessibilityViolations(container)
    })
  })

  describe('with a link that is cut short', () => {
    it.each([
      ['no token', '/reset-password?email=odile%40exemple.fr'],
      ['no address', '/reset-password?token=t-123'],
      ['an address that is not one', '/reset-password?token=t-123&email=odile'],
      ['nothing at all', '/reset-password'],
    ])(
      'shows the one « lien plus valable » state for %s, and asks nothing of the server',
      (_what, path) => {
        let calls = 0
        server.use(
          http.put(resetUrl, () => {
            calls += 1
            return changed()
          }),
        )
        renderReset(path)

        expect(
          screen.getByRole('heading', { level: 1, name: "Ce lien n'est plus valable" }),
        ).toBeVisible()
        expect(screen.getByRole('alert')).toHaveTextContent(
          "Ce lien n'est plus valable. Il expire au bout de 15 minutes et ne sert qu'une fois.",
        )
        expect(screen.queryByLabelText('Nouveau mot de passe')).not.toBeInTheDocument()
        expect(calls).toBe(0)
      },
    )

    it('leads to a new link', () => {
      renderReset('/reset-password')

      expect(screen.getByRole('link', { name: 'Demander un nouveau lien' })).toHaveAttribute(
        'href',
        '/mot-de-passe-oublie',
      )
    })

    it('has no accessibility violation', async () => {
      const { container } = renderReset('/reset-password')

      await expectNoAccessibilityViolations(container)
    })
  })

  describe('what is checked before asking the server', () => {
    it('puts the rule in error when the password is too short, and sends nothing', async () => {
      let calls = 0
      server.use(
        http.put(resetUrl, () => {
          calls += 1
          return changed()
        }),
      )
      renderReset()

      await choose('abc123')

      await waitFor(() => {
        expect(newPassword()).toBeInvalid()
      })
      expect(newPassword()).toHaveAccessibleDescription('8 caractères minimum')
      expect(calls).toBe(0)
    })

    it('says the two passwords differ, on the confirmation', async () => {
      renderReset()

      await choose('nouveaumdp7', 'nouveaumdp8')

      expect(
        await screen.findByText('Les deux mots de passe ne sont pas identiques.'),
      ).toBeVisible()
      expect(confirmation()).toBeInvalid()
      expect(newPassword()).toBeValid()
    })

    it('shows the password rule kept as soon as it is', async () => {
      const user = userEvent.setup()
      renderReset()

      await user.type(newPassword(), 'nouveaumdp7')

      expect(screen.getByText('8 caractères minimum')).toHaveClass('text-herb')
    })
  })

  describe('when the password is changed (204)', () => {
    it('sends the address, the token and the new password', async () => {
      let sent: unknown
      server.use(
        http.put(resetUrl, async ({ request }) => {
          sent = await request.json()
          return changed()
        }),
      )
      renderReset()

      await choose()

      await screen.findByRole('heading', { level: 1, name: 'Mot de passe modifié' })
      expect(sent).toEqual({
        email: 'odile@exemple.fr',
        token: 't-123',
        newPassword: 'nouveaumdp7',
      })
    })

    it('says so and leads to the sign-in, without signing anybody in', async () => {
      server.use(http.put(resetUrl, changed))
      renderReset()

      await choose()

      expect(await screen.findByRole('status')).toHaveTextContent(
        'Mot de passe modifié. Tu peux te connecter.',
      )
      expect(screen.getByRole('link', { name: 'Se connecter' })).toHaveAttribute(
        'href',
        '/connexion',
      )
      expect(sessionStore.getSnapshot()).toEqual({ status: 'visitor' })
    })

    it('starts the result on its title, since the form that had the focus is gone', async () => {
      server.use(http.put(resetUrl, changed))
      renderReset()

      await choose()

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Mot de passe modifié' }),
      ).toHaveFocus()
    })

    it('has no accessibility violation', async () => {
      server.use(http.put(resetUrl, changed))
      const { container } = renderReset()

      await choose()
      await screen.findByRole('heading', { level: 1, name: 'Mot de passe modifié' })

      await expectNoAccessibilityViolations(container)
    })
  })

  describe('when the server refuses the link (400)', () => {
    it('shows the same single state as for a link that is cut short', async () => {
      server.use(http.put(resetUrl, () => problemResponse(400, 'Invalid or expired token')))
      renderReset()

      await choose()

      expect(
        await screen.findByRole('heading', { level: 1, name: "Ce lien n'est plus valable" }),
      ).toBeVisible()
      expect(screen.getByRole('link', { name: 'Demander un nouveau lien' })).toHaveAttribute(
        'href',
        '/mot-de-passe-oublie',
      )
      expect(screen.queryByLabelText('Nouveau mot de passe')).not.toBeInTheDocument()
    })
  })

  describe('when something else goes wrong, it says which and keeps the form', () => {
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
    ])('reports %s', async (_what, answer, sentence) => {
      server.use(http.put(resetUrl, answer))
      renderReset()

      await choose()

      expect(await screen.findByRole('alert')).toHaveTextContent(sentence)
      expect(newPassword()).toHaveValue('nouveaumdp7')
      expect(newPassword()).toBeEnabled()
    })

    it('lets the member try again with the same link', async () => {
      server.use(http.put(resetUrl, () => problemResponse(500)))
      renderReset()
      const user = await choose()
      await screen.findByRole('alert')
      server.use(http.put(resetUrl, changed))

      await user.click(changeButton())

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Mot de passe modifié' }),
      ).toBeVisible()
    })
  })

  describe('while the password is being changed', () => {
    it('locks the form, which says so, and cannot be sent twice', async () => {
      let calls = 0
      server.use(
        http.put(resetUrl, async () => {
          calls += 1
          await delay(60)
          return changed()
        }),
      )
      renderReset()
      const user = await choose()

      expect(screen.getByRole('button', { name: 'Modification…' })).toHaveAttribute(
        'aria-busy',
        'true',
      )
      expect(newPassword()).toBeDisabled()
      await user.keyboard('{Enter}')
      await screen.findByRole('heading', { level: 1, name: 'Mot de passe modifié' })

      expect(calls).toBe(1)
    })
  })
})
