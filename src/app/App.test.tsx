import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { strings } from './strings'

describe('App', () => {
  it('mounts the router and shows the home placeholder', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: strings.appName })).toBeVisible()
  })
})
