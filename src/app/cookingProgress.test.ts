import { afterEach, describe, expect, it, vi } from 'vitest'
import { clearCookingStep, readCookingStep, saveCookingStep } from './cookingProgress'

describe('cooking progress', () => {
  afterEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('remembers the step reached for a recipe', () => {
    saveCookingStep('r-1', 3)

    expect(readCookingStep('r-1')).toBe(3)
  })

  it('keeps each recipe apart', () => {
    saveCookingStep('r-1', 3)
    saveCookingStep('r-2', 5)

    expect(readCookingStep('r-1')).toBe(3)
    expect(readCookingStep('r-2')).toBe(5)
    expect(readCookingStep('r-3')).toBeUndefined()
  })

  it('forgets a step when told to', () => {
    saveCookingStep('r-1', 3)

    clearCookingStep('r-1')

    expect(readCookingStep('r-1')).toBeUndefined()
  })

  it.each(['abc', '', '0', '-2', '2.5', '1e3'])('reads « %s » as no step at all', (stored) => {
    window.localStorage.setItem('recettes.cooking.r-1', stored)

    expect(readCookingStep('r-1')).toBeUndefined()
  })

  it('does not break when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })

    expect(() => {
      saveCookingStep('r-1', 2)
      clearCookingStep('r-1')
    }).not.toThrow()
    expect(readCookingStep('r-1')).toBeUndefined()
  })
})
