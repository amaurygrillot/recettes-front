import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Mascot, type MascotMood, type MascotSize } from './Mascot'

const MOODS: readonly MascotMood[] = [
  'happy',
  'dejected',
  'smitten',
  'surprised',
  'lost',
  'asleep',
  'celebrating',
]

describe('Mascot', () => {
  it('gives each party hat its own clip path, so several mascots in a page never share an id', () => {
    const { container } = render(
      <>
        <Mascot mood="celebrating" size="medium" />
        <Mascot mood="celebrating" size="small" />
      </>,
    )

    const ids = [...container.querySelectorAll('clipPath')].map((clip) => clip.id)
    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
    ids.forEach((id) => {
      expect(container.querySelector(`[clip-path="url(#${id})"]`)).not.toBeNull()
    })
  })

  it('is decorative: no image for assistive technology, whatever the mood', () => {
    const { container } = render(
      <>
        {MOODS.map((mood) => (
          <Mascot key={mood} mood={mood} size="medium" />
        ))}
      </>,
    )

    const drawings = container.querySelectorAll('svg')
    expect(drawings).toHaveLength(MOODS.length)
    drawings.forEach((drawing) => {
      expect(drawing).toHaveAttribute('aria-hidden', 'true')
    })
  })

  it('draws seven different moods', () => {
    const drawn = MOODS.map(
      (mood) => render(<Mascot mood={mood} size="small" />).container.innerHTML,
    )

    expect(new Set(drawn).size).toBe(MOODS.length)
  })

  it.each([
    ['xl', 240, 264],
    ['large', 160, 176],
    ['medium', 96, 105.6],
    ['small', 64, 70.4],
  ] as const satisfies readonly (readonly [MascotSize, number, number])[])(
    'is %s: %d px wide and %d px high',
    (size, width, height) => {
      const { container } = render(<Mascot mood="happy" size={size} />)

      const drawing = container.querySelector('svg')
      expect(drawing).toHaveAttribute('width', String(width))
      expect(Number(drawing?.getAttribute('height'))).toBeCloseTo(height, 5)
    },
  )

  it('has no accessibility violation', async () => {
    const { container } = render(<Mascot mood="lost" size="large" />)

    await expectNoAccessibilityViolations(container)
  })
})
