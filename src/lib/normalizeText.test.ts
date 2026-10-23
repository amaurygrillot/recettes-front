import { describe, expect, it } from 'vitest'
import { findWordStart, normalizeText, startsAWord } from './normalizeText'

describe('normalizeText', () => {
  it.each([
    ['Été', 'ete'],
    ['CRÈME brûlée', 'creme brulee'],
    ['Œufs', 'œufs'],
    ['déjà vu', 'deja vu'],
    ['', ''],
  ])('turns « %s » into « %s »', (text, expected) => {
    expect(normalizeText(text)).toBe(expected)
  })
})

describe('startsAWord', () => {
  it.each([
    ['Pommes', 'pom', true],
    ['Pomelo', 'pom', true],
    ['Pommes de terre', 'ter', true],
    ['Tarte aux pommes', 'pom', true],
    ['Compote', 'pom', false],
    ['Été', 'ete', true],
    ['Crème brûlée', 'BRU', true],
    ['Tartes', 'ta', true],
    ['Tartes', 'artes', false],
    ['Pommes de terre', 'pommes d', false],
  ])('« %s » for « %s »: %s', (candidate, typed, expected) => {
    expect(startsAWord(candidate, typed)).toBe(expected)
  })

  it('matches nothing for an empty or blank text', () => {
    expect(startsAWord('Pommes', '')).toBe(false)
    expect(startsAWord('Pommes', '   ')).toBe(false)
  })
})

describe('findWordStart', () => {
  it.each([
    ['Pommes', 'pom', { start: 0, length: 3 }],
    ['Tarte aux pommes', 'pom', { start: 10, length: 3 }],
    ['Crème brûlée', 'bru', { start: 6, length: 3 }],
    ['Été', 'ete', { start: 0, length: 3 }],
    ['Compote', 'pom', undefined],
    ['Pommes', '  ', undefined],
  ])('in « %s » for « %s »', (candidate, typed, expected) => {
    expect(findWordStart(candidate, typed)).toEqual(expected)
  })
})
