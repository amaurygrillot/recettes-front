import { describe, expect, it } from 'vitest'
import { emptyValues } from './editorModel'
import { editorSchema } from './editorSchema'
import { validValues } from './editorFixtures'
import { problemsOf, summaryText } from './problems'

function messagesAt(values: ReturnType<typeof validValues>, first: string): string[] {
  const result = editorSchema.safeParse(values)
  if (result.success) return []
  return result.error.issues
    .filter((issue) => issue.path[0] === first)
    .map((issue) => issue.message)
}

describe('the rules of a recipe', () => {
  it('accepts a complete recipe', () => {
    expect(editorSchema.safeParse(validValues()).success).toBe(true)
    expect(problemsOf(validValues())).toEqual([])
  })

  it('says what is missing from a blank form, in the order of the page', () => {
    const problems = problemsOf(emptyValues())

    expect(problems.map(({ label }) => label)).toEqual([
      'un titre',
      'une catégorie',
      'un ingrédient',
      'une étape',
    ])
    expect(problems.map(({ link }) => link)).toEqual([
      'Aller au titre',
      'Aller aux catégories',
      'Aller aux ingrédients',
      'Aller aux étapes',
    ])
    expect(summaryText(problems)).toBe(
      'Il manque 4 choses : un titre, une catégorie, un ingrédient, une étape.',
    )
  })

  it('says one thing in the singular', () => {
    const values = validValues()
    values.categories = []

    expect(summaryText(problemsOf(values))).toBe('Il manque 1 chose : une catégorie.')
  })

  describe('the title', () => {
    it.each([[''], ['   ']])('is required (« %s »)', (title) => {
      const values = validValues()
      values.title = title

      expect(messagesAt(values, 'title')).toEqual(['Le titre est obligatoire.'])
    })

    it('has 200 characters at most', () => {
      const values = validValues()
      values.title = 'a'.repeat(201)

      expect(messagesAt(values, 'title')).toEqual(['Trop long : 200 caractères au plus.'])
      expect(summaryText(problemsOf(values))).toBe(
        'Il reste 1 chose à corriger : un titre plus court.',
      )
    })

    it('may be exactly 200 characters', () => {
      const values = validValues()
      values.title = 'a'.repeat(200)

      expect(messagesAt(values, 'title')).toEqual([])
    })
  })

  describe('the ingredients', () => {
    it('needs a group, and a line in each group', () => {
      const none = validValues()
      none.groups = []
      const empty = validValues()
      empty.groups = [{ title: '', lines: [] }]

      expect(messagesAt(none, 'groups')).toEqual(['Ajoute au moins un groupe avec un ingrédient.'])
      expect(messagesAt(empty, 'groups')).toEqual(['Ajoute au moins un ingrédient à ce groupe.'])
      expect(problemsOf(none).map(({ label }) => label)).toEqual(['un ingrédient'])
      expect(problemsOf(empty).map(({ label }) => label)).toEqual(['un ingrédient'])
    })

    it('needs the ingredient of a line to be chosen', () => {
      const values = validValues()
      values.groups = [
        { title: '', lines: [{ ingredient: null, quantity: '', unitId: '', note: '' }] },
      ]

      expect(messagesAt(values, 'groups')).toEqual([
        'Choisis un ingrédient de la liste, ou crée-le.',
      ])
      expect(problemsOf(values).map(({ label }) => label)).toEqual(['un ingrédient à compléter'])
    })

    it.each([
      ['abc', 'La quantité doit être un nombre, par exemple 250 ou 1,5.'],
      ['1,5,2', 'La quantité doit être un nombre, par exemple 250 ou 1,5.'],
      ['-2', 'La quantité ne peut pas être négative.'],
    ])('refuses the quantity « %s »', (quantity, message) => {
      const values = validValues()
      const [first] = values.groups
      if (first?.lines[0] === undefined) throw new Error('fixture without a line')
      first.lines[0].quantity = quantity

      expect(messagesAt(values, 'groups')).toEqual([message])
    })

    it.each([[''], ['250'], ['1,5'], ['0']])('accepts the quantity « %s »', (quantity) => {
      const values = validValues()
      const [first] = values.groups
      if (first?.lines[0] === undefined) throw new Error('fixture without a line')
      first.lines[0].quantity = quantity

      expect(messagesAt(values, 'groups')).toEqual([])
    })

    it('limits a group title and a note to 200 characters', () => {
      const values = validValues()
      const [first] = values.groups
      if (first?.lines[0] === undefined) throw new Error('fixture without a line')
      first.title = 'a'.repeat(201)
      first.lines[0].note = 'a'.repeat(201)

      expect(messagesAt(values, 'groups')).toEqual([
        'Trop long : 200 caractères au plus.',
        'La note est trop longue : 200 caractères au plus.',
      ])
      expect(problemsOf(values).map(({ label }) => label)).toEqual(['un champ à corriger'])
    })
  })

  describe('the steps', () => {
    it('needs one, and the text of each', () => {
      const none = validValues()
      none.steps = []
      const blank = validValues()
      blank.steps = [{ html: '', photos: [] }]

      expect(messagesAt(none, 'steps')).toEqual(['Ajoute au moins une étape.'])
      expect(messagesAt(blank, 'steps')).toEqual(['Écris au moins une phrase pour cette étape.'])
      expect(problemsOf(none).map(({ label }) => label)).toEqual(['une étape'])
      expect(problemsOf(blank).map(({ label }) => label)).toEqual(['une étape à écrire'])
    })
  })

  it('limits the description of a photo to 500 characters, on the cover and in a step', () => {
    const values = validValues()
    values.photos = [{ mediaId: 'm-1', altText: 'a'.repeat(501) }]
    const [step] = values.steps
    if (step === undefined) throw new Error('fixture without a step')
    step.photos = [{ mediaId: 'm-2', altText: 'a'.repeat(501) }]

    expect(messagesAt(values, 'photos')).toEqual(['Trop long : 500 caractères au plus.'])
    expect(messagesAt(values, 'steps')).toEqual(['Trop long : 500 caractères au plus.'])
  })

  it('does not ask for tags, an introduction, photos or a tip', () => {
    const values = validValues()
    values.tags = []
    values.introduction = ''
    values.photos = []
    values.advice = ''

    expect(problemsOf(values)).toEqual([])
  })

  it('asks for what is not missing but cannot be accepted with a different sentence', () => {
    const values = validValues()
    values.categories = []
    values.title = 'a'.repeat(250)

    expect(summaryText(problemsOf(values))).toBe(
      'Il reste 2 choses à corriger : un titre plus court, une catégorie.',
    )
  })
})
