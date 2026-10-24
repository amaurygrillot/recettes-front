import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import {
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  FORMAT_TEXT_COMMAND,
  getNearestEditorFromDOMNode,
  type LexicalEditor,
} from 'lexical'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { installMatchMedia, removeMatchMedia } from '../../test/matchMedia'
import { RichTextEditor, type RichTextEditorProps } from './RichTextEditor'

function renderEditor(props: Partial<RichTextEditorProps> = {}) {
  const onChange = vi.fn<(html: string) => void>()
  const rendered = render(
    <RichTextEditor
      variant="introduction"
      label="Introduction"
      note="facultatif"
      placeholder="Présente ta recette en quelques phrases"
      initialHtml=""
      onChange={onChange}
      {...props}
    />,
  )
  return { ...rendered, onChange }
}

const textbox = () => screen.getByRole('textbox', { name: /^Introduction/ })
const tool = (name: string) => screen.getByRole('button', { name })
const lastHtml = (onChange: ReturnType<typeof vi.fn<(html: string) => void>>) =>
  onChange.mock.calls.at(-1)?.[0]

// jsdom does not deliver typed characters to a contenteditable the way a browser does, so the text
// is put in through the editor itself; every button, command and conversion is the real one.
function editorOf(element: HTMLElement): LexicalEditor {
  const editor = getNearestEditorFromDOMNode(element)
  if (editor === null) throw new Error('No editor behind this element')
  return editor
}

/** Writes at the caret, which is at the end of the text until something else was chosen. */
async function write(editor: LexicalEditor, text: string, { enter = false } = {}) {
  await act(async () => {
    editor.update(() => {
      if (!$isRangeSelection($getSelection())) $getRoot().selectEnd()
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) return
      if (enter) selection.insertParagraph()
      selection.insertText(text)
    })
    await Promise.resolve()
  })
}

async function placeCaretAtEnd(editor: LexicalEditor) {
  await act(async () => {
    editor.update(() => {
      $getRoot().selectEnd()
    })
    await Promise.resolve()
  })
}

describe('RichTextEditor', () => {
  beforeEach(() => {
    installMatchMedia(1280)
  })

  afterEach(() => {
    removeMatchMedia()
  })

  describe('the field', () => {
    it('is a labelled text box, with its note and an example while it is empty', () => {
      renderEditor()

      expect(textbox()).toHaveAttribute('aria-multiline', 'true')
      expect(screen.getByText('facultatif')).toBeVisible()
      expect(screen.getByText('Présente ta recette en quelques phrases')).toBeVisible()
    })

    it('has the six tools, in a toolbar of its own, and no more', () => {
      renderEditor()

      const toolbar = screen.getByRole('toolbar', { name: 'Mise en forme du texte' })
      expect(
        Array.from(toolbar.querySelectorAll('button'), (button) =>
          button.getAttribute('aria-label'),
        ),
      ).toEqual([
        'Gras',
        'Italique',
        'Liste à puces',
        'Liste numérotée',
        'Annuler la dernière action',
        'Rétablir',
      ])
    })

    it('starts with the stored text, opened for editing', () => {
      renderEditor({ initialHtml: '<p>La tarte de <strong>tous</strong> les dimanches.</p>' })

      expect(textbox()).toHaveTextContent('La tarte de tous les dimanches.')
      expect(screen.queryByText('Présente ta recette en quelques phrases')).not.toBeInTheDocument()
    })

    it('does not report the text it started with as a change', () => {
      const { onChange } = renderEditor({ initialHtml: '<p>Déjà écrit</p>' })

      expect(onChange).not.toHaveBeenCalled()
    })

    it('shows a hint, and replaces it with the error, which puts the field in error', () => {
      const { rerender } = renderEditor({ hint: 'Quelques phrases suffisent.' })
      expect(textbox()).toHaveAccessibleDescription('Quelques phrases suffisent.')

      rerender(
        <RichTextEditor
          variant="introduction"
          label="Introduction"
          placeholder="Présente ta recette en quelques phrases"
          initialHtml=""
          onChange={vi.fn()}
          hint="Quelques phrases suffisent."
          error="Écris au moins une phrase."
        />,
      )

      expect(textbox()).toBeInvalid()
      expect(textbox()).toHaveAccessibleDescription('Écris au moins une phrase.')
    })

    it('has no accessibility violation', async () => {
      const { container } = renderEditor({ initialHtml: '<p>Du texte</p>', hint: 'Une aide' })

      await expectNoAccessibilityViolations(container)
    })
  })

  describe('writing', () => {
    it('reports the text as stored HTML, as it is written', async () => {
      const { onChange } = renderEditor()

      await write(editorOf(textbox()), 'Mélange tout')

      await waitFor(() => {
        expect(lastHtml(onChange)).toBe('<p>Mélange tout</p>')
      })
    })

    it('reports an empty string once everything is erased', async () => {
      const user = userEvent.setup()
      const { onChange } = renderEditor({ initialHtml: '<p>Un</p>' })

      await user.click(textbox())
      await user.keyboard('{Control>}a{/Control}{Backspace}')

      await waitFor(() => {
        expect(lastHtml(onChange)).toBe('')
      })
    })

    it('writes in bold once « Gras » is on, and says it is on', async () => {
      const user = userEvent.setup()
      const { onChange } = renderEditor()
      const editor = editorOf(textbox())
      await placeCaretAtEnd(editor)

      await user.click(tool('Gras'))
      await write(editor, 'bien')

      await waitFor(() => {
        expect(lastHtml(onChange)).toBe('<p><strong>bien</strong></p>')
      })
      expect(tool('Gras')).toHaveAttribute('aria-pressed', 'true')
      expect(tool('Italique')).toHaveAttribute('aria-pressed', 'false')
    })

    it('writes in italic with « Italique »', async () => {
      const user = userEvent.setup()
      const { onChange } = renderEditor()
      const editor = editorOf(textbox())
      await placeCaretAtEnd(editor)

      await user.click(tool('Italique'))
      await write(editor, 'vite')

      await waitFor(() => {
        expect(lastHtml(onChange)).toBe('<p><em>vite</em></p>')
      })
    })

    it('starts a bulleted list, then turns it into a numbered one, and says which is on', async () => {
      const user = userEvent.setup()
      const { onChange } = renderEditor()
      const editor = editorOf(textbox())
      await placeCaretAtEnd(editor)

      await user.click(tool('Liste à puces'))
      await write(editor, 'farine')
      await write(editor, 'sucre', { enter: true })
      await waitFor(() => {
        expect(lastHtml(onChange)).toBe('<ul><li>farine</li><li>sucre</li></ul>')
      })
      expect(tool('Liste à puces')).toHaveAttribute('aria-pressed', 'true')
      expect(tool('Liste numérotée')).toHaveAttribute('aria-pressed', 'false')
      await user.click(tool('Liste numérotée'))

      await waitFor(() => {
        expect(lastHtml(onChange)).toBe('<ol><li>farine</li><li>sucre</li></ol>')
      })
      expect(tool('Liste numérotée')).toHaveAttribute('aria-pressed', 'true')
    })

    it('takes the list off when its button is pressed again', async () => {
      const user = userEvent.setup()
      const { onChange } = renderEditor({ initialHtml: '<ul><li>farine</li></ul>' })
      await placeCaretAtEnd(editorOf(textbox()))

      await user.click(tool('Liste à puces'))

      await waitFor(() => {
        expect(lastHtml(onChange)).toBe('<p>farine</p>')
      })
    })

    it('can undo, then redo, and the buttons say when they cannot', async () => {
      const user = userEvent.setup()
      const { onChange } = renderEditor()
      const editor = editorOf(textbox())
      expect(tool('Annuler la dernière action')).toBeDisabled()
      expect(tool('Rétablir')).toBeDisabled()
      await write(editor, 'Un')
      await waitFor(() => {
        expect(tool('Annuler la dernière action')).toBeEnabled()
      })

      await user.click(tool('Annuler la dernière action'))
      await waitFor(() => {
        expect(lastHtml(onChange)).toBe('')
      })
      expect(tool('Rétablir')).toBeEnabled()
      await user.click(tool('Rétablir'))

      await waitFor(() => {
        expect(lastHtml(onChange)).toBe('<p>Un</p>')
      })
    })

    it('keeps the focus in the text when a tool is pressed', async () => {
      const user = userEvent.setup()
      renderEditor()
      await user.click(textbox())

      await user.click(tool('Gras'))

      expect(textbox()).toHaveFocus()
    })
  })

  describe('what it refuses to write', () => {
    it('swallows the other formats: Ctrl + U does not underline', async () => {
      renderEditor()
      const editor = editorOf(textbox())
      await write(editor, 'sous')

      let handled = false
      await act(async () => {
        editor.update(() => {
          $getRoot().select()
        })
        handled = editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
        await Promise.resolve()
      })

      expect(handled).toBe(true)
      expect(
        editor.read(() =>
          $getRoot()
            .getAllTextNodes()
            .some((node) => $isTextNode(node) && node.hasFormat('underline')),
        ),
      ).toBe(false)
    })

    it('turns a heading that is pasted in into a paragraph, and a quote too', async () => {
      const { onChange } = renderEditor()
      const editor = editorOf(textbox())

      await act(async () => {
        editor.update(() => {
          // What a paste of a heading and of a quote brings in, as the editor receives it.
          const heading = $createHeadingNode('h1').append($createTextNode('Titre'))
          const quote = $createQuoteNode().append($createTextNode('Citation'))
          $getRoot().clear().append(heading, quote)
        })
        await Promise.resolve()
      })

      await waitFor(() => {
        expect(lastHtml(onChange)).toBe('<p>Titre</p><p>Citation</p>')
      })
      expect(
        editor.read(() =>
          $getRoot()
            .getChildren()
            .map((block) => block.getType()),
        ),
      ).toEqual(['paragraph', 'paragraph'])
    })
  })

  describe('on a phone', () => {
    beforeEach(() => {
      installMatchMedia(390)
    })

    it('keeps the toolbar in the field until the text has the focus', () => {
      renderEditor()

      expect(screen.getByRole('toolbar')).not.toHaveClass('fixed')
    })

    it('moves the toolbar to the bar above the keyboard while the text has the focus, and back after', async () => {
      const user = userEvent.setup()
      renderEditor()

      await user.click(textbox())
      expect(screen.getByRole('toolbar')).toHaveClass('fixed')
      await act(async () => {
        textbox().blur()
        await Promise.resolve()
      })

      await waitFor(() => {
        expect(screen.getByRole('toolbar')).not.toHaveClass('fixed')
      })
    })

    it('keeps the toolbar docked while the focus goes from the text to a tool', async () => {
      const user = userEvent.setup()
      renderEditor()
      await user.click(textbox())

      await user.tab({ shift: true })

      expect(screen.getByRole('toolbar')).toHaveClass('fixed')
    })
  })
})
