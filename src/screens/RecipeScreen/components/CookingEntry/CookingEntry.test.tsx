import { render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BottomSlotContext } from '../../../../app/bottomSlot'
import { saveCookingStep } from '../../../../app/cookingProgress'
import { installIntersectionObserver } from '../../../../test/intersectionObserver'
import { installMatchMedia, removeMatchMedia } from '../../../../test/matchMedia'
import { CookingEntry } from './CookingEntry'

function renderEntry({ stepCount = 3, slot }: { stepCount?: number; slot?: HTMLElement } = {}) {
  const router = createMemoryRouter([
    {
      path: '/',
      element: (
        <BottomSlotContext value={slot ?? null}>
          <CookingEntry recipeId="r-1" stepCount={stepCount} />
        </BottomSlotContext>
      ),
    },
  ])
  return render(<RouterProvider router={router} />)
}

function bottomSlot(): HTMLElement {
  const slot = document.createElement('div')
  slot.dataset.testid = 'bottom-slot'
  document.body.appendChild(slot)
  return slot
}

describe('CookingEntry', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    removeMatchMedia()
    window.localStorage.clear()
    document.querySelectorAll('[data-testid=bottom-slot]').forEach((slot) => {
      slot.remove()
    })
  })

  it('is a link into the step-by-step mode', () => {
    renderEntry()

    expect(screen.getByRole('link', { name: 'Cuisiner pas à pas' })).toHaveAttribute(
      'href',
      '/recettes/r-1/pas-a-pas',
    )
  })

  it('offers to resume at the step kept on this device', () => {
    saveCookingStep('r-1', 3)
    renderEntry()

    expect(screen.getByRole('link', { name: "Reprendre à l'étape 3" })).toBeVisible()
  })

  it('is not shown for a recipe without steps', () => {
    renderEntry({ stepCount: 0 })

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  describe('the bar above the tabs', () => {
    it('appears on a phone once the button of the page has scrolled out of the top', () => {
      const intersection = installIntersectionObserver()
      const slot = bottomSlot()
      renderEntry({ slot })
      expect(screen.getAllByRole('link', { name: 'Cuisiner pas à pas' })).toHaveLength(1)

      intersection.report({ visible: false, bottom: -10 })

      expect(screen.getAllByRole('link', { name: 'Cuisiner pas à pas' })).toHaveLength(2)
      expect(within(slot).getByRole('link', { name: 'Cuisiner pas à pas' })).toBeVisible()
    })

    it('is not there while the button of the page is on the screen', () => {
      const intersection = installIntersectionObserver()
      renderEntry({ slot: bottomSlot() })

      intersection.report({ visible: true, bottom: 400 })

      expect(screen.getAllByRole('link', { name: 'Cuisiner pas à pas' })).toHaveLength(1)
    })

    it('is not there for a tablet or a desktop: the button of the page is enough', () => {
      const intersection = installIntersectionObserver()
      installMatchMedia(768)
      renderEntry({ slot: bottomSlot() })

      intersection.report({ visible: false, bottom: -10 })

      expect(screen.getAllByRole('link', { name: 'Cuisiner pas à pas' })).toHaveLength(1)
    })

    it('says « Reprendre » in the bar too', () => {
      saveCookingStep('r-1', 2)
      const intersection = installIntersectionObserver()
      renderEntry({ slot: bottomSlot() })

      intersection.report({ visible: false, bottom: -10 })

      expect(screen.getAllByRole('link', { name: "Reprendre à l'étape 2" })).toHaveLength(2)
    })

    it('goes away again when the reader comes back up to the button', () => {
      const intersection = installIntersectionObserver()
      renderEntry({ slot: bottomSlot() })
      intersection.report({ visible: false, bottom: -10 })

      intersection.report({ visible: true, bottom: 200 })

      expect(screen.getAllByRole('link', { name: 'Cuisiner pas à pas' })).toHaveLength(1)
    })
  })
})
