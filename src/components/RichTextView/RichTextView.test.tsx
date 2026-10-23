import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { RichTextView } from './RichTextView'

function renderHtml(html: string) {
  return render(<RichTextView html={html} />)
}

describe('RichTextView', () => {
  it('shows what the editor writes: paragraphs, bold, italic and both lists', () => {
    renderHtml(
      '<p>Mélange <strong>bien</strong> et <em>vite</em>.</p><ul><li>farine</li><li>sucre</li></ul><ol><li>un</li><li>deux</li></ol>',
    )

    expect(screen.getByText(/Mélange/)).toBeVisible()
    expect(screen.getByText('bien').tagName).toBe('STRONG')
    expect(screen.getByText('vite').tagName).toBe('EM')
    expect(screen.getAllByRole('list')).toHaveLength(2)
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('shows plain text as it is', () => {
    renderHtml('Juste du texte, sans balise.')

    expect(screen.getByText('Juste du texte, sans balise.')).toBeVisible()
  })

  describe('against what an attacker could have stored', () => {
    it.each([
      ['a script', '<p>Bonjour</p><script>window.hacked = true</script>'],
      ['an image with an error handler', '<img src="x" onerror="window.hacked = true">'],
      ['an event handler on a paragraph', '<p onclick="window.hacked = true">Clique</p>'],
      ['a link to javascript', '<a href="javascript:window.hacked = true">Clique</a>'],
      ['an iframe', '<iframe src="https://example.org"></iframe>'],
      ['a form', '<form action="https://example.org"><input name="x"></form>'],
      ['an SVG with a script', '<svg onload="window.hacked = true"><script>1</script></svg>'],
      ['a style', '<style>body { display: none }</style><p>Texte</p>'],
    ])('removes %s', (_what, html) => {
      const { container } = renderHtml(html)

      expect(container.querySelector('script, img, a, iframe, form, input, svg, style')).toBeNull()
      expect(Reflect.get(window, 'hacked')).toBeUndefined()
    })

    it('removes every attribute, even on the tags it keeps', () => {
      const { container } = renderHtml(
        '<p class="x" style="color:red" id="y" onclick="1" data-a="b">Texte</p>',
      )

      const paragraph = container.querySelector('p')
      expect(paragraph).toHaveTextContent('Texte')
      expect(paragraph?.getAttributeNames()).toEqual([])
    })

    it('keeps the text of what it removes when that text is harmless', () => {
      renderHtml('<div><span>Garde ce texte</span></div>')

      expect(screen.getByText('Garde ce texte')).toBeVisible()
    })
  })

  it('has no accessibility violation', async () => {
    const { container } = renderHtml('<p>Texte</p><ul><li>un</li></ul>')

    await expectNoAccessibilityViolations(container)
  })
})
