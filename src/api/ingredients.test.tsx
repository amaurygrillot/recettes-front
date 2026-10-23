import { act, renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { problemResponse, rejectionOf } from '../test/problem'
import { createQueryWrapper } from '../test/queryWrapper'
import { server } from '../test/server'
import { API_BASE_URL } from './apiConfig'
import { useCreateIngredient, useIngredientSearch } from './ingredients'

const url = `${API_BASE_URL}/ingredients`

describe('useIngredientSearch', () => {
  it('searches by the prefix typed so far', async () => {
    let query: URLSearchParams | undefined
    server.use(
      http.get(url, ({ request }) => {
        query = new URL(request.url).searchParams
        return HttpResponse.json({ content: [{ id: '1', name: 'Œuf' }] })
      }),
    )
    const { result } = renderHook(() => useIngredientSearch({ namePrefix: 'oeu' }), {
      wrapper: createQueryWrapper().wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(query?.get('namePrefix')).toBe('oeu')
    expect(result.current.data?.content).toEqual([{ id: '1', name: 'Œuf' }])
  })

  it('fails with « invalid-request » on a 400', async () => {
    server.use(http.get(url, () => problemResponse(400)))
    const { result } = renderHook(() => useIngredientSearch({ sortBy: 'NAME' }), {
      wrapper: createQueryWrapper().wrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.failure).toMatchObject({ kind: 'invalid-request', status: 400 })
  })
})

describe('useCreateIngredient', () => {
  it('adds the ingredient and makes the searches stale', async () => {
    server.use(
      http.post(url, () => HttpResponse.json({ id: '9', name: 'Panais' }, { status: 201 })),
    )
    const { client, wrapper } = createQueryWrapper()
    client.setQueryData(['ingredients', 'search', { namePrefix: 'pa' }], { content: [] })
    const { result } = renderHook(() => useCreateIngredient(), { wrapper })

    const created = await act(() => result.current.mutateAsync({ name: 'Panais' }))

    expect(created).toEqual({ id: '9', name: 'Panais' })
    expect(
      client.getQueryState(['ingredients', 'search', { namePrefix: 'pa' }])?.isInvalidated,
    ).toBe(true)
  })

  it.each([
    [400, 'invalid-request'],
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [409, 'conflict'],
  ])('fails on a %i with « %s »', async (status, kind) => {
    server.use(http.post(url, () => problemResponse(status)))
    const { result } = renderHook(() => useCreateIngredient(), {
      wrapper: createQueryWrapper().wrapper,
    })

    const error = await act(() => rejectionOf(result.current.mutateAsync({ name: 'Panais' })))

    expect(error).toMatchObject({ failure: { kind, status } })
  })
})
