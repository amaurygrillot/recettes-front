import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ToastsProvider } from './ToastsProvider'
import { useToasts } from './useToasts'

function Trigger({ retry }: { retry?: () => void }) {
  const toasts = useToasts()
  return (
    <>
      <button
        type="button"
        onClick={() => {
          toasts.success('Profil mis à jour')
        }}
      >
        réussir
      </button>
      <button
        type="button"
        onClick={() => {
          toasts.failure({ message: 'Enregistrement impossible.', detail: 'Cause', retry })
        }}
      >
        échouer
      </button>
    </>
  )
}

function renderTrigger(retry?: () => void) {
  render(
    <ToastsProvider>
      <Trigger {...(retry === undefined ? {} : { retry })} />
    </ToastsProvider>,
  )
  return userEvent.setup({ advanceTimers: (ms) => vi.advanceTimersByTime(ms) })
}

describe('ToastsProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a success as a status, and takes it away by itself after a few seconds', async () => {
    const user = renderTrigger()

    await user.click(screen.getByRole('button', { name: 'réussir' }))
    expect(screen.getByRole('status')).toHaveTextContent('Profil mis à jour')
    act(() => {
      vi.advanceTimersByTime(3900)
    })
    expect(screen.getByRole('status')).toBeVisible()
    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('keeps a failure on the screen until it is closed', async () => {
    const user = renderTrigger()

    await user.click(screen.getByRole('button', { name: 'échouer' }))
    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(screen.getByRole('alert')).toHaveTextContent('Enregistrement impossible.Cause')
    await user.click(screen.getByRole('button', { name: 'Fermer la notification' }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('offers « Réessayer » only when there is something to retry, and retrying closes it', async () => {
    const retry = vi.fn()
    const user = renderTrigger(retry)

    await user.click(screen.getByRole('button', { name: 'échouer' }))
    await user.click(screen.getByRole('button', { name: 'Réessayer' }))

    expect(retry).toHaveBeenCalledOnce()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('has no « Réessayer » for a failure that retrying would not change', async () => {
    const user = renderTrigger()

    await user.click(screen.getByRole('button', { name: 'échouer' }))

    expect(screen.queryByRole('button', { name: 'Réessayer' })).not.toBeInTheDocument()
  })

  it('stacks several notifications and closes them one by one', async () => {
    const user = renderTrigger()

    await user.click(screen.getByRole('button', { name: 'échouer' }))
    await user.click(screen.getByRole('button', { name: 'échouer' }))
    expect(screen.getAllByRole('alert')).toHaveLength(2)
    const [first] = screen.getAllByRole('button', { name: 'Fermer la notification' })
    if (first === undefined) throw new Error('No notification to close')
    await user.click(first)

    expect(screen.getAllByRole('alert')).toHaveLength(1)
  })

  it('has its own named region, always on the page', () => {
    renderTrigger()

    expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument()
  })

  it('refuses to be used without a provider: a notification must never be lost silently', () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    expect(() => render(<Trigger />)).toThrow('useToasts needs a ToastsProvider above it')

    quiet.mockRestore()
  })
})
