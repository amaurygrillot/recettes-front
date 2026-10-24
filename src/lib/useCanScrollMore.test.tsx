import { fireEvent, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useCanScrollMore } from './useCanScrollMore'

function Reader({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const more = useCanScrollMore(ref, text)
  return (
    <div ref={ref} data-testid="reader">
      {more ? 'Il y a la suite' : 'Tout est là'}
    </div>
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

function sizes(scrollHeight: number, clientHeight: number) {
  vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(scrollHeight)
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(clientHeight)
}

describe('useCanScrollMore', () => {
  it('is false when everything fits', () => {
    sizes(200, 200)
    render(<Reader text="court" />)

    expect(screen.getByText('Tout est là')).toBeInTheDocument()
  })

  it('is true when the text is taller than the element, until the end is reached', () => {
    sizes(500, 200)
    render(<Reader text="long" />)
    expect(screen.getByText('Il y a la suite')).toBeInTheDocument()

    screen.getByTestId('reader').scrollTop = 300
    fireEvent.scroll(screen.getByTestId('reader'))

    expect(screen.getByText('Tout est là')).toBeInTheDocument()
  })

  it('measures again when the text changes', () => {
    sizes(200, 200)
    const { rerender } = render(<Reader text="court" />)
    expect(screen.getByText('Tout est là')).toBeInTheDocument()

    sizes(900, 200)
    rerender(<Reader text="très long" />)

    expect(screen.getByText('Il y a la suite')).toBeInTheDocument()
  })
})
