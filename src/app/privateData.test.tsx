import { act, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useListCover, useLists } from '../api/lists'
import { sessionStore } from '../api/sessionStore'
import { memberKey } from '../lib/memberStorage'
import { API_BASE_URL } from '../api/apiConfig'
import { aList } from '../test/fakeLists'
import { fakeToken } from '../test/fakeToken'
import { renderRoutes } from '../test/renderRoutes'
import { server } from '../test/server'
import { RootLayout } from './RootLayout'

/**
 * Two members use the same tab, one after the other. Nothing of the first (their lists, the photo of
 * one of them, what they left on the device) may be on screen for the second, not even for one render.
 */
const tokenOf = {
  anne: fakeToken({ userId: 'u-anne', username: 'anne' }),
  basile: fakeToken({ userId: 'u-basile', username: 'basile' }),
}
const listsOf = {
  anne: [aList({ id: 'a-1', name: 'Recettes secrètes d’Anne', coverVersion: 'vA' })],
  basile: [aList({ id: 'b-1', name: 'Liste de Basile', coverVersion: null })],
}

function backend() {
  const memberOf = (request: Request) =>
    request.headers.get('Authorization') === `Bearer ${tokenOf.anne}` ? 'anne' : 'basile'
  server.use(
    http.get(`${API_BASE_URL}/lists`, ({ request }) =>
      HttpResponse.json(listsOf[memberOf(request)]),
    ),
    http.get(
      `${API_BASE_URL}/lists/a-1/cover`,
      () => new HttpResponse('photo of anne', { headers: { 'Content-Type': 'image/jpeg' } }),
    ),
  )
}

/** Every render of the page, so that a flash of the previous member's data cannot hide between two checks. */
const rendered: string[] = []

function Page() {
  const lists = useLists().data ?? []
  return (
    <ul>
      {lists.map((list) => (
        <Tile key={list.id} list={list} />
      ))}
    </ul>
  )
}

function Tile({ list }: { list: ReturnType<typeof aList> }) {
  const photo = useListCover(list, 'thumbnail')
  rendered.push(`${list.name}|${photo ?? 'no photo'}`)
  return (
    <li>
      {list.name}
      {photo !== undefined && <img src={photo} alt="" data-testid="photo" />}
    </li>
  )
}

function renderPage() {
  return renderRoutes(
    [
      {
        element: <RootLayout />,
        children: [
          { path: '/', element: <Page /> },
          { path: '/ailleurs', element: <p>Ailleurs</p> },
        ],
      },
    ],
    '/',
  )
}

beforeEach(() => {
  rendered.length = 0
  backend()
})

afterEach(() => {
  window.localStorage.clear()
})

describe('private data on a shared device', () => {
  it('never shows the lists or the photo of the first member to the next one', async () => {
    sessionStore.signIn(tokenOf.anne)
    const { router } = renderPage()
    await screen.findByTestId('photo')
    const annesPhoto = screen.getByTestId('photo').getAttribute('src') ?? ''
    const revoke = vi.spyOn(URL, 'revokeObjectURL')
    // The first member leaves the page, then signs out; the next one signs in and opens the same page.
    await act(() => router.navigate('/ailleurs'))
    act(() => {
      sessionStore.signOut()
      sessionStore.signIn(tokenOf.basile)
    })
    rendered.length = 0

    await act(() => router.navigate('/'))

    expect(await screen.findByText('Liste de Basile')).toBeVisible()
    expect(screen.queryByText('Recettes secrètes d’Anne')).not.toBeInTheDocument()
    expect(rendered.some((line) => line.includes('Anne'))).toBe(false)
    expect(rendered.some((line) => line.includes(annesPhoto))).toBe(false)
    expect(revoke).toHaveBeenCalledWith(annesPhoto)
  })

  it('does not even need the first member to sign out: the next sign-in drops the data', async () => {
    sessionStore.signIn(tokenOf.anne)
    const { router } = renderPage()
    await screen.findByText('Recettes secrètes d’Anne')
    await act(() => router.navigate('/ailleurs'))
    act(() => {
      sessionStore.signIn(tokenOf.basile)
    })
    rendered.length = 0

    await act(() => router.navigate('/'))

    expect(await screen.findByText('Liste de Basile')).toBeVisible()
    expect(rendered.some((line) => line.includes('Anne'))).toBe(false)
  })

  it('replaces the lists of a page that stays open when the next member signs in', async () => {
    sessionStore.signIn(tokenOf.anne)
    renderPage()
    await screen.findByText('Recettes secrètes d’Anne')

    act(() => {
      sessionStore.signIn(tokenOf.basile)
    })

    expect(await screen.findByText('Liste de Basile')).toBeVisible()
    await waitFor(() => {
      expect(screen.queryByText('Recettes secrètes d’Anne')).not.toBeInTheDocument()
    })
  })

  it('keeps the lists on the page of a member whose session expires, but takes the photos away', async () => {
    sessionStore.signIn(tokenOf.anne)
    renderPage()
    await screen.findByTestId('photo')
    const annesPhoto = screen.getByTestId('photo').getAttribute('src') ?? ''
    const revoke = vi.spyOn(URL, 'revokeObjectURL')

    act(() => {
      sessionStore.expire(tokenOf.anne)
    })

    expect(screen.getByText('Recettes secrètes d’Anne')).toBeVisible()
    await waitFor(() => {
      expect(screen.queryByTestId('photo')).not.toBeInTheDocument()
    })
    expect(revoke).toHaveBeenCalledWith(annesPhoto)
  })

  it('forgets what the first member left on the device when another signs in, and only then', async () => {
    window.localStorage.setItem(memberKey('u-anne', 'draft.new'), 'recette d’Anne')
    sessionStore.signIn(tokenOf.anne)
    renderPage()
    await screen.findByText('Recettes secrètes d’Anne')
    act(() => {
      sessionStore.signOut()
    })
    expect(window.localStorage.getItem(memberKey('u-anne', 'draft.new'))).not.toBeNull()

    act(() => {
      sessionStore.signIn(tokenOf.basile)
    })

    expect(window.localStorage.getItem(memberKey('u-anne', 'draft.new'))).toBeNull()
  })
})
