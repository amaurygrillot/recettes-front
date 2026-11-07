import { http, HttpResponse } from 'msw'
import { problemResponse } from './problem'
import { server } from './server'

/**
 * A fake back end for the screens that list recipes and filter them: the recipes, the category
 * tree, the tags and the ingredients. It matches by path on any origin, so it needs nothing of the app.
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

/** Without accents or case, the way the back end compares the start of an ingredient's name. */
const plain = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

export const INGREDIENTS = [
  { id: 'i-farine', name: 'Farine' },
  { id: 'i-pommes', name: 'Pommes' },
  { id: 'i-pommes-de-terre', name: 'Pommes de terre' },
  { id: 'i-pomelo', name: 'Pomelo' },
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
  /** The query string of every `GET /recipes` that was made, in order. */
  recipeQueries: URLSearchParams[]
  /** The query string of every `GET /ingredients` (the as-you-type search) that was made, in order. */
  ingredientQueries: URLSearchParams[]
  /** The query of the last request for a page of the list, as an object. */
  lastQuery: () => Record<string, string>
  /** What the list was last asked for in `ingredientIds`: the parameter repeated. */
  lastIngredientIds: () => string[]
  /** What the list was last asked for in `tagIds`: the parameter repeated. */
  lastTagIds: () => string[]
}

/**
 * Answers `GET /recipes` with `answer`, and the category tree, the tags and the ingredients (searched by the start
 * of their name, or fetched by id) with the fixtures above.
 */
export function serveBackend(
  answer: Answer = () => HttpResponse.json(page(0, ['1', '2', '3'], { last: true, total: 3 })),
): FakeBackend {
  const recipeQueries: URLSearchParams[] = []
  const ingredientQueries: URLSearchParams[] = []
  server.use(
    http.get('*/recipes', ({ request }) => {
      const query = new URL(request.url).searchParams
      recipeQueries.push(query)
      return answer(query)
    }),
    http.get('*/categories/hierarchy', () => HttpResponse.json(TREE)),
    http.get('*/tags', () => HttpResponse.json(TAGS)),
    http.get('*/ingredients', ({ request }) => {
      const query = new URL(request.url).searchParams
      ingredientQueries.push(query)
      const prefix = plain(query.get('namePrefix') ?? '')
      const content = INGREDIENTS.filter(({ name }) => plain(name).startsWith(prefix))
      return HttpResponse.json({ content, last: true, number: 0, totalElements: content.length })
    }),
    http.get('*/ingredients/:id', ({ params }) => {
      const found = INGREDIENTS.find(({ id }) => id === params.id)
      return found === undefined
        ? problemResponse(404, 'Ingrédient introuvable')
        : HttpResponse.json(found)
    }),
  )
  return {
    recipeQueries,
    ingredientQueries,
    lastQuery: () => Object.fromEntries(recipeQueries.at(-1) ?? []),
    lastIngredientIds: () => recipeQueries.at(-1)?.getAll('ingredientIds') ?? [],
    lastTagIds: () => recipeQueries.at(-1)?.getAll('tagIds') ?? [],
  }
}
