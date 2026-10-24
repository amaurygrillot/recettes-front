import type { EditorValues } from './editorModel'

/** A recipe the editor accepts as it is, for the tests: change one thing from it to test one rule. */
export function validValues(): EditorValues {
  return {
    title: 'Tarte fine aux pommes',
    introduction: '<p>La tarte de tous les dimanches.</p>',
    categories: [{ id: 'tartes', label: 'Desserts › Tartes' }],
    tags: [{ id: 't-fruits', label: 'Fruits' }],
    photos: [{ mediaId: 'm-1', altText: 'La tarte entière' }],
    groups: [
      {
        title: 'Pour la pâte',
        lines: [
          {
            ingredient: { id: 'i-farine', label: 'farine' },
            quantity: '250',
            unitId: 'u-g',
            note: '',
          },
          {
            ingredient: { id: 'i-oeuf', label: 'œuf' },
            quantity: '1',
            unitId: '',
            note: 'à température',
          },
        ],
      },
    ],
    steps: [
      { html: '<p>Mélange tout.</p>', photos: [{ mediaId: 'm-2', altText: '' }] },
      { html: '<p>Fais cuire.</p>', photos: [] },
    ],
    advice: '<p>Prépare la pâte la veille.</p>',
  }
}
