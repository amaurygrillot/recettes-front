import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WavyRule } from './WavyRule'

describe('WavyRule', () => {
  it('is decoration, hidden from assistive technology', () => {
    const { container } = render(<WavyRule />)

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
