import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ApiFailure } from '../api/failure'
import { failureIllustration } from './failureIllustration'

const problem = { status: 400, detail: undefined }

describe('failureIllustration', () => {
  it('shows the sleeping mascot when there is no connection', () => {
    const { container } = render(<>{failureIllustration({ kind: 'network' })}</>)

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it.each<ApiFailure>([
    { kind: 'not-found', ...problem },
    { kind: 'server-error', ...problem },
    { kind: 'unavailable', ...problem, retryAfterSeconds: 30 },
    { kind: 'unexpected', status: undefined, detail: undefined },
  ])('leaves the warning badge to any other cause (%j)', (failure) => {
    expect(failureIllustration(failure)).toBeUndefined()
  })
})
