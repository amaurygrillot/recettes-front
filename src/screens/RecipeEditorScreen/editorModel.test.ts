import { describe, expect, it } from 'vitest'
import { emptyValues, quantityToText, valuesFromRecipe } from './editorModel'

const label = (category: { name?: string; parentCategoryId?: string | null }) =>
  category.parentCategoryId ? `Desserts › ${category.name}` : (category.name ?? '')

describe('quantityToText', () => {
  it.each([
    [250, '250'],
    [1.5, '1,5'],
    [0.25, '0,25'],
    [0, '0'],
    [null, ''],
    [undefined, ''],
  ])('writes %s as « %s »', (quantity, text) => {
    expect(quantityToText(quantity)).toBe(text)
  })
})

describe('emptyValues', () => {
  it('has nothing chosen and nothing written', () => {
    expect(emptyValues()).toEqual({
      title: '',
      introduction: '',
      categories: [],
      tags: [],
      photos: [],
      groups: [],
      steps: [],
      advice: '',
    })
  })
})

describe('valuesFromRecipe', () => {
  const recipe = {
    id: 'r-1',
    title: 'Tarte fine',
    introduction: { id: 'i', text: '<p>Intro</p>' },
    recommendations: '<p>Conseil</p>',
    categories: [{ id: 'tartes', name: 'Tartes', parentCategoryId: 'desserts' }],
    tags: [{ id: 't-1', name: 'Fruits' }],
    coverPictures: [
      { mediaId: 'm-1', altText: 'La tarte' },
      { mediaId: 'm-2', altText: null },
    ],
    ingredientGroups: [
      {
        title: 'Pour la pâte',
        ingredients: [
          {
            ingredient: { id: 'i-1', name: 'farine' },
            quantity: 1.5,
            unit: { id: 'u-1', name: 'kilogramme', abbreviation: 'kg' },
            note: 'tamisée',
          },
          { ingredient: { id: 'i-2', name: 'sel' }, quantity: null, note: null },
        ],
      },
      { title: null, ingredients: [{ ingredient: { id: 'i-3', name: 'œuf' }, quantity: 3 }] },
    ],
    steps: [
      { instruction: '<p>Un</p>', pictures: [{ mediaId: 'm-3', altText: 'Étape' }] },
      { instruction: '<p>Deux</p>' },
    ],
  }

  it('takes the whole recipe into the form, in the form’s own shape', () => {
    expect(valuesFromRecipe(recipe, label)).toEqual({
      title: 'Tarte fine',
      introduction: '<p>Intro</p>',
      categories: [{ id: 'tartes', label: 'Desserts › Tartes' }],
      tags: [{ id: 't-1', label: 'Fruits' }],
      photos: [
        { mediaId: 'm-1', altText: 'La tarte' },
        { mediaId: 'm-2', altText: '' },
      ],
      groups: [
        {
          title: 'Pour la pâte',
          lines: [
            {
              ingredient: { id: 'i-1', label: 'farine' },
              quantity: '1,5',
              unitId: 'u-1',
              note: 'tamisée',
            },
            { ingredient: { id: 'i-2', label: 'sel' }, quantity: '', unitId: '', note: '' },
          ],
        },
        {
          title: '',
          lines: [{ ingredient: { id: 'i-3', label: 'œuf' }, quantity: '3', unitId: '', note: '' }],
        },
      ],
      steps: [
        { html: '<p>Un</p>', photos: [{ mediaId: 'm-3', altText: 'Étape' }] },
        { html: '<p>Deux</p>', photos: [] },
      ],
      advice: '<p>Conseil</p>',
    })
  })

  it('gives an empty form for a recipe with nothing in it, without failing', () => {
    expect(valuesFromRecipe({}, label)).toEqual(emptyValues())
  })

  it('leaves out what has no id: it could not be sent back', () => {
    const values = valuesFromRecipe(
      {
        categories: [{ name: 'Sans id' }],
        coverPictures: [{ altText: 'sans media' }],
        ingredientGroups: [{ ingredients: [{ quantity: 2 }] }],
      },
      label,
    )

    expect(values.categories).toEqual([])
    expect(values.photos).toEqual([])
    expect(values.groups).toEqual([{ title: '', lines: [] }])
  })
})
