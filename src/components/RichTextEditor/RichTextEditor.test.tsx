import { act, render, screen, waitFor, within } from '@testing-library/react'
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
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { expectNoAccessibilityViolations } from '../../test/expectNoAccessibilityViolations'
import { installMatchMedia, removeMatchMedia } from '../../test/matchMedia'
import { renderRoutes } from '../../test/renderRoutes'
import { RichTextEditor, type RichTextEditorProps } from './RichTextEditor'

function renderEditor(props: Partial<RichTextEditorProps> = {}) {
  const onChange = vi.fn<(html: string) => void>()
  const rendered = renderRoutes(
    [
      {
        path: '/',
        element: (
          <RichTextEditor
            variant="introduction"
            label="Introduction"
            note="facultatif"
            placeholder="Présente ta recette en quelques phrases"
            initialHtml=""
            onChange={onChange}
            {...props}
          />
        ),
      },
    ],
    '/',
  )
  return { ...rendered, onChange }
}

/** The field with the props that change between two renders of one test, in the router it needs. */
function fieldWith(props: Partial<RichTextEditorProps> = {}) {
  return (
    <MemoryRouter>
      <RichTextEditor
        variant="introduction"
        label="Introduction"
        placeholder="Présente ta recette en quelques phrases"
        initialHtml=""
        onChange={vi.fn()}
        {...props}
      />
    </MemoryRouter>
  )
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

/** Records where the editor's root is each time it is asked to take the focus (jsdom cannot show a contenteditable's caret). */
function recordFocusRoots(editor: LexicalEditor): (HTMLElement | null)[] {
  const roots: (HTMLElement | null)[] = []
  vi.spyOn(editor, 'focus').mockImplementation(() => {
    roots.push(editor.getRootElement())
  })
  return roots
}

const inDialog = (root: HTMLElement | null) =>
  root?.closest('[role="dialog"]') !== null && root !== null

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

    it('has the nine tools, in the order of use, in a toolbar of its own, and no more', () => {
      renderEditor()

      const toolbar = screen.getByRole('toolbar', { name: 'Mise en forme du texte' })
      expect(
        Array.from(toolbar.querySelectorAll('button'), (button) =>
          button.getAttribute('aria-label'),
        ),
      ).toEqual([
        'Taille du texte : Normal',
        'Gras',
        'Italique',
        'Souligné',
        'Barré',
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
      const { rerender } = render(fieldWith({ hint: 'Quelques phrases suffisent.' }))
      expect(textbox()).toHaveAccessibleDescription('Quelques phrases suffisent.')

      rerender(
        fieldWith({
          hint: 'Quelques phrases suffisent.',
          error: 'Écris au moins une phrase.',
        }),
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
    it('swallows the formats it has no tool for: code does not apply', async () => {
      renderEditor()
      const editor = editorOf(textbox())
      await write(editor, 'sous')

      let handled = false
      await act(async () => {
        editor.update(() => {
          $getRoot().select()
        })
        handled = editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
        await Promise.resolve()
      })

      expect(handled).toBe(true)
      expect(
        editor.read(() =>
          $getRoot()
            .getAllTextNodes()
            .some((node) => $isTextNode(node) && node.hasFormat('code')),
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

  describe('while it is locked', () => {
    it('cannot be written in, and can again once unlocked', () => {
      const { rerender } = render(fieldWith({ locked: true }))
      expect(textbox()).toHaveAttribute('contenteditable', 'false')

      rerender(fieldWith({ locked: false }))

      expect(textbox()).toHaveAttribute('contenteditable', 'true')
    })
  })

  describe('as the cook’s tip', () => {
    const tip = () => screen.getByRole('textbox', { name: /^le petit conseil/ })

    function renderTip() {
      return renderEditor({ variant: 'advice', label: 'le petit conseil' })
    }

    it('is a field like the others, labelled by its handwritten title', () => {
      renderTip()

      expect(tip()).toHaveAttribute('aria-multiline', 'true')
      expect(screen.getByText('le petit conseil')).toBeVisible()
    })

    it('keeps its tools inside its frame from a tablet', () => {
      renderTip()

      expect(screen.getByRole('toolbar')).toBeVisible()
    })

    it('has no tools in its frame on a phone: they come with the writing mode', async () => {
      installMatchMedia(390)
      const user = userEvent.setup()
      renderTip()
      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()

      await user.click(tip())

      expect(within(screen.getByRole('dialog')).getByRole('toolbar')).toBeVisible()
    })

    it('has no accessibility violation', async () => {
      const { container } = renderTip()

      await expectNoAccessibilityViolations(container)
    })
  })

  describe('the new marks', () => {
    it.each([
      ['Souligné', '<p><u>texte</u></p>'],
      ['Barré', '<p><s>texte</s></p>'],
    ])('writes with « %s » on, and says it is on', async (name, html) => {
      const user = userEvent.setup()
      const { onChange } = renderEditor()
      const editor = editorOf(textbox())
      await placeCaretAtEnd(editor)

      await user.click(tool(name))
      expect(tool(name)).toHaveAttribute('aria-pressed', 'true')
      await write(editor, 'texte')

      expect(lastHtml(onChange)).toBe(html)
    })

    it('marks the selected words when the underline command comes in, as Ctrl + U sends it', async () => {
      const { onChange } = renderEditor({ initialHtml: '<p>un mot</p>' })
      const editor = editorOf(textbox())

      await act(async () => {
        editor.update(
          () => {
            const text = $getRoot().getFirstDescendant()
            if ($isTextNode(text)) text.select(0, text.getTextContentSize())
          },
          { discrete: true },
        )
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
        await Promise.resolve()
      })

      expect(lastHtml(onChange)).toBe('<p><u>un mot</u></p>')
    })
  })

  describe('the size', () => {
    const sizeButton = (current = 'Normal') =>
      screen.getByRole('button', { name: `Taille du texte : ${current}` })

    it('offers Petit, Normal and Grand for an introduction, each with the size of the page’s text', async () => {
      const user = userEvent.setup()
      renderEditor()

      await user.click(sizeButton())

      const list = screen.getByRole('menu')
      const items = within(list).getAllByRole('menuitemradio')
      expect(items.map((item) => item.textContent)).toEqual([
        'Petit16 / 22',
        'Normal18 / 28',
        'Grand22 / 34',
      ])
      expect(items[1]).toHaveAttribute('aria-checked', 'true')
    })

    it('offers only Petit and Normal for a step', async () => {
      const user = userEvent.setup()
      renderEditor({ variant: 'step', label: 'Texte de l’étape' })

      await user.click(sizeButton())

      const items = within(screen.getByRole('menu')).getAllByRole('menuitemradio')
      expect(items.map((item) => item.textContent)).toEqual(['Petit18 / 28', 'Normal22 / 34'])
    })

    it.each([
      ['Petit', '<p><small>texte</small></p>'],
      ['Grand', '<p><big>texte</big></p>'],
    ])('writes %s, and says so on the button', async (name, html) => {
      const user = userEvent.setup()
      const { onChange } = renderEditor()
      const editor = editorOf(textbox())
      await placeCaretAtEnd(editor)

      await user.click(sizeButton())
      await user.click(screen.getByRole('menuitemradio', { name: new RegExp(`^${name}`) }))
      await write(editor, 'texte')

      expect(lastHtml(onChange)).toBe(html)
      expect(sizeButton(name)).toBeVisible()
    })

    it('gives the focus back to the text once a size is chosen', async () => {
      const user = userEvent.setup()
      renderEditor()
      // jsdom has no real focus for a contenteditable: what counts is that the editor is asked to take it.
      const focus = vi.spyOn(editorOf(textbox()), 'focus')
      await user.click(sizeButton())

      await user.click(screen.getByRole('menuitemradio', { name: /^Petit/ }))

      await waitFor(() => {
        expect(focus).toHaveBeenCalled()
      })
    })
  })

  describe('the writing mode on a tablet and a desktop', () => {
    const open = () => screen.getByRole('button', { name: 'Écrire en plein écran' })
    const dialog = () => screen.getByRole('dialog', { name: 'Introduction' })

    it('is opened by « Plein écran », and shows the same text, in a dialog', async () => {
      const user = userEvent.setup()
      renderEditor({ initialHtml: '<p>La tarte du dimanche.</p>' })

      await user.click(open())

      expect(within(dialog()).getByRole('textbox', { name: /^Introduction/ })).toHaveTextContent(
        'La tarte du dimanche.',
      )
      expect(
        within(dialog()).getByRole('toolbar', { name: 'Mise en forme du texte' }),
      ).toBeVisible()
      expect(within(dialog()).getByRole('button', { name: 'Terminé' })).toBeVisible()
    })

    it('has « Terminé » to leave by, and no back arrow: that one is a phone’s', async () => {
      const user = userEvent.setup()
      renderEditor()

      await user.click(open())

      expect(
        within(dialog()).queryByRole('button', { name: 'Fermer le mode écriture' }),
      ).not.toBeInTheDocument()
    })

    it('puts the tools under the strip, above the text', async () => {
      const user = userEvent.setup()
      renderEditor()

      await user.click(open())

      const mode = within(dialog())
      const order = mode.getByRole('toolbar').compareDocumentPosition(mode.getByRole('textbox'))
      expect(order & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })

    it.each([
      ['Ctrl', '{Control>}{Shift>}f{/Shift}{/Control}'],
      ['Cmd', '{Meta>}{Shift>}f{/Shift}{/Meta}'],
    ])('is opened by %s + Maj + F while the text has the focus', async (_key, keys) => {
      const user = userEvent.setup()
      renderEditor()
      textbox().focus()

      await user.keyboard(keys)

      expect(dialog()).toBeVisible()
    })

    it('keeps what is written in it, and shows it in the field once it is closed with « Terminé »', async () => {
      const user = userEvent.setup()
      const { onChange } = renderEditor({ initialHtml: '<p>Avant.</p>' })
      await user.click(open())
      await write(editorOf(within(dialog()).getByRole('textbox')), ' Après.')

      await user.click(within(dialog()).getByRole('button', { name: 'Terminé' }))

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
      await waitFor(() => {
        expect(textbox()).toHaveTextContent('Avant. Après.')
      })
      expect(lastHtml(onChange)).toBe('<p>Avant. Après.</p>')
    })

    it('is closed by Escape, and the text is kept', async () => {
      const user = userEvent.setup()
      renderEditor({ initialHtml: '<p>Garde-moi.</p>' })
      await user.click(open())

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
      await waitFor(() => {
        expect(textbox()).toHaveTextContent('Garde-moi.')
      })
    })

    it('is closed by a click on the dimmed part, and the text is kept', async () => {
      const user = userEvent.setup()
      renderEditor({ initialHtml: '<p>Garde-moi.</p>' })
      await user.click(open())
      const backdrop = dialog().previousElementSibling
      if (!(backdrop instanceof HTMLElement)) throw new Error('No dimmed part behind the dialog')

      await user.click(backdrop)

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
      await waitFor(() => {
        expect(textbox()).toHaveTextContent('Garde-moi.')
      })
    })

    it('puts the caret back in the text, and does not say anything was updated', async () => {
      const user = userEvent.setup()
      const onWritingDone = vi.fn()
      renderEditor({ onWritingDone })
      const focus = vi.spyOn(editorOf(textbox()), 'focus')
      await user.click(open())
      focus.mockClear()

      await user.click(within(dialog()).getByRole('button', { name: 'Terminé' }))

      await waitFor(() => {
        expect(focus).toHaveBeenCalled()
      })
      expect(onWritingDone).not.toHaveBeenCalled()
    })

    it('puts the caret in the text of the mode once it is there, not in the page it left', async () => {
      const user = userEvent.setup()
      renderEditor()
      const roots = recordFocusRoots(editorOf(textbox()))

      await user.click(open())

      await waitFor(() => {
        expect(roots.some(inDialog)).toBe(true)
      })
    })

    it('lets the size be chosen from inside the mode, and gives the text the focus back', async () => {
      const user = userEvent.setup()
      const { onChange } = renderEditor()
      await user.click(open())
      const text = editorOf(within(dialog()).getByRole('textbox'))
      await placeCaretAtEnd(text)
      const roots = recordFocusRoots(text)

      await user.click(within(dialog()).getByRole('button', { name: 'Taille du texte : Normal' }))
      await user.click(screen.getByRole('menuitemradio', { name: /^Grand/ }))
      await write(text, 'texte')

      expect(lastHtml(onChange)).toBe('<p><big>texte</big></p>')
      await waitFor(() => {
        expect(roots.some(inDialog)).toBe(true)
      })
      expect(dialog()).toBeVisible()
    })

    it('has no « Plein écran » while the field is locked', () => {
      renderEditor({ locked: true })

      expect(
        screen.queryByRole('button', { name: 'Écrire en plein écran' }),
      ).not.toBeInTheDocument()
    })

    it('has no accessibility violation while it is open', async () => {
      const user = userEvent.setup()
      renderEditor({ initialHtml: '<p>Texte.</p>' })
      await user.click(open())

      await expectNoAccessibilityViolations(document.body)
    })
  })

  describe('the writing mode on a phone', () => {
    beforeEach(() => {
      installMatchMedia(390)
    })

    const dialog = () => screen.getByRole('dialog', { name: 'Introduction' })

    it('has no tools and no « Plein écran » in the field itself', () => {
      renderEditor()

      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Écrire en plein écran' }),
      ).not.toBeInTheDocument()
    })

    it('is opened by a tap on the text, with the arrow, « Terminé » and the tools', async () => {
      const user = userEvent.setup()
      renderEditor({ initialHtml: '<p>Un texte.</p>' })

      await user.click(textbox())

      const mode = within(dialog())
      expect(mode.getByRole('button', { name: 'Fermer le mode écriture' })).toBeVisible()
      expect(mode.getByRole('button', { name: 'Terminé' })).toBeVisible()
      expect(mode.getByRole('toolbar', { name: 'Mise en forme du texte' })).toBeVisible()
      expect(mode.getByRole('textbox')).toHaveTextContent('Un texte.')
    })

    it('puts the tools at the bottom, under the text, where the keyboard leaves room', async () => {
      const user = userEvent.setup()
      renderEditor()

      await user.click(textbox())

      const mode = within(dialog())
      const order = mode.getByRole('toolbar').compareDocumentPosition(mode.getByRole('textbox'))
      expect(order & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy()
    })

    it('puts the caret in the text of the mode once it is there', async () => {
      const user = userEvent.setup()
      renderEditor()
      const roots = recordFocusRoots(editorOf(textbox()))

      await user.click(textbox())

      await waitFor(() => {
        expect(roots.some(inDialog)).toBe(true)
      })
    })

    it('is not opened by a tap when the field is locked', async () => {
      const user = userEvent.setup()
      renderEditor({ locked: true })

      await user.click(textbox())

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it.each(['Terminé', 'Fermer le mode écriture'])(
      'is closed by « %s », which keeps the text and says the field was updated',
      async (name) => {
        const user = userEvent.setup()
        const onWritingDone = vi.fn()
        const { onChange } = renderEditor({ initialHtml: '<p>Avant.</p>', onWritingDone })
        await user.click(textbox())
        const inMode = editorOf(within(dialog()).getByRole('textbox'))
        await placeCaretAtEnd(inMode)
        await write(inMode, ' Après.')

        await user.click(within(dialog()).getByRole('button', { name }))

        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        })
        await waitFor(() => {
          expect(textbox()).toHaveTextContent('Avant. Après.')
        })
        expect(lastHtml(onChange)).toBe('<p>Avant. Après.</p>')
        expect(onWritingDone).toHaveBeenCalledOnce()
      },
    )

    it('is closed by Escape too', async () => {
      const user = userEvent.setup()
      const onWritingDone = vi.fn()
      renderEditor({ onWritingDone })
      await user.click(textbox())

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
      expect(onWritingDone).toHaveBeenCalledOnce()
    })

    it('adds a history entry while it is open, so that the back gesture closes it and nothing else', async () => {
      const user = userEvent.setup()
      const onWritingDone = vi.fn()
      const { router } = renderEditor({ initialHtml: '<p>Garde-moi.</p>', onWritingDone })
      const before = router.state.location.key
      await user.click(textbox())
      await waitFor(() => {
        expect(router.state.location.key).not.toBe(before)
      })
      expect(router.state.location.pathname).toBe('/')

      await act(() => router.navigate(-1))

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
      expect(router.state.location.key).toBe(before)
      await waitFor(() => {
        expect(textbox()).toHaveTextContent('Garde-moi.')
      })
      expect(onWritingDone).toHaveBeenCalledOnce()
    })

    it('takes its history entry away again when it is closed another way', async () => {
      const user = userEvent.setup()
      const { router } = renderEditor()
      const before = router.state.location.key
      await user.click(textbox())

      await user.click(within(dialog()).getByRole('button', { name: 'Terminé' }))

      await waitFor(() => {
        expect(router.state.location.key).toBe(before)
      })
    })

    it('has no accessibility violation while it is open', async () => {
      const user = userEvent.setup()
      renderEditor({ initialHtml: '<p>Texte.</p>' })
      await user.click(textbox())

      await expectNoAccessibilityViolations(document.body)
    })
  })
})
