import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Emoji } from './Emoji'

describe('Emoji', () => {
  it('draws the emoji with the Twemoji file served by the app itself', () => {
    render(<Emoji emoji="🎄" size="name" />)

    expect(screen.getByRole('presentation')).toHaveAttribute('src', '/twemoji/1f384.svg')
  })

  it('is decorative: it has no text alternative, so nothing is read in front of the name of the list', async () => {
    const { container } = render(<Emoji emoji="🍝" size="tile" />)

    expect(screen.getByRole('presentation')).toHaveAttribute('alt', '')
    await expectNoAccessibilityViolations(container)
  })

  it.each(['name', 'badge', 'title', 'tile'] as const)('draws the size « %s »', (size) => {
    render(<Emoji emoji="👩‍🍳" size={size} />)

    expect(screen.getByRole('presentation')).toHaveAttribute('src', '/twemoji/1f469-200d-1f373.svg')
  })

  it('cannot be dragged out of its tile', () => {
    render(<Emoji emoji="🎄" size="name" />)

    expect(screen.getByRole('presentation')).toHaveAttribute('draggable', 'false')
  })
})
