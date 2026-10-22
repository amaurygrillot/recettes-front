import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { StyleguideScreen } from './StyleguideScreen'
import { strings } from './strings'

const SECTION_TITLES = [
  strings.logo.title,
  strings.icons.title,
  strings.buttons.title,
  strings.tags.title,
  strings.fields.title,
  strings.loading.title,
  strings.states.title,
  strings.avatars.title,
]

describe('StyleguideScreen', () => {
  it('has one page title and a section per family of components', () => {
    render(<StyleguideScreen />)

    expect(screen.getByRole('heading', { level: 1, name: strings.title })).toBeVisible()
    for (const title of SECTION_TITLES) {
      expect(screen.getByRole('region', { name: title })).toBeVisible()
    }
  })

  it('lets a filter chip be chosen and dropped again', async () => {
    const user = userEvent.setup()
    render(<StyleguideScreen />)
    const chip = screen.getByRole('button', { name: strings.tags.desserts })

    await user.click(chip)
    expect(chip).toHaveAttribute('aria-pressed', 'true')

    await user.click(chip)
    expect(chip).toHaveAttribute('aria-pressed', 'false')
  })

  it('has no accessibility violation', async () => {
    const { container } = render(<StyleguideScreen />)

    await expectNoAccessibilityViolations(container)
  })
})
