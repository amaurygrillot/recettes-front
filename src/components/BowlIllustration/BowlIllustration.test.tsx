import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { BowlIllustration } from './BowlIllustration'

describe('BowlIllustration', () => {
  it.each(['first-visit', 'no-result'] as const)(
    'draws the %s bowl and hides it from assistive technology',
    (variant) => {
      const { container } = render(<BowlIllustration variant={variant} />)

      expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    },
  )

  it.each([
    ['regular', '176', '132'],
    ['compact', '140', '105'],
  ] as const)('is %s: %s by %s px', (size, width, height) => {
    const { container } = render(<BowlIllustration variant="first-visit" size={size} />)

    expect(container.querySelector('svg')).toHaveAttribute('width', width)
    expect(container.querySelector('svg')).toHaveAttribute('height', height)
  })

  it('has no accessibility violation', async () => {
    const { container } = render(
      <div>
        <BowlIllustration variant="first-visit" />
        <BowlIllustration variant="no-result" />
      </div>,
    )

    await expectNoAccessibilityViolations(container)
  })
})
