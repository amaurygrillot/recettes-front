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
