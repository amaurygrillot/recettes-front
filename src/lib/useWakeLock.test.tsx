import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useWakeLock } from './useWakeLock'

function Probe({ active }: { active: boolean }) {
  useWakeLock(active)
  return null
}

function installWakeLock(request: () => Promise<{ release: () => Promise<void> }>) {
  Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request } })
}

afterEach(() => {
  Reflect.deleteProperty(navigator, 'wakeLock')
})

describe('useWakeLock', () => {
  it('keeps the screen on while active, and lets go when it is not any more', async () => {
    const release = vi.fn(() => Promise.resolve())
    const request = vi.fn(() => Promise.resolve({ release }))
    installWakeLock(request)

    const { unmount } = render(<Probe active />)
    await vi.waitFor(() => {
      expect(request).toHaveBeenCalledWith('screen')
    })
    unmount()

    await vi.waitFor(() => {
      expect(release).toHaveBeenCalledOnce()
    })
  })

  it('asks for nothing while not active', () => {
    const request = vi.fn(() => Promise.resolve({ release: () => Promise.resolve() }))
    installWakeLock(request)

    render(<Probe active={false} />)

    expect(request).not.toHaveBeenCalled()
  })

  it('asks again when the page comes back, since the browser took the lock away', async () => {
    const request = vi.fn(() => Promise.resolve({ release: () => Promise.resolve() }))
    installWakeLock(request)
    render(<Probe active />)
    await vi.waitFor(() => {
      expect(request).toHaveBeenCalledOnce()
    })

    document.dispatchEvent(new Event('visibilitychange'))

    await vi.waitFor(() => {
      expect(request).toHaveBeenCalledTimes(2)
    })
  })

  it('lets the screen sleep, without failing, when the browser refuses', async () => {
    const request = vi.fn(() => Promise.reject(new DOMException('Low battery', 'NotAllowedError')))
    installWakeLock(request)

    render(<Probe active />)

    await vi.waitFor(() => {
      expect(request).toHaveBeenCalledOnce()
    })
  })

  it('does nothing in a browser without the API', () => {
    expect(() => render(<Probe active />)).not.toThrow()
  })
})
