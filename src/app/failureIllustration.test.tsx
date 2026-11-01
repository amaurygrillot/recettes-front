import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ApiFailure } from '../api/failure'
import { failureIllustration } from './failureIllustration'

describe('failureIllustration', () => {
  it('shows the sleeping mascot when there is no connection', () => {
    const { container } = render(<>{failureIllustration({ kind: 'network' })}</>)

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it.each<ApiFailure>([
    { kind: 'not-found' },
    { kind: 'server-error' },
    { kind: 'unavailable', retryAfterSeconds: 30 },
    { kind: 'unexpected' },
  ])('leaves the warning badge to any other cause (%j)', (failure) => {
    expect(failureIllustration(failure)).toBeUndefined()
  })
})
