import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Logo, type LogoTone, type LogoVariant } from './Logo'
import { strings } from './strings'

const VARIANTS: readonly LogoVariant[] = ['large', 'lockup', 'mark']
const TONES: readonly LogoTone[] = ['color', 'on-butter', 'mono']

describe('Logo', () => {
  it.each(VARIANTS)('is an image named after the application in its %s form', (variant) => {
    render(<Logo variant={variant} size={64} />)

    expect(screen.getByRole('img', { name: strings.name })).toBeVisible()
  })

  it('can be hidden from assistive technology when the name is already given', () => {
    render(<Logo variant="mark" size={44} decorative />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it.each([
    ['large', 234, 238],
    ['mark', 44, 44],
    ['lockup', 40, (40 * 1229) / 200],
  ] as const)('keeps the proportions of the %s at %d px high', (variant, height, width) => {
    render(<Logo variant={variant} size={height} />)

    const logo = screen.getByRole('img')
    expect(logo).toHaveAttribute('height', String(height))
    expect(Number(logo.getAttribute('width'))).toBeCloseTo(width, 3)
  })

  it('writes the name under the large logo and beside the lockup, never in the mark', () => {
    const { container: large } = render(<Logo variant="large" size={160} />)
    const { container: lockup } = render(<Logo variant="lockup" size={40} />)
    const { container: mark } = render(<Logo variant="mark" size={64} />)

    expect(large.querySelector('text')).toHaveTextContent(strings.name)
    expect(lockup.querySelector('text')).toHaveTextContent(strings.name)
    expect(mark.querySelector('text')).toBeNull()
  })

  it('draws the simpler icon below 40 px and the compact mark from 40 px', () => {
    const { container: compact } = render(<Logo variant="mark" size={40} />)
    const { container: icon } = render(<Logo variant="mark" size={32} />)

    expect(icon.querySelectorAll('path').length).toBeLessThan(
      compact.querySelectorAll('path').length,
    )
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
