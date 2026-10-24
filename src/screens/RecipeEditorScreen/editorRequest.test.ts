import { describe, expect, it } from 'vitest'
import { createRequestFrom, updateRequestFrom } from './editorRequest'
import { validValues } from './editorFixtures'

describe('createRequestFrom', () => {
  it('sends the whole recipe in the contract’s shape', () => {
    expect(createRequestFrom(validValues())).toEqual({
      title: 'Tarte fine aux pommes',
      introduction: { text: '<p>La tarte de tous les dimanches.</p>' },
      recommendations: '<p>Prépare la pâte la veille.</p>',
      categoryIds: ['tartes'],
      tagIds: ['t-fruits'],
      coverPictures: [{ mediaId: 'm-1', altText: 'La tarte entière' }],
      ingredientGroups: [
        {
          title: 'Pour la pâte',
          ingredients: [
            { ingredientId: 'i-farine', quantity: 250, unitId: 'u-g' },
            { ingredientId: 'i-oeuf', quantity: 1, note: 'à température' },
          ],
        },
      ],
      steps: [
        { instruction: '<p>Mélange tout.</p>', pictures: [{ mediaId: 'm-2' }] },
        { instruction: '<p>Fais cuire.</p>' },
      ],
    })
  })

  it('leaves out what is not written: no introduction, no tip, no title of a group, no quantity', () => {
    const values = validValues()
    values.introduction = ''
    values.advice = ''
    values.tags = []
    values.photos = []
    values.groups = [
      {
        title: '   ',
        lines: [
          { ingredient: { id: 'i-sel', label: 'sel' }, quantity: '', unitId: '', note: '  ' },
        ],
      },
    ]

    const request = createRequestFrom(values)

    expect(request).not.toHaveProperty('introduction')
    expect(request).not.toHaveProperty('recommendations')
    expect(request.tagIds).toEqual([])
    expect(request.coverPictures).toEqual([])
    expect(request.ingredientGroups).toEqual([{ ingredients: [{ ingredientId: 'i-sel' }] }])
  })

  it('trims what a person may have padded with spaces, and reads a quantity with a comma', () => {
    const values = validValues()
    values.title = '  Tarte  '
    values.photos = [{ mediaId: 'm-1', altText: '  La tarte  ' }]
    values.groups = [
      {
        title: ' Pâte ',
        lines: [
          {
            ingredient: { id: 'i-1', label: 'farine' },
            quantity: ' 1,5 ',
            unitId: '',
            note: ' tamisée ',
          },
        ],
      },
    ]

    const request = createRequestFrom(values)

    expect(request.title).toBe('Tarte')
    expect(request.coverPictures).toEqual([{ mediaId: 'm-1', altText: 'La tarte' }])
    expect(request.ingredientGroups).toEqual([
      { title: 'Pâte', ingredients: [{ ingredientId: 'i-1', quantity: 1.5, note: 'tamisée' }] },
    ])
  })

  it('sends a line whose ingredient is not chosen nowhere: it cannot be sent', () => {
    const values = validValues()
    values.groups = [
      { title: '', lines: [{ ingredient: null, quantity: '2', unitId: '', note: '' }] },
    ]

    expect(createRequestFrom(values).ingredientGroups).toEqual([{ ingredients: [] }])
  })
})

describe('updateRequestFrom', () => {
  it('sends everything, since an update replaces each collection it carries', () => {
    const request = updateRequestFrom(validValues())

    expect(Object.keys(request).sort()).toEqual([
      'categoryIds',
      'coverPictures',
      'ingredientGroups',
      'introduction',
      'recommendations',
      'steps',
      'tagIds',
      'title',
    ])
  })

  it('tells the back end to remove an introduction and a tip that were emptied', () => {
    const values = validValues()
    values.introduction = ''
    values.advice = ''

    const request = updateRequestFrom(values)

    expect(request.introduction).toEqual({ text: '' })
    expect(request.recommendations).toBe('')
  })

  it('can empty the tags and the cover pictures, which the back end allows', () => {
    const values = validValues()
    values.tags = []
    values.photos = []

    const request = updateRequestFrom(values)

    expect(request.tagIds).toEqual([])
    expect(request.coverPictures).toEqual([])
  })
})
