import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StateBadge } from './StateBadge'

describe('StateBadge', () => {
  it.each([
    ['neutral', 'mail', 'bg-butter-200'],
    ['success', 'check-circle', 'bg-herb-bg'],
    ['error', 'warning', 'bg-brick-bg'],
  ] as const)(
    'draws the %s badge with its icon, hidden from assistive technology',
    (tone, icon, background) => {
      const { container } = render(<StateBadge tone={tone} icon={icon} />)

      const badge = container.firstElementChild
      expect(badge).toHaveAttribute('aria-hidden', 'true')
      expect(badge).toHaveClass(background)
      expect(badge?.querySelector('svg')).toBeInTheDocument()
    },
  )
})
