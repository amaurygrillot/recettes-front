import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Logo, type LogoTone, type LogoVariant } from './Logo'
import { strings } from './strings'

const VARIANTS: readonly LogoVariant[] = ['seal', 'lockup', 'bowl']
const TONES: readonly LogoTone[] = ['color', 'on-butter', 'mono']

describe('Logo', () => {
  it.each(VARIANTS)('is an image named after the application in its %s form', (variant) => {
    render(<Logo variant={variant} size={64} />)

    expect(screen.getByRole('img', { name: strings.name })).toBeVisible()
  })

  it('can be hidden from assistive technology when the name is already given', () => {
    render(<Logo variant="bowl" size={44} decorative />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it.each([
    ['seal', 196, 196],
    ['bowl', 44, 44],
    ['lockup', 43, (43 * 420) / 72],
  ] as const)('keeps the proportions of the %s at %d px high', (variant, height, width) => {
    render(<Logo variant={variant} size={height} />)

    const logo = screen.getByRole('img')
    expect(logo).toHaveAttribute('height', String(height))
    expect(Number(logo.getAttribute('width'))).toBeCloseTo(width, 3)
  })

  it('draws chopsticks and grains from 40 px, and the plain mound below', () => {
    const { container: large } = render(<Logo variant="bowl" size={48} />)
    const { container: small } = render(<Logo variant="bowl" size={32} />)

    expect(large.querySelectorAll('ellipse')).toHaveLength(4)
    expect(small.querySelectorAll('ellipse')).toHaveLength(0)
  })

  it('gives each seal its own text paths so that several can share a page', () => {
    const { container } = render(
      <>
        <Logo variant="seal" size={160} />
        <Logo variant="seal" size={160} />
      </>,
    )

    const ids = Array.from(container.querySelectorAll('path[id]'), (path) => path.id)
    expect(new Set(ids).size).toBe(4)
  })

  it('has no accessibility violation in any form or tone', async () => {
    const { container } = render(
      <div>
        {VARIANTS.map((variant) =>
          TONES.map((tone) => (
            <Logo key={`${variant}-${tone}`} variant={variant} tone={tone} size={64} />
          )),
        )}
      </div>,
    )

    await expectNoAccessibilityViolations(container)
  })
})
