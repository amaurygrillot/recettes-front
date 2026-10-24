import { act, screen, within } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  getNearestEditorFromDOMNode,
  type LexicalEditor,
} from 'lexical'
import { http, HttpResponse } from 'msw'
import { Outlet } from 'react-router'
import { expect } from 'vitest'
import { API_BASE_URL } from '../../api/apiConfig'
import { sessionStore } from '../../api/sessionStore'
import { ToastsProvider } from '../../app/ToastsProvider'
import { fakeToken } from '../../test/fakeToken'
import { renderRoutes } from '../../test/renderRoutes'
import { server } from '../../test/server'
import { RecipeEditorScreen } from './RecipeEditorScreen'

/** The member the tests are signed in as, and the author of the recipe they change. */
export const MEMBER = { username: 'odile74', userId: 'u-1' }

export const API = API_BASE_URL

export const CATEGORY_TREE = [
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
  { id: 't-fruits', name: 'Fruits' },
  { id: 't-rapide', name: 'Rapide' },
]

export const UNITS = [
  { id: 'u-g', name: 'gramme', abbreviation: 'g' },
  { id: 'u-pincee', name: 'pincée' },
]

export const INGREDIENTS = [
  { id: 'i-farine', name: 'farine de blé' },
  { id: 'i-farine-mais', name: 'farine de maïs' },
  { id: 'i-beurre', name: 'beurre' },
]

/** A recipe as the back end sends it, written by the member the tests are signed in as. */
export function storedRecipe(extra: object = {}) {
  return {
    id: 'r-1',
    title: 'Tarte fine aux pommes',
    introduction: { id: 'i', text: '<p>La tarte de tous les dimanches.</p>' },
    recommendations: '<p>Prépare la pâte la veille.</p>',
    author: { id: MEMBER.userId, username: 'Odile' },
    categories: [
      { id: 'tartes', name: 'Tartes', categoryType: 'SUB', parentCategoryId: 'desserts' },
    ],
    tags: [{ id: 't-fruits', name: 'Fruits' }],
    coverPictures: [
      { mediaId: 'm-1', altText: 'La tarte entière' },
      { mediaId: 'm-2', altText: null },
    ],
    ingredientGroups: [
      {
        title: 'Pour la pâte',
        ingredients: [
          { ingredient: { id: 'i-farine', name: 'farine de blé' }, quantity: 250, unit: UNITS[0] },
          { ingredient: { id: 'i-beurre', name: 'beurre' }, quantity: 125, note: 'froid' },
        ],
      },
    ],
    steps: [
      { instruction: '<p>Mélange tout.</p>', pictures: [{ mediaId: 'm-3', altText: null }] },
      { instruction: '<p>Fais cuire.</p>' },
    ],
    ...extra,
  }
}

export interface EditorBackend {
  /** What the back end was sent to create or change a recipe, as JSON, in order. */
  sent: unknown[]
}

/**
 * The answers of the back end that the editor needs to open: the vocabulary, the ingredients that
 * exist and, for a recipe that is changed, the recipe. What the test wants to go differently is
 * declared after this, with `server.use`, and wins.
 */
export function useEditorBackend({
  recipe = storedRecipe(),
}: { recipe?: object | undefined } = {}): EditorBackend {
  const backend: EditorBackend = { sent: [] }
  server.use(
    http.get(`${API}/categories/hierarchy`, () => HttpResponse.json(CATEGORY_TREE)),
    http.get(`${API}/tags`, () => HttpResponse.json(TAGS)),
    http.get(`${API}/units`, () => HttpResponse.json(UNITS)),
    http.get(`${API}/ingredients`, ({ request }) => {
      const prefix = (new URL(request.url).searchParams.get('namePrefix') ?? '').toLowerCase()
      const content = INGREDIENTS.filter(({ name }) => name.toLowerCase().startsWith(prefix))
      return HttpResponse.json({ content, number: 0, last: true, totalElements: content.length })
    }),
    http.get(`${API}/recipes/:id`, () => HttpResponse.json(recipe)),
    http.post(`${API}/recipes`, async ({ request }) => {
      backend.sent.push(await request.json())
      return HttpResponse.json({ id: 'r-new', title: 'Nouvelle' }, { status: 201 })
    }),
    http.put(`${API}/recipes/:id`, async ({ params, request }) => {
      backend.sent.push(await request.json())
      return HttpResponse.json({ id: params.id, title: 'Modifiée' })
    }),
  )
  return backend
}

export function signInAsMember(roles: readonly string[] = ['USER'], userId = MEMBER.userId) {
  expect(sessionStore.signIn(fakeToken({ username: MEMBER.username, userId, roles }))).toBe(true)
}

/** The editor at an address of its own, with the pages it leads to as placeholders. */
export function renderEditor(path: string) {
  return renderRoutes(
    [
      {
        element: (
          <ToastsProvider>
            <Outlet />
          </ToastsProvider>
        ),
        children: [
          { path: '/recettes/nouvelle', element: <RecipeEditorScreen /> },
          { path: '/recettes/:id/modifier', element: <RecipeEditorScreen /> },
          { path: '/recettes/:id', element: <p>Page de la recette</p> },
          { path: '/rechercher', element: <p>Page de recherche</p> },
          { path: '/', element: <p>Page d’accueil</p> },
        ],
      },
    ],
    path,
  )
}

/** The editor, once its form is there. */
export async function findForm() {
  return screen.findByRole('heading', { level: 2, name: 'Informations' })
}

/** A rich text field is written in through its editor: jsdom does not deliver typed characters to it. */
export async function writeInRichText(box: HTMLElement, text: string) {
  const editor: LexicalEditor | null = getNearestEditorFromDOMNode(box)
  if (editor === null) throw new Error('No editor behind this element')
  await act(async () => {
    editor.update(() => {
      $getRoot().selectEnd()
      const selection = $getSelection()
      if ($isRangeSelection(selection)) selection.insertText(text)
    })
    await Promise.resolve()
  })
}

/** What a field says for itself: `Titre`, `Texte de l’étape`… */
export const field = (name: string | RegExp) => screen.getByLabelText(name)

/** A picture file, as a phone's gallery would hand it. */
export function picture(name = 'tarte.jpg', type = 'image/jpeg', bytes = 2000) {
  return new File(['x'.repeat(bytes)], name, { type })
}

/** The least a recipe needs, filled in the way a person does it: a title, a category, an ingredient, a step. */
export async function fillMinimalRecipe(user: UserEvent) {
  await user.type(screen.getByLabelText('Titre'), 'Tarte aux pommes')

  await user.click(screen.getByRole('button', { name: 'Choisir des catégories' }))
  const sheet = await screen.findByRole('dialog', { name: 'Catégories' })
  await user.click(within(sheet).getByRole('button', { name: 'Déplier Desserts' }))
  await user.click(within(sheet).getByRole('checkbox', { name: 'Tartes' }))
  await user.click(within(sheet).getByRole('button', { name: /^Valider/ }))

  const line = screen.getByRole('group', { name: 'Ingrédient 1' })
  await user.type(within(line).getByRole('combobox', { name: 'Ingrédient' }), 'farine de b')
  await user.click(await within(line).findByRole('option', { name: 'farine de blé' }))

  const step = within(screen.getByRole('article', { name: 'Étape 1' }))
  await writeInRichText(step.getByRole('textbox'), 'Mélange tout.')
}

/** A promise that the test settles when it wants to: something that takes the time the test says. */
export function deferred<Value>() {
  const control: { resolve: (value: Value) => void; reject: (reason: unknown) => void } = {
    resolve: () => undefined,
    reject: () => undefined,
  }
  const promise = new Promise<Value>((resolve, reject) => {
    control.resolve = resolve
    control.reject = reject
  })
  return { promise, ...control }
}
