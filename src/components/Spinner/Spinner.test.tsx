import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('is decorative: assistive technology hears the text beside it, not the picture', () => {
    const { container } = render(<Spinner />)

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('is 24 px by default and takes another size', () => {
    const { container, rerender } = render(<Spinner />)
    expect(container.querySelector('svg')).toHaveAttribute('width', '24')

    rerender(<Spinner size={32} />)

    expect(container.querySelector('svg')).toHaveAttribute('width', '32')
  })
})
