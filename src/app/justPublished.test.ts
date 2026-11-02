import { describe, expect, it } from 'vitest'
import { isJustPublished, JUST_PUBLISHED_STATE } from './justPublished'

describe('isJustPublished', () => {
  it('recognises what the editor sends', () => {
    expect(isJustPublished(JUST_PUBLISHED_STATE)).toBe(true)
  })

  it.each([
    null,
    undefined,
    'published',
    42,
    {},
    { justPublished: false },
    { justPublished: 'yes' },
  ])('takes anything else for an ordinary visit (%j)', (state) => {
    expect(isJustPublished(state)).toBe(false)
  })
})
