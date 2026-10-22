import axe, { type Result } from 'axe-core'
import { expect } from 'vitest'

function describeViolation(violation: Result): string {
  const targets = violation.nodes.map((node) => node.target.join(' ')).join(', ')
  return `${violation.id}: ${violation.help} (${targets})`
}

/**
 * Fails when axe-core finds an accessibility violation in `container`.
 *
 * Colour contrast is switched off because jsdom cannot compute styles; contrast is guaranteed by
 * the design tokens instead. `region` is a whole-page rule that a component rendered alone can
 * never satisfy.
 */
export async function expectNoAccessibilityViolations(container: HTMLElement): Promise<void> {
  const { violations } = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  })
  expect(violations.map(describeViolation)).toEqual([])
}
