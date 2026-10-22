import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Skeleton } from '../Skeleton/Skeleton'
import { LoadingRegion } from './LoadingRegion'

describe('LoadingRegion', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows nothing during the first 300 ms', () => {
    const { container } = render(
      <LoadingRegion label="Chargement des recettes…">
        <Skeleton className="h-6" />
      </LoadingRegion>,
    )

    act(() => {
      vi.advanceTimersByTime(299)
    })

    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(container.querySelector('[aria-hidden]')).not.toBeInTheDocument()
  })

  it('announces the wait once the delay has passed', () => {
    render(
      <LoadingRegion label="Chargement des recettes…">
        <Skeleton className="h-6" />
      </LoadingRegion>,
    )

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByRole('status')).toHaveTextContent('Chargement des recettes…')
  })

  it('keeps what it wraps out of the accessibility tree', () => {
    render(
      <LoadingRegion label="Chargement des recettes…" delayMs={0}>
        <button type="button">Contenu factice</button>
      </LoadingRegion>,
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('can be shown at once with a delay of 0', () => {
    render(
      <LoadingRegion label="Chargement…" delayMs={0}>
        <Skeleton className="h-6" />
      </LoadingRegion>,
    )

    expect(screen.getByRole('status')).toHaveTextContent('Chargement…')
  })

  it('has no accessibility violation', async () => {
    vi.useRealTimers()
    const { container } = render(
      <LoadingRegion label="Chargement…" delayMs={0}>
        <Skeleton className="h-6" />
      </LoadingRegion>,
    )

    await expectNoAccessibilityViolations(container)
  })
})
