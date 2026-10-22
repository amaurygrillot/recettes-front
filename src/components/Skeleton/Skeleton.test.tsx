import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('is an empty block: there is nothing to announce', () => {
    const { container } = render(<Skeleton className="h-6 w-3/4 rounded-s" />)

    expect(container.firstElementChild).toBeEmptyDOMElement()
  })

  it('has no accessibility violation', async () => {
    const { container } = render(<Skeleton className="h-6 w-3/4 rounded-s" />)

    await expectNoAccessibilityViolations(container)
  })
})
