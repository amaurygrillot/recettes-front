import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { SearchLauncher, type SearchLauncherProps } from './SearchLauncher'

function renderLauncher(props: Partial<SearchLauncherProps> = {}) {
  const onOpen = vi.fn<(firstKey?: string) => void>()
  const view = render(<SearchLauncher label="Chercher une recette" onOpen={onOpen} {...props} />)
  return { onOpen, ...view }
}

const launcher = () => screen.getByRole('button', { name: /^Chercher une recette/ })

describe('SearchLauncher', () => {
  it('looks like a field, says what it is for, and is a button that opens a dialog', () => {
    renderLauncher()

    expect(launcher()).toHaveAccessibleName('Chercher une recette')
    expect(launcher()).toHaveAttribute('aria-haspopup', 'dialog')
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
  })

  it('opens the search on a touch, and on Enter, with nothing to carry', async () => {
    const user = userEvent.setup()
    const { onOpen } = renderLauncher()

    await user.click(launcher())
    launcher().focus()
    await user.keyboard('{Enter}')

    expect(onOpen).toHaveBeenCalledTimes(2)
    expect(onOpen).toHaveBeenNthCalledWith(1)
    expect(onOpen).toHaveBeenNthCalledWith(2)
  })

  it('carries the first printable key typed on it into the search', async () => {
    const user = userEvent.setup()
    const { onOpen } = renderLauncher()
    launcher().focus()

    await user.keyboard('t')

    expect(onOpen).toHaveBeenCalledExactlyOnceWith('t')
  })

  it('carries a character typed with AltGr, which reports Ctrl and Alt together', () => {
    const { onOpen } = renderLauncher()

    fireEvent.keyDown(launcher(), { key: '@', ctrlKey: true, altKey: true, modifierAltGraph: true })

    expect(onOpen).toHaveBeenCalledExactlyOnceWith('@')
  })

  it.each([
    ['a shortcut', '{Control>}a{/Control}'],
    ['a command', '{Meta>}c{/Meta}'],
    ['Tab', '{Tab}'],
    ['an arrow', '{ArrowDown}'],
  ])('carries nothing for %s', async (_what, keys) => {
    const user = userEvent.setup()
    const { onOpen } = renderLauncher()
    launcher().focus()

    await user.keyboard(keys)

    expect(onOpen).not.toHaveBeenCalledWith(expect.any(String))
  })

  it('shows the word being searched, and a cross that clears it without opening the search', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    const { onOpen } = renderLauncher({
      value: 'tarte',
      clear: { label: 'Effacer la recherche', onClear },
    })

    expect(launcher()).toHaveAccessibleName('Chercher une recette : tarte')
    await user.click(screen.getByRole('button', { name: 'Effacer la recherche' }))

    expect(onClear).toHaveBeenCalledOnce()
    expect(onOpen).not.toHaveBeenCalled()
  })

  it('has no cross while nothing is searched', () => {
    renderLauncher({ clear: { label: 'Effacer la recherche', onClear: vi.fn() } })

    expect(screen.queryByRole('button', { name: 'Effacer la recherche' })).not.toBeInTheDocument()
  })

  it('has no accessibility violation', async () => {
    const { container } = renderLauncher({
      value: 'tarte',
      clear: { label: 'Effacer la recherche', onClear: vi.fn() },
    })

    await expectNoAccessibilityViolations(container)
  })
})
