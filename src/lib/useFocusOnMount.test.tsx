import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useFocusOnMount } from './useFocusOnMount'

function Title() {
  const ref = useFocusOnMount<HTMLHeadingElement>()
  return (
    <h1 ref={ref} tabIndex={-1}>
      Regarde ta boîte mail
    </h1>
  )
}

describe('useFocusOnMount', () => {
  it('puts the focus on the element once it is on the page', () => {
    render(<Title />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus()
  })
})
