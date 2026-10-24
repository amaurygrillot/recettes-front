import { afterEach, describe, expect, it, vi } from 'vitest'
import { validValues } from './editorFixtures'
import {
  clearDraft,
  draftKey,
  loadDraft,
  forgetInterrupted,
  markInterrupted,
  saveDraft,
  wasInterrupted,
} from './editorDraft'

describe('the draft of a recipe', () => {
  afterEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('has one key per recipe being edited and one for the recipe being created', () => {
    expect(draftKey(undefined)).toBe('recettes.draft.new')
    expect(draftKey('r-1')).toBe('recettes.draft.r-1')
    expect(draftKey('r-2')).not.toBe(draftKey('r-1'))
  })

  it('keeps the values and when they were kept, and gives them back as they were', () => {
    const values = validValues()

    expect(saveDraft('k', values, 1_700_000_000_000)).toBe(true)

    expect(loadDraft('k')).toEqual({ savedAt: 1_700_000_000_000, values })
  })

  it('keeps what is half written: an ingredient not chosen, a quantity not finished', () => {
    const values = validValues()
    values.groups = [
      { title: '', lines: [{ ingredient: null, quantity: '1,', unitId: '', note: '' }] },
    ]
    values.title = ''

    saveDraft('k', values)

    expect(loadDraft('k')?.values).toEqual(values)
  })

  it('has nothing for a key that holds no draft', () => {
    expect(loadDraft('absent')).toBeUndefined()
  })

  it.each([
    ['text that is not JSON', 'pas du json'],
    ['JSON that is not a draft', JSON.stringify({ hello: 'world' })],
    ['a draft without its values', JSON.stringify({ savedAt: 1 })],
    ['values of the wrong shape', JSON.stringify({ savedAt: 1, values: { title: 3 } })],
  ])('has no draft where there is %s', (_what, stored) => {
    window.localStorage.setItem('k', stored)

    expect(loadDraft('k')).toBeUndefined()
  })

  it('forgets a draft', () => {
    saveDraft('k', validValues())

    clearDraft('k')

    expect(loadDraft('k')).toBeUndefined()
  })

  it('says it could not keep a draft when the device refuses, without failing', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota', 'QuotaExceededError')
    })

    expect(saveDraft('k', validValues())).toBe(false)
  })

  it('finds nothing, without failing, when the storage cannot even be read', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError')
    })

    expect(loadDraft('k')).toBeUndefined()
    expect(wasInterrupted('k')).toBe(false)
  })

  describe('a draft left by a lost session', () => {
    it('is noted, and asking does not change it: a render that runs twice gets the same answer', () => {
      markInterrupted('k')

      expect(wasInterrupted('k')).toBe(true)
      expect(wasInterrupted('k')).toBe(true)
    })

    it('is forgotten once it has been taken up', () => {
      markInterrupted('k')

      forgetInterrupted('k')

      expect(wasInterrupted('k')).toBe(false)
    })

    it('is not noted for another draft', () => {
      markInterrupted('k')

      expect(wasInterrupted('other')).toBe(false)
    })

    it('is forgotten with the draft', () => {
      markInterrupted('k')

      clearDraft('k')

      expect(wasInterrupted('k')).toBe(false)
    })
  })
})
