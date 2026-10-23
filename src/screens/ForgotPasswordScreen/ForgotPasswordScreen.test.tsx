import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { API_BASE_URL } from '../../api/apiConfig'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { problemResponse } from '../../test/problem'
import { renderRoutes } from '../../test/renderRoutes'
import { server } from '../../test/server'
import { ForgotPasswordScreen } from './ForgotPasswordScreen'

const requestUrl = `${API_BASE_URL}/auth/reinit-password`

function renderForgot() {
  return renderRoutes(
    [
      { path: '/mot-de-passe-oublie', element: <ForgotPasswordScreen /> },
      { path: '/connexion', element: <p>Page de connexion</p> },
    ],
    '/mot-de-passe-oublie',
  )
}

const accepted = () => new HttpResponse(null, { status: 204 })

const emailField = () => screen.getByLabelText('Adresse e-mail')
const sendButton = () => screen.getByRole('button', { name: 'Envoyer le lien' })

async function askFor(email = 'odile@exemple.fr') {
  const user = userEvent.setup()
  await user.type(emailField(), email)
  await user.click(sendButton())
  return user
}

describe('ForgotPasswordScreen', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('the form', () => {
    it('explains in one sentence, asks for an address, and has a way back', () => {
      renderForgot()

      expect(screen.getByRole('heading', { level: 1, name: 'Mot de passe oublié' })).toBeVisible()
      expect(
        screen.getByText(
          "Indique l'adresse e-mail de ton compte, on t'envoie un lien pour choisir un nouveau mot de passe.",
        ),
      ).toBeVisible()
      expect(emailField()).toHaveAttribute('type', 'email')
      expect(emailField()).toHaveAttribute('autocomplete', 'email')
      expect(screen.getByRole('link', { name: 'Retour' })).toHaveAttribute('href', '/connexion')
      expect(screen.getByRole('link', { name: 'Retour à la connexion' })).toHaveAttribute(
        'href',
        '/connexion',
      )
    })

    it('has no accessibility violation', async () => {
      const { container } = renderForgot()

      await expectNoAccessibilityViolations(container)
    })

    it('checks only the shape of the address, with an example, and asks nothing of the server', async () => {
      let calls = 0
      server.use(
        http.post(requestUrl, () => {
          calls += 1
          return accepted()
        }),
      )
      renderForgot()

      await askFor('odile@exemple')

      expect(
        await screen.findByText(
          "Cette adresse e-mail n'a pas l'air valide. Exemple : prenom@exemple.fr",
        ),
      ).toBeVisible()
      expect(emailField()).toBeInvalid()
      expect(calls).toBe(0)
    })

    it('asks for an address when none is typed', async () => {
      renderForgot()

      await userEvent.setup().click(sendButton())

      expect(await screen.findByText('Indique ton adresse e-mail.')).toBeVisible()
    })
  })

  describe('when the link is asked for (204)', () => {
    it('sends the address without its stray spaces', async () => {
      let sent: unknown
      server.use(
        http.post(requestUrl, async ({ request }) => {
          sent = await request.json()
          return accepted()
        }),
      )
      renderForgot()

      await askFor('  odile@exemple.fr ')

      await screen.findByRole('heading', { level: 1, name: 'Regarde ta boîte mail' })
      expect(sent).toEqual({ email: 'odile@exemple.fr' })
    })

    it('says the same neutral thing whatever the address, and never repeats it', async () => {
      server.use(http.post(requestUrl, accepted))
      renderForgot()

      await askFor()

      expect(await screen.findByRole('status')).toHaveTextContent(
        'Si cette adresse correspond à un compte, un e-mail vient de partir. Le lien est valable 15 minutes.',
      )
      expect(document.body).not.toHaveTextContent('odile@exemple.fr')
    })

    it('has no accessibility violation', async () => {
      server.use(http.post(requestUrl, accepted))
      const { container } = renderForgot()

      await askFor()
      await screen.findByRole('heading', { level: 1, name: 'Regarde ta boîte mail' })

      await expectNoAccessibilityViolations(container)
    })

    it('starts the confirmation on its title, since the form that had the focus is gone', async () => {
      server.use(http.post(requestUrl, accepted))
      renderForgot()

      await askFor()

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Regarde ta boîte mail' }),
      ).toHaveFocus()
    })

    it('keeps a way back to the sign-in', async () => {
      server.use(http.post(requestUrl, accepted))
      renderForgot()

      await askFor()

      expect(await screen.findByRole('link', { name: 'Retour à la connexion' })).toHaveAttribute(
        'href',
        '/connexion',
      )
    })
  })

  describe('the pause before another e-mail', () => {
    async function sentWithFakeTimers() {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      server.use(http.post(requestUrl, accepted))
      renderForgot()
      const user = userEvent.setup({ advanceTimers: (ms) => vi.advanceTimersByTime(ms) })
      await user.type(emailField(), 'odile@exemple.fr')
      await user.click(sendButton())
      await screen.findByRole('heading', { level: 1, name: 'Regarde ta boîte mail' })
      return user
    }

    async function pass(seconds: number) {
      for (let second = 0; second < seconds; second += 1) {
        await act(async () => {
          await vi.advanceTimersByTimeAsync(1000)
        })
      }
    }

    it('writes the countdown on a disabled button', async () => {
      await sentWithFakeTimers()

      const resend = screen.getByRole('button', { name: /^Renvoyer un e-mail/ })
      expect(resend).toBeDisabled()
      expect(screen.getByRole('timer')).toHaveTextContent('· dans 60 s')

      await pass(18)

      expect(screen.getByRole('timer')).toHaveTextContent('· dans 42 s')
    })

    it('lets another e-mail be asked for once the pause is over, and starts a new pause', async () => {
      let calls = 0
      const user = await sentWithFakeTimers()
      server.use(
        http.post(requestUrl, () => {
          calls += 1
          return accepted()
        }),
      )

      await pass(60)
      const resend = screen.getByRole('button', { name: 'Renvoyer un e-mail' })
      expect(resend).toBeEnabled()
      expect(screen.queryByRole('timer')).not.toBeInTheDocument()
      await user.click(resend)

      await waitFor(() => {
        expect(calls).toBe(1)
      })
      expect(await screen.findByRole('timer')).toHaveTextContent('· dans 60 s')
    })

    it('says so when asking again fails, and offers the button again', async () => {
      const user = await sentWithFakeTimers()
      await pass(60)
      server.use(http.post(requestUrl, () => HttpResponse.error()))

      await user.click(screen.getByRole('button', { name: 'Renvoyer un e-mail' }))

      expect(await screen.findByRole('alert')).toHaveTextContent(
        "Impossible d'envoyer l'e-mail pour l'instant. Vérifie ta connexion, puis réessaie.",
      )
      expect(screen.getByRole('button', { name: 'Renvoyer un e-mail' })).toBeEnabled()
    })
  })

  describe('while the request is on its way', () => {
    it('locks the field and the button, which says so, and cannot send twice', async () => {
      let calls = 0
      server.use(
        http.post(requestUrl, async () => {
          calls += 1
          await delay(60)
          return accepted()
        }),
      )
      renderForgot()
      const user = await askFor()

      expect(screen.getByRole('button', { name: 'Envoi…' })).toHaveAttribute('aria-busy', 'true')
      expect(emailField()).toBeDisabled()
      await user.keyboard('{Enter}')
      await screen.findByRole('heading', { level: 1, name: 'Regarde ta boîte mail' })

      expect(calls).toBe(1)
    })
  })

  describe('when the request fails, it says which and keeps the address', () => {
    it('reports a network failure with the design’s sentence, and « Réessayer » sends it again', async () => {
      server.use(http.post(requestUrl, () => HttpResponse.error()))
      renderForgot()
      const user = await askFor()

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent(
        "Impossible d'envoyer l'e-mail pour l'instant. Vérifie ta connexion, puis réessaie.",
      )
      expect(emailField()).toHaveValue('odile@exemple.fr')
      server.use(http.post(requestUrl, accepted))
      await user.click(screen.getByRole('button', { name: 'Réessayer' }))

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Regarde ta boîte mail' }),
      ).toBeVisible()
    })

    it.each([
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
      [
        'too many requests (429, Retry-After)',
        () => problemResponse(429, 'Slow down', { 'Retry-After': '45' }),
        'Tu vas un peu vite. Réessaie dans 45 secondes.',
      ],
    ])('reports %s, and offers to try again', async (_what, answer, sentence) => {
      server.use(http.post(requestUrl, answer))
      renderForgot()

      await askFor()

      expect(await screen.findByRole('alert')).toHaveTextContent(sentence)
      expect(screen.getByRole('button', { name: 'Réessayer' })).toBeVisible()
    })

    it('reports a request the server found invalid (400) without offering to repeat it', async () => {
      server.use(http.post(requestUrl, () => problemResponse(400, 'email: must be well-formed')))
      renderForgot()

      await askFor()

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Certaines informations ne sont pas valides. Vérifie ta saisie, puis réessaie.',
      )
      expect(screen.queryByRole('button', { name: 'Réessayer' })).not.toBeInTheDocument()
    })
  })
})
