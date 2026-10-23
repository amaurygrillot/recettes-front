import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { Avatar } from './Avatar'
import { strings } from './strings'

describe('Avatar', () => {
  it('shows the initials and is named after the full name', () => {
    render(<Avatar name="Anne Girard" />)

    expect(screen.getByRole('img', { name: 'Anne Girard' })).toHaveTextContent('AG')
  })

  it('gives a single letter for a single name', () => {
    render(<Avatar name="Madonna" />)

    expect(screen.getByRole('img', { name: 'Madonna' })).toHaveTextContent('M')
  })

  it.each(['', '   ', undefined])('is anonymous for the name %j', (name) => {
    const { container } = render(name === undefined ? <Avatar /> : <Avatar name={name} />)

    expect(screen.getByRole('img', { name: strings.anonymous })).toBeVisible()
    expect(container).not.toHaveTextContent(/\p{L}/u)
  })

  it('keeps the same colour for the same name, whatever its case or spacing', () => {
    const { rerender } = render(<Avatar name="Anne Girard" />)
    const classes = screen.getByRole('img').className

    rerender(<Avatar name="  anne girard " />)

    expect(screen.getByRole('img').className).toBe(classes)
  })

  it.each(['Anne Girard', ''])(
    'can be decorative, then it has no role and no name (%j)',
    (name) => {
      const { container } = render(<Avatar name={name} decorative />)

      expect(screen.queryByRole('img')).not.toBeInTheDocument()
      expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    },
  )

  it('is as big as asked', () => {
    render(<Avatar name="Anne Girard" size={96} />)

    expect(screen.getByRole('img')).toHaveStyle({ width: '96px', height: '96px' })
  })

  it('has no accessibility violation', async () => {
    const { container } = render(
      <div>
        <Avatar name="Anne Girard" size={40} />
        <Avatar name="Madonna" />
        <Avatar name="Éloïse Çelik" size={96} />
        <Avatar />
      </div>,
    )

    await expectNoAccessibilityViolations(container)
  })
})
