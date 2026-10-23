import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { API_BASE_URL } from '../api/apiConfig'
import { sessionStore } from '../api/sessionStore'
import { fakeToken } from '../test/fakeToken'
import { renderRoutes } from '../test/renderRoutes'
import { server } from '../test/server'
import { routes } from './router'

function serveFeed(content: object[]) {
  server.use(
    http.get(`${API_BASE_URL}/categories/hierarchy`, () => HttpResponse.json([])),
    http.get(`${API_BASE_URL}/tags`, () => HttpResponse.json([])),
    http.get(`${API_BASE_URL}/recipes`, () =>
      HttpResponse.json({ content, number: 0, last: true, totalElements: content.length }),
    ),
    http.get(`${API_BASE_URL}/categories`, () => HttpResponse.json([])),
  )
}

function scrollTo(y: number) {
  act(() => {
    window.scrollY = y
    window.dispatchEvent(new Event('scroll'))
  })
}

/** The « + » of the phone's bar: the one whose wrapper sits beside the phone navigation. */
function phoneCreate() {
  const wrapper = screen.getByRole('navigation', { name: 'Navigation principale' }).parentElement
  if (wrapper === null) throw new Error('The phone navigation has no wrapper')
  return within(wrapper).queryByRole('link', { name: 'Nouvelle recette' })
}

describe('the phone « + » of the shell', () => {
  beforeEach(() => {
    expect(sessionStore.signIn(fakeToken())).toBe(true)
  })

  afterEach(() => {
    window.scrollY = 0
  })

  it('shows its label at the top of a page with a feed', async () => {
    serveFeed([{ id: '1', title: 'Gratin dauphinois' }])
    renderRoutes(routes, '/')
    await screen.findByRole('link', { name: 'Gratin dauphinois' })

    expect(phoneCreate()).toHaveTextContent('Nouvelle recette')
  })

  it('shrinks to the round « + » while the reader goes down, and comes back as they go up', async () => {
    serveFeed([{ id: '1', title: 'Gratin dauphinois' }])
    renderRoutes(routes, '/')
    await screen.findByRole('link', { name: 'Gratin dauphinois' })

    scrollTo(400)
    expect(phoneCreate()).toHaveTextContent('')
    expect(phoneCreate()).toHaveAccessibleName('Nouvelle recette')

    scrollTo(300)
    expect(phoneCreate()).toHaveTextContent('Nouvelle recette')
  })

  it('is hidden when the feed is empty, since the page invites to write the first recipe itself', async () => {
    serveFeed([])
    renderRoutes(routes, '/')
    await screen.findByText('Ton carnet attend sa première recette')

    expect(phoneCreate()).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Créer une recette' })).toHaveAttribute(
      'href',
      '/recettes/nouvelle',
    )
  })

  it('leaves room for itself at the bottom of the page, and none when it is hidden', async () => {
    serveFeed([{ id: '1', title: 'Gratin dauphinois' }])
    const shown = renderRoutes(routes, '/')
    await screen.findByRole('link', { name: 'Gratin dauphinois' })
    expect(screen.getByRole('main').parentElement).toHaveClass('pb-26')
    shown.unmount()

    serveFeed([])
    renderRoutes(routes, '/')
    await screen.findByText('Ton carnet attend sa première recette')
    expect(screen.getByRole('main').parentElement).not.toHaveClass('pb-26')
  })

  it('is the plain round « + » on the other pages, and again after leaving the home page', async () => {
    serveFeed([{ id: '1', title: 'Gratin dauphinois' }])
    const user = userEvent.setup()
    renderRoutes(routes, '/')
    await screen.findByRole('link', { name: 'Gratin dauphinois' })
    expect(phoneCreate()).toHaveTextContent('Nouvelle recette')

    await user.click(
      within(screen.getByRole('navigation', { name: 'Navigation principale' })).getByRole('link', {
        name: 'Rechercher',
      }),
    )
    await screen.findByRole('heading', { level: 1, name: 'Rechercher' })

    expect(phoneCreate()).toHaveTextContent('')
    expect(phoneCreate()).toHaveAccessibleName('Nouvelle recette')
  })

  it('is back after an empty home page that hid it, when the next page needs it', async () => {
    serveFeed([])
    const user = userEvent.setup()
    renderRoutes(routes, '/')
    await screen.findByText('Ton carnet attend sa première recette')
    expect(phoneCreate()).not.toBeInTheDocument()

    await user.click(
      within(screen.getByRole('navigation', { name: 'Navigation principale' })).getByRole('link', {
        name: 'Rechercher',
      }),
    )
    await screen.findByRole('heading', { level: 1, name: 'Rechercher' })

    expect(phoneCreate()).toBeInTheDocument()
  })

  describe('on the pages that search', () => {
    it('shows its label at the top of « Mes recettes », where recipes are written', async () => {
      serveFeed([{ id: '1', title: 'Gratin dauphinois' }])
      renderRoutes(routes, '/mes-recettes')
      await screen.findByRole('link', { name: 'Gratin dauphinois' })

      expect(phoneCreate()).toHaveTextContent('Nouvelle recette')
    })

    it('hides it in « Mes recettes » while the list is empty, the empty state having its own button', async () => {
      serveFeed([])
      renderRoutes(routes, '/mes-recettes')
      await screen.findByText("Tu n'as pas encore de recette")

      expect(phoneCreate()).not.toBeInTheDocument()
    })

    it('stays the plain round « + » on the search page', async () => {
      serveFeed([{ id: '1', title: 'Gratin dauphinois' }])
      renderRoutes(routes, '/rechercher')
      await screen.findByRole('link', { name: 'Gratin dauphinois' })

      expect(phoneCreate()).toHaveTextContent('')
      expect(phoneCreate()).toHaveAccessibleName('Nouvelle recette')
    })
  })
})
