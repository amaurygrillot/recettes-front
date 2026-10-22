import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Tag, type TagTone } from './Tag'

const TONES: readonly TagTone[] = ['butter', 'herb', 'brick', 'paper']

describe('Tag', () => {
  it('shows its text', () => {
    render(<Tag>Plat</Tag>)

    expect(screen.getByText('Plat')).toBeVisible()
  })

  it('is not interactive', () => {
    render(<Tag>Plat</Tag>)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('can carry a decorative icon', () => {
    const { container } = render(<Tag icon="leaf">Végétarien</Tag>)

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('Végétarien')).toBeVisible()
  })

  it('has no accessibility violation', async () => {
    const { container } = render(
      <div>
        {TONES.map((tone) => (
          <Tag key={tone} tone={tone} icon="leaf">
            {tone}
          </Tag>
        ))}
      </div>,
    )

    await expectNoAccessibilityViolations(container)
  })
})
