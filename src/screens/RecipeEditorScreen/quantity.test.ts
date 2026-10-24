import { describe, expect, it } from 'vitest'
import { readQuantity } from './quantity'

describe('readQuantity', () => {
  it.each([
    ['250', 250],
    ['1,5', 1.5],
    ['1.5', 1.5],
    [' 2 ', 2],
    ['0', 0],
    ['0,25', 0.25],
    ['0,125', 0.125],
    ['9999999,999', 9999999.999],
  ])('reads « %s » as %d', (text, value) => {
    expect(readQuantity(text)).toEqual({ kind: 'number', value })
  })

  it.each([[''], ['   ']])('reads nothing typed (« %s ») as no quantity', (text) => {
    expect(readQuantity(text)).toEqual({ kind: 'none' })
  })

  it.each([['-2'], ['-0,5'], ['- 3']])('says « %s » is negative', (text) => {
    expect(readQuantity(text)).toEqual({ kind: 'negative' })
  })

  it.each([
    ['trois'],
    ['1,5,2'],
    ['1 5'],
    ['1/2'],
    ['2 kg'],
    ['0,1234'],
    ['12345678'],
    [','],
    ['1e3'],
  ])('refuses « %s »', (text) => {
    expect(readQuantity(text)).toEqual({ kind: 'invalid' })
  })
})
