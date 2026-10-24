import { describe, expect, it } from 'vitest'
import { API_BASE_URL } from '../api/apiConfig'
import { hasText, toRecipeView } from './recipeView'

const FULL = {
  id: 'r-1',
  title: 'Tarte fine aux pommes',
  introduction: { id: 'i', text: '<p>La tarte de tous les dimanches.</p>' },
  recommendations: '<p>Prépare la pâte la veille.</p>',
  author: { id: 'u-1', username: 'Hugo' },
  categories: [{ id: 'c', name: 'Dessert', categoryType: 'MAIN' as const }],
  tags: [
    { id: 't1', name: 'Fruits' },
    { id: 't2', name: 'Rapide' },
  ],
  coverPictures: [
    { mediaId: 'm-1', altText: 'La tarte entière' },
    { mediaId: 'm-2', altText: null },
  ],
  ingredientGroups: [
    {
      title: 'Pour la pâte',
      ingredients: [
        {
          ingredient: { id: 'a', name: 'farine' },
          quantity: 250,
          unit: { id: 'g', name: 'gramme', abbreviation: 'g' },
        },
        { ingredient: { id: 'b', name: 'œuf' }, quantity: 1 },
        { ingredient: { id: 'c', name: 'sel' }, note: 'selon le goût' },
      ],
    },
  ],
  steps: [
    { instruction: '<p>Préchauffe le four.</p>' },
    {
      instruction: '<p>Étale la pâte.</p>',
      pictures: [{ mediaId: 'm-3', altText: 'Pâte étalée' }],
    },
  ],
  createdAt: '2026-10-12T12:00:00Z',
  updatedAt: '2026-10-18T12:00:00Z',
}

describe('toRecipeView', () => {
  it('keeps everything the page shows', () => {
    const view = toRecipeView(FULL)

    expect(view).toMatchObject({
      id: 'r-1',
      title: 'Tarte fine aux pommes',
      categories: ['Dessert'],
      tags: ['Fruits', 'Rapide'],
      authorId: 'u-1',
      authorName: 'Hugo',
      addedOn: '12 octobre 2026',
      modifiedOn: '18 octobre 2026',
      introduction: '<p>La tarte de tous les dimanches.</p>',
      advice: '<p>Prépare la pâte la veille.</p>',
    })
  })

  it('resolves the photos to their full and thumbnail addresses', () => {
    expect(toRecipeView(FULL)?.photos).toEqual([
      {
        id: 'm-1',
        url: `${API_BASE_URL}/media/m-1`,
        thumbnailUrl: `${API_BASE_URL}/media/m-1?variant=thumbnail`,
        alt: 'La tarte entière',
      },
      {
        id: 'm-2',
        url: `${API_BASE_URL}/media/m-2`,
        thumbnailUrl: `${API_BASE_URL}/media/m-2?variant=thumbnail`,
        alt: '',
      },
    ])
  })

  it('splits ingredient lines the way they are set', () => {
    const [group] = toRecipeView(FULL)?.ingredientGroups ?? []

    expect(group?.title).toBe('Pour la pâte')
    expect(group?.lines).toEqual([
      { quantity: '250', unit: 'g de ', name: 'farine', note: undefined },
      { quantity: '1', unit: undefined, name: 'œuf', note: undefined },
      { quantity: undefined, unit: undefined, name: 'sel', note: 'selon le goût' },
    ])
  })

  it('numbers the steps from 1 and gives their photos for the viewer', () => {
    const steps = toRecipeView(FULL)?.steps

    expect(steps?.map((step) => step.number)).toEqual([1, 2])
    expect(steps?.[0]?.photos).toEqual([])
    expect(steps?.[1]?.photos).toEqual([
      {
        id: 'm-3',
        url: `${API_BASE_URL}/media/m-3`,
        thumbnailUrl: `${API_BASE_URL}/media/m-3?variant=thumbnail`,
        alt: 'Pâte étalée',
      },
    ])
  })

  it('numbers the steps that have a text consecutively, skipping an empty one', () => {
    const view = toRecipeView({
      ...FULL,
      steps: [
        { instruction: '<p>Un</p>' },
        { instruction: '<p> </p>' },
        { instruction: '<p>Deux</p>' },
      ],
    })

    expect(view?.steps.map((step) => step.number)).toEqual([1, 2])
  })

  it('keeps a step that is only a picture, and drops one with neither words nor picture', () => {
    const view = toRecipeView({
      ...FULL,
      steps: [
        { instruction: '<p></p>', pictures: [{ mediaId: 'm-9', altText: 'Le four' }] },
        { instruction: '<p></p>', pictures: [] },
        { pictures: [{ mediaId: 'm-10' }] },
      ],
    })

    expect(view?.steps.map((step) => [step.number, step.photos.length])).toEqual([
      [1, 1],
      [2, 1],
    ])
  })

  it('shows no « modifiée le » when the recipe was changed the day it was added, or never', () => {
    expect(toRecipeView({ ...FULL, updatedAt: '2026-10-12T18:00:00Z' })?.modifiedOn).toBeUndefined()
    expect(
      toRecipeView({ id: 'r-1', title: 'Tarte', createdAt: FULL.createdAt })?.modifiedOn,
    ).toBeUndefined()
  })

  it('has no introduction and no advice when they are empty, as an emptied editor leaves them', () => {
    const view = toRecipeView({
      ...FULL,
      introduction: { id: 'i', text: '<p></p>' },
      recommendations: null,
    })

    expect(view?.introduction).toBeUndefined()
    expect(view?.advice).toBeUndefined()
  })

  it('leaves out an ingredient group with no line, and a line with no ingredient', () => {
    const view = toRecipeView({
      ...FULL,
      ingredientGroups: [
        { title: 'Vide', ingredients: [] },
        { title: null, ingredients: [{ quantity: 2 }, { ingredient: { id: 'x', name: 'sucre' } }] },
      ],
    })

    expect(view?.ingredientGroups).toHaveLength(1)
    expect(view?.ingredientGroups[0]?.title).toBeUndefined()
    expect(view?.ingredientGroups[0]?.lines.map((line) => line.name)).toEqual(['sucre'])
  })

  it('uses the unit name when it has no abbreviation', () => {
    const view = toRecipeView({
      ...FULL,
      ingredientGroups: [
        {
          ingredients: [
            {
              ingredient: { id: 'x', name: 'sel' },
              quantity: 1,
              unit: { id: 'p', name: 'pincée' },
            },
          ],
        },
      ],
    })

    expect(view?.ingredientGroups[0]?.lines[0]?.unit).toBe('pincée de ')
  })

  it.each([
    ['an id', { title: 'Tarte' }],
    ['a title', { id: 'r-1' }],
    ['a title that is empty', { id: 'r-1', title: '' }],
  ])('gives no page for a recipe without %s', (_what, recipe) => {
    expect(toRecipeView(recipe)).toBeUndefined()
  })

  it('copes with a recipe that has nothing but an id and a title', () => {
    expect(toRecipeView({ id: 'r-1', title: 'Tarte' })).toMatchObject({
      categories: [],
      tags: [],
      photos: [],
      ingredientGroups: [],
      steps: [],
      authorName: undefined,
      addedOn: undefined,
    })
  })
})

describe('hasText', () => {
  it.each([
    ['<p>Texte</p>', true],
    ['Texte brut', true],
    ['<ul><li>un</li></ul>', true],
    ['<p></p>', false],
    ['<p> <br> </p>', false],
    ['<p>&nbsp;</p>', false],
    ['<p>Un&nbsp;œuf</p>', true],
    ['   ', false],
    ['', false],
    [null, false],
    [undefined, false],
  ])('« %s » says something: %s', (html, expected) => {
    expect(hasText(html)).toBe(expected)
  })
})
