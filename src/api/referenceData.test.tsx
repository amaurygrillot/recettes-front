import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { problemResponse } from '../test/problem'
import { createQueryWrapper } from '../test/queryWrapper'
import { server } from '../test/server'
import { API_BASE_URL } from './apiConfig'
import { useCategories, useCategoryHierarchy, useTags, useUnits } from './referenceData'

const READS = [
  ['categories', '/categories', useCategories, [{ id: '1', name: 'Plats' }]],
  [
    'the category hierarchy',
    '/categories/hierarchy',
    useCategoryHierarchy,
    [{ id: '1', name: 'Plats', subcategories: [] }],
  ],
  ['tags', '/tags', useTags, [{ id: '2', name: 'Végétarien' }]],
  ['units', '/units', useUnits, [{ id: '3', name: 'gramme', abbreviation: 'g' }]],
] as const

describe.each(READS)('the %s', (_name, path, useRead, body) => {
  it('are loaded as a list', async () => {
    server.use(http.get(`${API_BASE_URL}${path}`, () => HttpResponse.json(body)))
    const { result } = renderHook(() => useRead(), { wrapper: createQueryWrapper().wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(body)
  })

  it('fail with « server-error » when the back end breaks', async () => {
    server.use(http.get(`${API_BASE_URL}${path}`, () => problemResponse(500)))
    const { result } = renderHook(() => useRead(), { wrapper: createQueryWrapper().wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.failure).toMatchObject({ kind: 'server-error', status: 500 })
  })
})
