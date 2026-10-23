import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { installIntersectionObserver } from '../test/intersectionObserver'
import { useActiveSection } from './useActiveSection'

const IDS = ['profil', 'email', 'mdp'] as const

function Page() {
  const { active, select } = useActiveSection(IDS)
  return (
    <div>
      {IDS.map((id) => (
        <section key={id} id={id} />
      ))}
      <p>actif : {active}</p>
      <button
        type="button"
        onClick={() => {
          select('mdp')
        }}
      >
        choisir
      </button>
    </div>
  )
}

describe('useActiveSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts on the first section', () => {
    installIntersectionObserver()
    render(<Page />)

    expect(screen.getByText('actif : profil')).toBeVisible()
  })

  it('follows the section that comes into the upper part of the screen', () => {
    const intersection = installIntersectionObserver()
    render(<Page />)

    intersection.report({ visible: false, bottom: -10, only: 'profil' })
    intersection.report({ visible: true, bottom: 300, only: 'email' })

    expect(screen.getByText('actif : email')).toBeVisible()
  })

  it('keeps the first of several sections that are in view', () => {
    const intersection = installIntersectionObserver()
    render(<Page />)

    intersection.report({ visible: true, bottom: 300, only: 'email' })
    intersection.report({ visible: true, bottom: 500, only: 'mdp' })

    expect(screen.getByText('actif : email')).toBeVisible()
  })

  it('keeps the last section while none is in view', () => {
    const intersection = installIntersectionObserver()
    render(<Page />)
    intersection.report({ visible: true, bottom: 300, only: 'email' })

    intersection.report({ visible: false, bottom: 900, only: 'email' })

    expect(screen.getByText('actif : email')).toBeVisible()
  })

  it('takes a section at once when it is selected', () => {
    installIntersectionObserver()
    render(<Page />)

    act(() => {
      screen.getByRole('button', { name: 'choisir' }).click()
    })

    expect(screen.getByText('actif : mdp')).toBeVisible()
  })

  it('stops observing when the page goes away', () => {
    const intersection = installIntersectionObserver()
    const { unmount } = render(<Page />)
    expect(intersection.observedCount()).toBe(1)

    unmount()

    expect(intersection.observedCount()).toBe(0)
  })

  it('keeps the first section where the browser cannot observe', () => {
    render(<Page />)

    expect(screen.getByText('actif : profil')).toBeVisible()
  })
})
