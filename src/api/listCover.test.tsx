import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { logger } from '../lib/logger'
import { aList } from '../test/fakeLists'
import { fakeToken } from '../test/fakeToken'
import { problemResponse } from '../test/problem'
import { createQueryWrapper } from '../test/queryWrapper'
import { server } from '../test/server'
import { API_BASE_URL } from './apiConfig'
import { listKeys } from './listKeys'
import { useListCover } from './lists'
import { sessionStore } from './sessionStore'

const coverUrl = `${API_BASE_URL}/lists/l-1/cover`
const photo = () => new HttpResponse('jpeg bytes', { headers: { 'Content-Type': 'image/jpeg' } })

beforeEach(() => {
  sessionStore.signIn(fakeToken())
})

/** The requests that reach the photo's address, as « query string » and the conditional headers they carried. */
function spyOnCover(respond: () => Response = photo) {
  const requests: { search: string; authorization: string | null; conditional: string | null }[] =
    []
  server.use(
    http.get(coverUrl, ({ request }) => {
      requests.push({
        search: new URL(request.url).search,
        authorization: request.headers.get('Authorization'),
        conditional: request.headers.get('If-None-Match'),
      })
      return respond()
    }),
  )
  return requests
}

describe('useListCover', () => {
  it('fetches a tile’s photo with the token, in the one query order the browser caches by', async () => {
    const requests = spyOnCover()
    const { result } = renderHook(() => useListCover(aList({ coverVersion: 'v7' }), 'thumbnail'), {
      wrapper: createQueryWrapper().wrapper,
    })

    await waitFor(() => {
      expect(result.current).toMatch(/^blob:/)
    })

    expect(requests).toHaveLength(1)
    expect(requests[0]?.search).toBe('?v=v7&variant=thumbnail')
    expect(requests[0]?.authorization).toMatch(/^Bearer /)
  })

  it('asks the full size for the banner, and never sets a conditional header', async () => {
    const requests = spyOnCover()
    const { result } = renderHook(() => useListCover(aList({ coverVersion: 'v7' }), 'full'), {
      wrapper: createQueryWrapper().wrapper,
    })

    await waitFor(() => {
      expect(result.current).toMatch(/^blob:/)
    })

    expect(requests[0]?.search).toBe('?v=v7')
    expect(requests[0]?.conditional).toBeNull()
  })

  it('asks for nothing when the list has no photo', () => {
    const requests = spyOnCover()
    const { result } = renderHook(() => useListCover(aList({ coverVersion: null }), 'thumbnail'), {
      wrapper: createQueryWrapper().wrapper,
    })

    expect(result.current).toBeUndefined()
    expect(requests).toHaveLength(0)
  })

  it('asks for nothing, and shows nothing, without a member', () => {
    sessionStore.signOut()
    const requests = spyOnCover()
    const { result } = renderHook(() => useListCover(aList({ coverVersion: 'v7' }), 'thumbnail'), {
      wrapper: createQueryWrapper().wrapper,
    })

    expect(result.current).toBeUndefined()
    expect(requests).toHaveLength(0)
  })

  it('does not show a photo it already holds once the session is over', async () => {
    spyOnCover()
    const { result } = renderHook(() => useListCover(aList({ coverVersion: 'v7' }), 'thumbnail'), {
      wrapper: createQueryWrapper().wrapper,
    })
    await waitFor(() => {
      expect(result.current).toMatch(/^blob:/)
    })

    sessionStore.expire(sessionStore.getToken() ?? '')

    await waitFor(() => {
      expect(result.current).toBeUndefined()
    })
  })

  it('revokes its address when nothing shows the photo any more', async () => {
    spyOnCover()
    const revoke = vi.spyOn(URL, 'revokeObjectURL')
    const { result, unmount } = renderHook(
      () => useListCover(aList({ coverVersion: 'v7' }), 'thumbnail'),
      { wrapper: createQueryWrapper().wrapper },
    )
    await waitFor(() => {
      expect(result.current).toMatch(/^blob:/)
    })
    const shown = result.current

    unmount()

    expect(revoke).toHaveBeenCalledWith(shown)
  })

  it('does not replay a refused read: the session ends and there is no photo', async () => {
    const requests = spyOnCover(() => problemResponse(401))
    const { result } = renderHook(() => useListCover(aList({ coverVersion: 'v7' }), 'thumbnail'), {
      wrapper: createQueryWrapper().wrapper,
    })

    await waitFor(() => {
      expect(sessionStore.getSnapshot().status).toBe('expired')
    })

    expect(requests).toHaveLength(1)
    expect(result.current).toBeUndefined()
  })

  it('shows nothing, and does not loop, when the connection fails', async () => {
    let calls = 0
    server.use(
      http.get(coverUrl, () => {
        calls += 1
        return HttpResponse.error()
      }),
    )
    const { client, wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useListCover(aList({ coverVersion: 'v7' }), 'thumbnail'), {
      wrapper,
    })

    await waitFor(() => {
      expect(client.getQueryCache().findAll({ queryKey: ['list-covers'] })[0]?.state.status).toBe(
        'error',
      )
    })

    expect(result.current).toBeUndefined()
    expect(calls).toBe(1)
  })

  describe('when the version answers 404', () => {
    it('reads the list again, once, and lets the new version replace the old', async () => {
      spyOnCover(() => problemResponse(404))
      let reads = 0
      server.use(
        http.get(`${API_BASE_URL}/lists/l-1`, () => {
          reads += 1
          return HttpResponse.json(aList({ coverVersion: 'v8' }))
        }),
      )
      const { client, wrapper } = createQueryWrapper()
      const { result } = renderHook(
        () => useListCover(aList({ coverVersion: 'v7' }), 'thumbnail'),
        { wrapper },
      )

      await waitFor(() => {
        expect(reads).toBe(1)
      })

      await waitFor(() => {
        expect(client.getQueryData(listKeys.detail('l-1'))).toMatchObject({ coverVersion: 'v8' })
      })
      expect(result.current).toBeUndefined()
    })

    it('shows the list without a photo, and says so in the logs, when it still points at that version', async () => {
      const requests = spyOnCover(() => problemResponse(404))
      let reads = 0
      server.use(
        http.get(`${API_BASE_URL}/lists/l-1`, () => {
          reads += 1
          return HttpResponse.json(aList({ coverVersion: 'v7' }))
        }),
      )
      const warn = vi.spyOn(logger, 'warn')
      const { client, wrapper } = createQueryWrapper()
      const { result } = renderHook(
        () => useListCover(aList({ coverVersion: 'v7' }), 'thumbnail'),
        { wrapper },
      )

      await waitFor(() => {
        expect(warn).toHaveBeenCalled()
      })

      expect(result.current).toBeUndefined()
      expect(requests).toHaveLength(1)
      expect(reads).toBe(1)
      // Settled as « no photo »: a re-render does not ask again.
      expect(
        client.getQueryCache().findAll({ queryKey: ['list-covers'] })[0]?.state.data,
      ).toBeNull()
    })
  })
})
