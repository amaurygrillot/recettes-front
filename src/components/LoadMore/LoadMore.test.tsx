import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { LoadMore, type LoadMoreState } from './LoadMore'

const available = (load = vi.fn()): LoadMoreState => ({ status: 'available', load })

function renderMore(more: LoadMoreState, lastBatch?: number, shown = 20, total = 134) {
  return render(<LoadMore shown={shown} total={total} more={more} lastBatch={lastBatch} />)
}

describe('LoadMore', () => {
  describe('when there is more', () => {
    it('counts what is shown and offers « Voir plus de recettes »', () => {
      renderMore(available())

      expect(screen.getByText('20 sur 134 recettes')).toBeVisible()
      expect(screen.getByRole('button', { name: 'Voir plus de recettes' })).toBeEnabled()
    })

    it('asks for the next page with a touch and with the keyboard', async () => {
      const load = vi.fn()
      const user = userEvent.setup()
      renderMore(available(load))

      await user.click(screen.getByRole('button', { name: 'Voir plus de recettes' }))
      await user.keyboard('{Enter}')

      expect(load).toHaveBeenCalledTimes(2)
    })
  })

  describe('while loading', () => {
    it('keeps the button in place, busy, and says how many are coming', () => {
      renderMore({ status: 'loading', incoming: 20 })

      const button = screen.getByRole('button', { name: 'Chargement…' })
      expect(button).toHaveAttribute('aria-busy', 'true')
      expect(screen.getAllByText('Chargement de 20 recettes de plus…')).not.toHaveLength(0)
    })

    it('announces the wait in a live region that is always there', () => {
      renderMore({ status: 'loading', incoming: 14 })

      expect(screen.getByRole('status')).toHaveTextContent('Chargement de 14 recettes de plus…')
    })

    it('keeps the focus on the button that was pressed', async () => {
      const user = userEvent.setup()
      const load = vi.fn()
      const { rerender } = renderMore(available(load))
      await user.tab()
      expect(screen.getByRole('button')).toHaveFocus()

      rerender(
        <LoadMore
          shown={20}
          total={134}
          more={{ status: 'loading', incoming: 20 }}
          lastBatch={undefined}
        />,
      )

      expect(screen.getByRole('button', { name: 'Chargement…' })).toHaveFocus()
    })
  })

  describe('once a page has been added', () => {
    it('announces how many recipes were added', () => {
      renderMore(available(), 20, 40)

      expect(screen.getByRole('status')).toHaveTextContent('20 recettes de plus chargées')
    })

    it('uses the singular for one recipe', () => {
      renderMore(available(), 1, 21)

      expect(screen.getByRole('status')).toHaveTextContent('1 recette de plus chargée')
    })

    it('announces nothing before anything was loaded', () => {
      renderMore(available())

      expect(screen.getByRole('status')).toBeEmptyDOMElement()
    })
  })

  describe('when the next page failed', () => {
    it('says so in an alert, keeps the count, and offers to try again', async () => {
      const retry = vi.fn()
      renderMore({ status: 'failed', message: 'Impossible de charger la suite.', retry })

      expect(screen.getByRole('alert')).toHaveTextContent('Impossible de charger la suite.')
      expect(screen.getByText('20 sur 134 recettes')).toBeVisible()

      await userEvent.setup().click(screen.getByRole('button', { name: 'Réessayer' }))

      expect(retry).toHaveBeenCalledOnce()
    })

    it('shows the message it is given, whatever the cause', () => {
      renderMore({
        status: 'failed',
        message: 'Le serveur est très sollicité. Réessaie dans 30 secondes.',
        retry: vi.fn(),
      })

      expect(screen.getByRole('alert')).toHaveTextContent(
        'Le serveur est très sollicité. Réessaie dans 30 secondes.',
      )
    })

    it('keeps the focus on the button across the failure', async () => {
      const user = userEvent.setup()
      const { rerender } = renderMore({ status: 'loading', incoming: 20 })
      await user.tab()

      rerender(
        <LoadMore
          shown={20}
          total={134}
          more={{ status: 'failed', message: 'Impossible de charger la suite.', retry: vi.fn() }}
          lastBatch={undefined}
        />,
      )

      expect(screen.getByRole('button', { name: 'Réessayer' })).toHaveFocus()
    })
  })

  describe('when everything is shown', () => {
    it('replaces the button by a sentence', () => {
      renderMore({ status: 'exhausted' }, undefined, 134)

      expect(screen.getByText('Tu as tout vu : 134 recettes.')).toBeVisible()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('uses the singular for a single recipe', () => {
      renderMore({ status: 'exhausted' }, undefined, 1, 1)

      expect(screen.getByText('Tu as tout vu : 1 recette.')).toBeVisible()
    })

    it('moves the focus to that sentence when the button the reader pressed disappears', () => {
      const { rerender } = renderMore({ status: 'loading', incoming: 7 }, undefined, 20, 27)

      rerender(<LoadMore shown={27} total={27} more={{ status: 'exhausted' }} lastBatch={7} />)

      expect(screen.getByText('Tu as tout vu : 27 recettes.')).toHaveFocus()
    })

    it('does not take the focus when the page simply had nothing more to load', () => {
      renderMore({ status: 'exhausted' }, undefined, 5, 5)

      expect(screen.getByText('Tu as tout vu : 5 recettes.')).not.toHaveFocus()
    })
  })

  it.each([
    ['available', available()],
    ['loading', { status: 'loading', incoming: 20 } as const],
    [
      'failed',
      { status: 'failed', message: 'Impossible de charger la suite.', retry: vi.fn() } as const,
    ],
    ['exhausted', { status: 'exhausted' } as const],
  ])('has no accessibility violation when %s', async (_state, more) => {
    const { container } = renderMore(more)

    await expectNoAccessibilityViolations(container)
  })
})
