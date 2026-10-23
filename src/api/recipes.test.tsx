import { act, renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { problemResponse, rejectionOf } from '../test/problem'
import { createQueryWrapper } from '../test/queryWrapper'
import { server } from '../test/server'
import { API_BASE_URL } from './apiConfig'
import {
  recipeKeys,
  useCreateRecipe,
  useDeleteRecipe,
  useRecipe,
  useRecipeSearch,
  useUpdateRecipe,
} from './recipes'

const url = (path: string) => `${API_BASE_URL}${path}`
const newRecipe = {
  title: 'Gratin dauphinois',
  categoryIds: ['1'],
  ingredientGroups: [{ ingredients: [{ ingredientId: '3' }] }],
  steps: [{ instruction: '<p>Enfourne.</p>' }],
}

function summary(id: string) {
  return { id, title: `Recette ${id}` }
}

function page(number: number, ids: string[], last: boolean) {
  return { number, last, content: ids.map(summary) }
}

describe('useRecipeSearch', () => {
  it('sends the filters and loads the first page', async () => {
    let query: URLSearchParams | undefined
    server.use(
      http.get(url('/recipes'), ({ request }) => {
        query = new URL(request.url).searchParams
        return HttpResponse.json(page(0, ['1', '2'], false))
      }),
    )
    const { result } = renderHook(() => useRecipeSearch({ title: 'gratin', sortBy: 'TITLE' }), {
      wrapper: createQueryWrapper().wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(Object.fromEntries(query ?? [])).toEqual({ title: 'gratin', sortBy: 'TITLE', page: '0' })
    expect(result.current.data?.pages[0]?.content).toHaveLength(2)
    expect(result.current.hasNextPage).toBe(true)
  })

  it('« Voir plus » asks for the next page, until the last one', async () => {
    server.use(
      http.get(url('/recipes'), ({ request }) => {
        const pageNumber = Number(new URL(request.url).searchParams.get('page'))
        return HttpResponse.json(pageNumber === 0 ? page(0, ['1'], false) : page(1, ['2'], true))
      }),
    )
    const { result } = renderHook(() => useRecipeSearch({}), {
      wrapper: createQueryWrapper().wrapper,
    })
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    act(() => {
      void result.current.fetchNextPage()
    })

    await waitFor(() => {
      expect(result.current.hasNextPage).toBe(false)
    })
    expect(result.current.data?.pages.flatMap((loaded) => loaded.content)).toEqual([
      summary('1'),
      summary('2'),
    ])
  })

  it('shows the empty feed as a successful page with nothing in it', async () => {
    server.use(http.get(url('/recipes'), () => HttpResponse.json(page(0, [], true))))
    const { result } = renderHook(() => useRecipeSearch({}), {
      wrapper: createQueryWrapper().wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.pages[0]?.content).toEqual([])
    expect(result.current.hasNextPage).toBe(false)
  })

  it('fails with « invalid-request » when a filter is refused', async () => {
    server.use(http.get(url('/recipes'), () => problemResponse(400)))
    const { result } = renderHook(() => useRecipeSearch({}), {
      wrapper: createQueryWrapper().wrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.failure).toMatchObject({ kind: 'invalid-request', status: 400 })
  })

  it('fails with « network » when the back end is down', async () => {
    server.use(http.get(url('/recipes'), () => HttpResponse.error()))
    const { result } = renderHook(() => useRecipeSearch({}), {
      wrapper: createQueryWrapper().wrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.failure).toEqual({ kind: 'network' })
  })
})

describe('useRecipe', () => {
  it('loads one recipe', async () => {
    server.use(http.get(url('/recipes/9'), () => HttpResponse.json({ id: '9', title: 'Tarte' })))
    const { result } = renderHook(() => useRecipe('9'), { wrapper: createQueryWrapper().wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual({ id: '9', title: 'Tarte' })
  })

  it('fails with « not-found » for a recipe that does not exist', async () => {
    server.use(http.get(url('/recipes/404'), () => problemResponse(404)))
    const { result } = renderHook(() => useRecipe('404'), { wrapper: createQueryWrapper().wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.failure).toMatchObject({ kind: 'not-found', status: 404 })
  })
})

describe('useCreateRecipe', () => {
  it('stores the recipe, keeps it as the freshest copy and makes the feed stale', async () => {
    server.use(
      http.post(url('/recipes'), () =>
        HttpResponse.json({ id: '12', title: 'Gratin dauphinois' }, { status: 201 }),
      ),
    )
    const { client, wrapper } = createQueryWrapper()
    client.setQueryData(recipeKeys.search({}), { pages: [], pageParams: [] })
    const { result } = renderHook(() => useCreateRecipe(), { wrapper })

    await act(() => result.current.mutateAsync(newRecipe))

    expect(client.getQueryData(recipeKeys.detail('12'))).toEqual({
      id: '12',
      title: 'Gratin dauphinois',
    })
    expect(client.getQueryState(recipeKeys.search({}))?.isInvalidated).toBe(true)
  })

  it.each([
    [400, 'invalid-request'],
    [401, 'unauthorized'],
    [403, 'forbidden'],
  ])('fails on a %i with « %s »', async (status, kind) => {
    server.use(http.post(url('/recipes'), () => problemResponse(status)))
    const { result } = renderHook(() => useCreateRecipe(), {
      wrapper: createQueryWrapper().wrapper,
    })

    const error = await act(() => rejectionOf(result.current.mutateAsync(newRecipe)))

    expect(error).toMatchObject({ failure: { kind, status } })
  })
})

describe('useUpdateRecipe', () => {
  it('sends only the changes to the recipe and refreshes the cached copy', async () => {
    let received: unknown
    server.use(
      http.put(url('/recipes/12'), async ({ request }) => {
        received = await request.json()
        return HttpResponse.json({ id: '12', title: 'Gratin allégé' })
      }),
    )
    const { client, wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useUpdateRecipe(), { wrapper })

    await act(() => result.current.mutateAsync({ id: '12', changes: { title: 'Gratin allégé' } }))

    expect(received).toEqual({ title: 'Gratin allégé' })
    expect(client.getQueryData(recipeKeys.detail('12'))).toEqual({
      id: '12',
      title: 'Gratin allégé',
    })
  })

  it.each([
    [400, 'invalid-request'],
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'not-found'],
  ])('fails on a %i with « %s »', async (status, kind) => {
    server.use(http.put(url('/recipes/12'), () => problemResponse(status)))
    const { result } = renderHook(() => useUpdateRecipe(), {
      wrapper: createQueryWrapper().wrapper,
    })

    const error = await act(() =>
      rejectionOf(result.current.mutateAsync({ id: '12', changes: { title: 'x' } })),
    )

    expect(error).toMatchObject({ failure: { kind, status } })
  })
})

describe('useDeleteRecipe', () => {
  it('deletes the recipe, forgets its cached copy and makes the feed stale', async () => {
    server.use(http.delete(url('/recipes/12'), () => new HttpResponse(null, { status: 204 })))
    const { client, wrapper } = createQueryWrapper()
    client.setQueryData(recipeKeys.detail('12'), { id: '12' })
    client.setQueryData(recipeKeys.search({}), { pages: [], pageParams: [] })
    const { result } = renderHook(() => useDeleteRecipe(), { wrapper })

    await act(() => result.current.mutateAsync('12'))

    expect(client.getQueryData(recipeKeys.detail('12'))).toBeUndefined()
    expect(client.getQueryState(recipeKeys.search({}))?.isInvalidated).toBe(true)
  })

  it.each([
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'not-found'],
  ])('fails on a %i with « %s »', async (status, kind) => {
    server.use(http.delete(url('/recipes/12'), () => problemResponse(status)))
    const { client, wrapper } = createQueryWrapper()
    client.setQueryData(recipeKeys.detail('12'), { id: '12' })
    const { result } = renderHook(() => useDeleteRecipe(), { wrapper })

    const error = await act(() => rejectionOf(result.current.mutateAsync('12')))

    expect(error).toMatchObject({ failure: { kind, status } })
    expect(client.getQueryData(recipeKeys.detail('12'))).toEqual({ id: '12' })
  })
})
