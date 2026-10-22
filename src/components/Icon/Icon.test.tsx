import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Icon } from './Icon'
import { ICON_NAMES } from './iconShapes'

function renderedSvg(element: Parameters<typeof render>[0]): SVGSVGElement {
  const svg = render(element).container.querySelector('svg')
  if (!svg) {
    throw new Error('Icon did not render an <svg>')
  }
  return svg
}

describe('Icon', () => {
  it.each(ICON_NAMES)('draws %s and hides it from assistive technology', (name) => {
    const svg = renderedSvg(<Icon name={name} />)

    expect(svg.childElementCount).toBeGreaterThan(0)
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('is 24 px wide with a 2.2 px stroke by default', () => {
    const svg = renderedSvg(<Icon name="search" />)

    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
    expect(svg).toHaveAttribute('stroke-width', '2.2')
    expect(svg).toHaveAttribute('fill', 'none')
  })

  it('can be resized and given another stroke', () => {
    const svg = renderedSvg(<Icon name="search" size={48} strokeWidth={2} />)

    expect(svg).toHaveAttribute('width', '48')
    expect(svg).toHaveAttribute('stroke-width', '2')
  })

  it('has no accessibility violation', async () => {
    const { container } = render(<Icon name="home" />)

    await expectNoAccessibilityViolations(container)
  })
})
