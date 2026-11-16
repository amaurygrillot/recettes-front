import { act, renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { aList } from '../test/fakeLists'
import { fakeToken } from '../test/fakeToken'
import { problemResponse, rejectionOf } from '../test/problem'
import { createQueryWrapper } from '../test/queryWrapper'
import { server } from '../test/server'
import { API_BASE_URL } from './apiConfig'
import { ApiRequestError, type ApiFailure } from './failure'
import { listKeys } from './listKeys'
import {
  useAddRecipeToList,
  useCreateList,
  useDeleteList,
  useList,
  useListRecipes,
  useLists,
  useListsContaining,
  useRemoveListCover,
  useRemoveRecipeFromList,
  useSetListCover,
  useUpdateList,
} from './lists'
import { sessionStore } from './sessionStore'

const url = (path: string) => `${API_BASE_URL}${path}`
const typedConflict = (reason: string) =>
  HttpResponse.json(
    {
      status: 409,
      title: 'Conflict',
      detail: 'English words',
      type: `urn:recettes:problem:${reason}`,
    },
    { status: 409, headers: { 'Content-Type': 'application/problem+json' } },
  )

function failureOf(error: unknown): ApiFailure {
  if (error instanceof ApiRequestError) return error.failure
  throw new Error('An ApiRequestError was expected')
}

beforeEach(() => {
  sessionStore.signIn(fakeToken())
})

describe('useLists', () => {
  it('loads the lists of the member, as sorted by the server', async () => {
    server.use(
      http.get(url('/lists'), () =>
        HttpResponse.json([aList({ id: 'a', name: 'Anniversaires' }), aList({ id: 'n' })]),
      ),
    )
    const { result } = renderHook(() => useLists(), { wrapper: createQueryWrapper().wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.map((list) => list.id)).toEqual(['a', 'n'])
  })

  it('is refused when the token is, and the refusal is not replayed as a visitor', async () => {
    let calls = 0
    server.use(
      http.get(url('/lists'), () => {
        calls += 1
        return problemResponse(401)
      }),
    )
    const { result } = renderHook(() => useLists(), { wrapper: createQueryWrapper().wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.failure.kind).toBe('unauthorized')
    expect(calls).toBe(1)
    expect(sessionStore.getSnapshot().status).toBe('expired')
  })
})

describe('useListsContaining', () => {
  it('asks which lists hold the recipe and keeps `containsRecipe`', async () => {
    let containing: string | null = null
    server.use(
      http.get(url('/lists'), ({ request }) => {
        containing = new URL(request.url).searchParams.get('containing')
        return HttpResponse.json([aList({ containsRecipe: true })])
      }),
    )
    const { result } = renderHook(() => useListsContaining('r-9'), {
      wrapper: createQueryWrapper().wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(containing).toBe('r-9')
    expect(result.current.data?.[0]?.containsRecipe).toBe(true)
  })

  it('asks nothing while it is disabled', () => {
    const { result } = renderHook(() => useListsContaining('r-9', false), {
      wrapper: createQueryWrapper().wrapper,
    })

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('fails with a 404 when the recipe is gone', async () => {
    server.use(http.get(url('/lists'), () => problemResponse(404)))
    const { result } = renderHook(() => useListsContaining('r-9'), {
      wrapper: createQueryWrapper().wrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.failure.kind).toBe('not-found')
  })
})

describe('useList', () => {
  it('loads one list', async () => {
    server.use(http.get(url('/lists/l-1'), () => HttpResponse.json(aList({ recipeCount: 12 }))))
    const { result } = renderHook(() => useList('l-1'), { wrapper: createQueryWrapper().wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.recipeCount).toBe(12)
  })

  it.each([
    [401, 'unauthorized'],
    [404, 'not-found'],
    [500, 'server-error'],
  ] as const)('answers a %i as « %s »', async (status, kind) => {
    server.use(http.get(url('/lists/l-1'), () => problemResponse(status)))
    const { result } = renderHook(() => useList('l-1'), { wrapper: createQueryWrapper().wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.failure.kind).toBe(kind)
  })
})

describe('useListRecipes', () => {
  it('reads the content of a list through the recipe search, with its filters and its sort', async () => {
    let query: URLSearchParams | undefined
    server.use(
      http.get(url('/recipes'), ({ request }) => {
        query = new URL(request.url).searchParams
        return HttpResponse.json({
          number: 0,
          last: true,
          content: [{ id: 'r-1', title: 'Bûche' }],
        })
      }),
    )
    const { result } = renderHook(
      () => useListRecipes('l-1', { title: 'bûche', sortBy: 'ADDED_AT' }),
      {
        wrapper: createQueryWrapper().wrapper,
      },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(Object.fromEntries(query ?? [])).toEqual({
      title: 'bûche',
      sortBy: 'ADDED_AT',
      listId: 'l-1',
      page: '0',
    })
  })

  it('is cached among the private queries, never among the public searches', async () => {
    server.use(
      http.get(url('/recipes'), () => HttpResponse.json({ number: 0, last: true, content: [] })),
    )
    const { client, wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useListRecipes('l-1', {}), { wrapper })
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(client.getQueryCache().findAll({ queryKey: listKeys.contentOf('l-1') })).toHaveLength(1)
    expect(client.getQueryCache().findAll({ queryKey: ['recipes'] })).toHaveLength(0)
  })

  it.each([
    [401, 'unauthorized'],
    [404, 'not-found'],
  ] as const)('answers a %i as « %s »', async (status, kind) => {
    server.use(http.get(url('/recipes'), () => problemResponse(status)))
    const { result } = renderHook(() => useListRecipes('l-1', {}), {
      wrapper: createQueryWrapper().wrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.failure.kind).toBe(kind)
  })
})

describe('useCreateList', () => {
  it('creates the list, keeps it as the freshest copy and makes the lists stale', async () => {
    server.use(
      http.post(url('/lists'), () =>
        HttpResponse.json(aList({ id: 'new', name: 'À tester', emoji: '🧪' }), { status: 201 }),
      ),
    )
    const { client, wrapper } = createQueryWrapper()
    client.setQueryData(listKeys.mine, [])
    const { result } = renderHook(() => useCreateList(), { wrapper })

    await act(() => result.current.mutateAsync({ name: 'À tester', emoji: '🧪' }))

    expect(client.getQueryData(listKeys.detail('new'))).toMatchObject({ name: 'À tester' })
    expect(client.getQueryState(listKeys.mine)?.isInvalidated).toBe(true)
  })

  it.each([['recipe-list-name-taken'], ['too-many-recipe-lists']] as const)(
    'tells a 409 of type « %s » apart',
    async (reason) => {
      server.use(http.post(url('/lists'), () => typedConflict(reason)))
      const { result } = renderHook(() => useCreateList(), {
        wrapper: createQueryWrapper().wrapper,
      })

      const error = await rejectionOf(result.current.mutateAsync({ name: 'Noël', emoji: '🎄' }))

      expect(failureOf(error)).toMatchObject({ kind: 'conflict', reason })
    },
  )

  it.each([
    [400, 'invalid-request'],
    [401, 'unauthorized'],
  ] as const)('answers a %i as « %s »', async (status, kind) => {
    server.use(http.post(url('/lists'), () => problemResponse(status)))
    const { result } = renderHook(() => useCreateList(), { wrapper: createQueryWrapper().wrapper })

    const error = await rejectionOf(result.current.mutateAsync({ name: '', emoji: '🎄' }))

    expect(failureOf(error).kind).toBe(kind)
  })
})

describe('useUpdateList', () => {
  it('renames the list and keeps the answer as the freshest copy', async () => {
    server.use(http.put(url('/lists/l-1'), () => HttpResponse.json(aList({ name: 'Noël 2026' }))))
    const { client, wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useUpdateList(), { wrapper })

    await act(() =>
      result.current.mutateAsync({ id: 'l-1', changes: { name: 'Noël 2026', emoji: '🎄' } }),
    )

    expect(client.getQueryData(listKeys.detail('l-1'))).toMatchObject({ name: 'Noël 2026' })
  })

  it.each([
    [400, 'invalid-request'],
    [401, 'unauthorized'],
    [404, 'not-found'],
  ] as const)('answers a %i as « %s »', async (status, kind) => {
    server.use(http.put(url('/lists/l-1'), () => problemResponse(status)))
    const { result } = renderHook(() => useUpdateList(), { wrapper: createQueryWrapper().wrapper })

    const error = await rejectionOf(
      result.current.mutateAsync({ id: 'l-1', changes: { name: 'x', emoji: '🎄' } }),
    )

    expect(failureOf(error).kind).toBe(kind)
  })

  it('tells a taken name apart', async () => {
    server.use(http.put(url('/lists/l-1'), () => typedConflict('recipe-list-name-taken')))
    const { result } = renderHook(() => useUpdateList(), { wrapper: createQueryWrapper().wrapper })

    const error = await rejectionOf(
      result.current.mutateAsync({ id: 'l-1', changes: { name: 'x', emoji: '🎄' } }),
    )

    expect(failureOf(error)).toMatchObject({ kind: 'conflict', reason: 'recipe-list-name-taken' })
  })
})

describe('useDeleteList', () => {
  it('forgets the list, what it held and its photos', async () => {
    server.use(http.delete(url('/lists/l-1'), () => new HttpResponse(null, { status: 204 })))
    const { client, wrapper } = createQueryWrapper()
    client.setQueryData(listKeys.detail('l-1'), aList())
    client.setQueryData(listKeys.content('l-1', {}), { pages: [], pageParams: [] })
    client.setQueryData(['list-covers', 'l-1', 'v1', 'thumbnail'], new Blob())
    client.setQueryData(['list-covers', 'l-2', 'v1', 'thumbnail'], new Blob())
    const { result } = renderHook(() => useDeleteList(), { wrapper })

    await act(() => result.current.mutateAsync('l-1'))

    expect(client.getQueryData(listKeys.detail('l-1'))).toBeUndefined()
    expect(client.getQueryData(listKeys.content('l-1', {}))).toBeUndefined()
    expect(client.getQueryData(['list-covers', 'l-1', 'v1', 'thumbnail'])).toBeUndefined()
    expect(client.getQueryData(['list-covers', 'l-2', 'v1', 'thumbnail'])).toBeInstanceOf(Blob)
  })

  it.each([
    [401, 'unauthorized'],
    [404, 'not-found'],
  ] as const)('answers a %i as « %s »', async (status, kind) => {
    server.use(http.delete(url('/lists/l-1'), () => problemResponse(status)))
    const { result } = renderHook(() => useDeleteList(), { wrapper: createQueryWrapper().wrapper })

    const error = await rejectionOf(result.current.mutateAsync('l-1'))

    expect(failureOf(error).kind).toBe(kind)
  })
})

describe('adding and removing a recipe', () => {
  const entry = { listId: 'l-1', recipeId: 'r-1' }
  const entryUrl = url('/lists/l-1/recipes/r-1')

  it('adds, and makes the lists stale', async () => {
    server.use(http.put(entryUrl, () => new HttpResponse(null, { status: 204 })))
    const { client, wrapper } = createQueryWrapper()
    client.setQueryData(listKeys.mine, [])
    const { result } = renderHook(() => useAddRecipeToList(), { wrapper })

    await act(() => result.current.mutateAsync(entry))

    expect(client.getQueryState(listKeys.mine)?.isInvalidated).toBe(true)
  })

  it.each([
    [401, 'unauthorized'],
    [404, 'not-found'],
  ] as const)('answers a %i on an add as « %s »', async (status, kind) => {
    server.use(http.put(entryUrl, () => problemResponse(status)))
    const { result } = renderHook(() => useAddRecipeToList(), {
      wrapper: createQueryWrapper().wrapper,
    })

    expect(failureOf(await rejectionOf(result.current.mutateAsync(entry))).kind).toBe(kind)
  })

  it('tells a full list apart', async () => {
    server.use(http.put(entryUrl, () => typedConflict('recipe-list-full')))
    const { result } = renderHook(() => useAddRecipeToList(), {
      wrapper: createQueryWrapper().wrapper,
    })

    expect(failureOf(await rejectionOf(result.current.mutateAsync(entry)))).toMatchObject({
      kind: 'conflict',
      reason: 'recipe-list-full',
    })
  })

  it('removes, and makes the lists stale', async () => {
    server.use(http.delete(entryUrl, () => new HttpResponse(null, { status: 204 })))
    const { client, wrapper } = createQueryWrapper()
    client.setQueryData(listKeys.mine, [])
    const { result } = renderHook(() => useRemoveRecipeFromList(), { wrapper })

    await act(() => result.current.mutateAsync(entry))

    expect(client.getQueryState(listKeys.mine)?.isInvalidated).toBe(true)
  })

  it.each([
    [401, 'unauthorized'],
    [404, 'not-found'],
  ] as const)('answers a %i on a removal as « %s »', async (status, kind) => {
    server.use(http.delete(entryUrl, () => problemResponse(status)))
    const { result } = renderHook(() => useRemoveRecipeFromList(), {
      wrapper: createQueryWrapper().wrapper,
    })

    expect(failureOf(await rejectionOf(result.current.mutateAsync(entry))).kind).toBe(kind)
  })

  it('reports a lost connection as « network » on both', async () => {
    server.use(http.put(entryUrl, () => HttpResponse.error()))
    const { result } = renderHook(() => useAddRecipeToList(), {
      wrapper: createQueryWrapper().wrapper,
    })

    expect(failureOf(await rejectionOf(result.current.mutateAsync(entry))).kind).toBe('network')
  })
})

describe('the photo of a list', () => {
  const file = new File(['bytes'], 'noel.jpg', { type: 'image/jpeg' })

  it('is set, and the answer is the freshest copy of the list', async () => {
    server.use(
      http.put(url('/lists/l-1/cover'), () => HttpResponse.json(aList({ coverVersion: 'v2' }))),
    )
    const { client, wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useSetListCover(), { wrapper })

    await act(() => result.current.mutateAsync({ listId: 'l-1', file }))

    expect(client.getQueryData(listKeys.detail('l-1'))).toMatchObject({ coverVersion: 'v2' })
  })

  it.each([
    [400, 'invalid-request'],
    [401, 'unauthorized'],
    [404, 'not-found'],
    [413, 'payload-too-large'],
    [415, 'unexpected'],
    [500, 'server-error'],
  ] as const)('answers a %i on the upload as « %s »', async (status, kind) => {
    server.use(http.put(url('/lists/l-1/cover'), () => problemResponse(status)))
    const { result } = renderHook(() => useSetListCover(), {
      wrapper: createQueryWrapper().wrapper,
    })

    const error = await rejectionOf(result.current.mutateAsync({ listId: 'l-1', file }))

    expect(failureOf(error).kind).toBe(kind)
  })

  it.each([
    [429, 'rate-limited', '240'],
    [503, 'unavailable', '10'],
  ] as const)('carries the delay the server gave on a %i', async (status, kind, seconds) => {
    server.use(
      http.put(url('/lists/l-1/cover'), () =>
        problemResponse(status, 'Slow down', { 'Retry-After': seconds }),
      ),
    )
    const { result } = renderHook(() => useSetListCover(), {
      wrapper: createQueryWrapper().wrapper,
    })

    const error = await rejectionOf(result.current.mutateAsync({ listId: 'l-1', file }))

    expect(failureOf(error)).toMatchObject({ kind, retryAfterSeconds: Number(seconds) })
  })

  it('reads the 408 of a client that went quiet as a failed connection, not as a refusal', async () => {
    server.use(
      http.put(url('/lists/l-1/cover'), () =>
        HttpResponse.json({ status: 408, error: 'Request Timeout' }, { status: 408 }),
      ),
    )
    const { result } = renderHook(() => useSetListCover(), {
      wrapper: createQueryWrapper().wrapper,
    })

    const error = await rejectionOf(result.current.mutateAsync({ listId: 'l-1', file }))

    expect(failureOf(error)).toEqual({ kind: 'network' })
  })

  it('reports a lost connection as « network »', async () => {
    server.use(http.put(url('/lists/l-1/cover'), () => HttpResponse.error()))
    const { result } = renderHook(() => useSetListCover(), {
      wrapper: createQueryWrapper().wrapper,
    })

    const error = await rejectionOf(result.current.mutateAsync({ listId: 'l-1', file }))

    expect(failureOf(error)).toEqual({ kind: 'network' })
  })

  it('ends as « aborted » when the person gives the upload up', async () => {
    const controller = new AbortController()
    controller.abort()
    const { result } = renderHook(() => useSetListCover(), {
      wrapper: createQueryWrapper().wrapper,
    })

    const error = await rejectionOf(
      result.current.mutateAsync({ listId: 'l-1', file, signal: controller.signal }),
    )

    expect(failureOf(error)).toEqual({ kind: 'aborted' })
  })

  it('is removed, and the answer is the freshest copy of the list', async () => {
    server.use(
      http.delete(url('/lists/l-1/cover'), () => HttpResponse.json(aList({ coverVersion: null }))),
    )
    const { client, wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useRemoveListCover(), { wrapper })

    await act(() => result.current.mutateAsync('l-1'))

    expect(client.getQueryData(listKeys.detail('l-1'))).toMatchObject({ coverVersion: null })
  })

  it.each([
    [401, 'unauthorized'],
    [404, 'not-found'],
  ] as const)('answers a %i on the removal as « %s »', async (status, kind) => {
    server.use(http.delete(url('/lists/l-1/cover'), () => problemResponse(status)))
    const { result } = renderHook(() => useRemoveListCover(), {
      wrapper: createQueryWrapper().wrapper,
    })

    expect(failureOf(await rejectionOf(result.current.mutateAsync('l-1'))).kind).toBe(kind)
  })
})
