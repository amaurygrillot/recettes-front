import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { AdviceNote } from './AdviceNote'

const props = { title: 'le petit conseil', label: 'Le petit conseil' }

describe('AdviceNote', () => {
  it('shows the tip in a frame named after what the page calls it', () => {
    render(<AdviceNote html="<p>Prépare la pâte la veille.</p>" {...props} />)

    expect(screen.getByRole('complementary', { name: 'Le petit conseil' })).toHaveTextContent(
      'Prépare la pâte la veille.',
    )
  })

  it('cleans what was stored before showing it', () => {
    render(<AdviceNote html={'<p>Sûr</p><script>window.hacked = true</script>'} {...props} />)

    expect(screen.getByText('Sûr')).toBeVisible()
    expect(document.querySelector('script')).toBeNull()
  })

  it('has no accessibility violation', async () => {
    const { container } = render(<AdviceNote html="<p>Un geste.</p>" {...props} />)

    await expectNoAccessibilityViolations(container)
  })
})
