import { http, HttpResponse } from 'msw'
import { server } from './server'

/**
 * A fake back end for the screens that list recipes and filter them: the recipes, the category
 * tree and the tags. It matches by path on any origin, so it needs nothing of the app.
 */

export const TREE = [
  {
    id: 'desserts',
    name: 'Desserts',
    subcategories: [
      { id: 'tartes', name: 'Tartes', subcategories: [] },
      { id: 'gateaux', name: 'Gâteaux', subcategories: [] },
    ],
  },
  { id: 'plats', name: 'Plats', subcategories: [] },
]

export const TAGS = [
  { id: 't-four', name: 'Four' },
  { id: 't-fruits', name: 'Fruits' },
  { id: 't-rapide', name: 'Rapide' },
]

export function summary(id: string, extra: object = {}) {
  return {
    id,
    title: `Recette ${id}`,
    categories: [{ id: 'plats', name: 'Plats', categoryType: 'MAIN' }],
    tags: [{ id: 't-four', name: 'Four' }],
    author: { id: 'u-1', username: 'Odile' },
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    ...extra,
  }
}

export function page(
  number: number,
  ids: readonly string[],
  options: { last: boolean; total: number },
) {
  return {
    number,
    last: options.last,
    first: number === 0,
    totalElements: options.total,
    content: ids.map((id) => summary(id)),
  }
}

type Answer = (query: URLSearchParams) => Response | Promise<Response>

export interface FakeBackend {
  /** The query string of every `GET /recipes` that was made, in order, counts included. */
  recipeQueries: URLSearchParams[]
  /** The query of the last request for a page of the list (not for a count), as an object. */
  lastQuery: () => Record<string, string>
  /** The query of the last request for a count (a page of one), as an object. */
  lastCountQuery: () => Record<string, string>
}

/** Answers `GET /recipes` with `answer`, and the category tree and the tags with the fixtures above. */
export function serveBackend(
  answer: Answer = () => HttpResponse.json(page(0, ['1', '2', '3'], { last: true, total: 3 })),
): FakeBackend {
  const recipeQueries: URLSearchParams[] = []
  server.use(
    http.get('*/recipes', ({ request }) => {
      const query = new URL(request.url).searchParams
      recipeQueries.push(query)
      return answer(query)
    }),
    http.get('*/categories/hierarchy', () => HttpResponse.json(TREE)),
    http.get('*/tags', () => HttpResponse.json(TAGS)),
  )
  return {
    recipeQueries,
    lastQuery: () =>
      Object.fromEntries(recipeQueries.findLast((query) => query.get('size') !== '1') ?? []),
    lastCountQuery: () =>
      Object.fromEntries(recipeQueries.findLast((query) => query.get('size') === '1') ?? []),
  }
}
