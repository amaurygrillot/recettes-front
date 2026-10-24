import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer'
import { useEffect, useId, useRef, useState } from 'react'
import { TABLET_QUERY } from '../../lib/breakpoints'
import { classNames } from '../../lib/classNames'
import { useKeyboardInset } from '../../lib/useKeyboardInset'
import { useMediaQuery } from '../../lib/useMediaQuery'
import { Icon } from '../Icon/Icon'
import { $toHtml } from './htmlConversion'
import { createRichTextExtension } from './richTextExtension'
import { Toolbar } from './Toolbar'
import { useToolbarState } from './useToolbarState'

/**
 * Where the text goes, which sets its size (the one the page shows it in) and the height the field
 * starts with: an introduction (18/28, 144 px), a step (22/34, 160 px), a tip (18/28, 112 px).
 */
export type RichTextVariant = 'introduction' | 'step' | 'advice'

const VARIANTS: Record<RichTextVariant, string> = {
  introduction: 'min-h-36 text-body',
  step: 'min-h-40 text-step',
  advice: 'min-h-28 text-body',
}

export interface RichTextEditorProps {
  variant: RichTextVariant
  /** Always visible, above the field: « Introduction », « Texte de l'étape ». */
  label: string
  /** Said next to the label (« facultatif »). */
  note?: string | undefined
  /** An example of what to write, shown while the field is empty: never a label. */
  placeholder: string
  /** The stored HTML to start from. After that the editor keeps the text: give it a new `key` to replace it. */
  initialHtml: string
  /** The HTML to store each time the text changes: `''` when nothing is written. */
  onChange: (html: string) => void
  /** Help under the field while there is no error. */
  hint?: string | undefined
  /** Replaces the hint and puts the field in its brick frame. */
  error?: string | undefined
}

const FRAMES = {
  idle: 'border-2 border-ink-500 bg-paper-50 focus-within:border-ink-900 focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-ink-900',
  error: 'border-3 border-brick bg-brick-wash',
}

/**
 * A rich text field with a minimal toolbar (bold, italic, two lists, undo, redo), drawn once and
 * used for the introduction, the steps and the tip. The toolbar sits at the top of the field; on a
 * phone, while the text has the focus, it moves to the bar just above the keyboard.
 */
export function RichTextEditor(props: RichTextEditorProps) {
  // One editor for as long as this field lives: it must not be built again when the page re-renders.
  const [extension] = useState(() => createRichTextExtension(props.initialHtml))

  return (
    <LexicalExtensionComposer extension={extension} contentEditable={null}>
      <Field {...props} />
    </LexicalExtensionComposer>
  )
}

function Field({ variant, label, note, placeholder, onChange, hint, error }: RichTextEditorProps) {
  const [editor] = useLexicalComposerContext()
  const toolbar = useToolbarState()
  const labelId = useId()
  const messageId = useId()
  const frame = useRef<HTMLDivElement>(null)
  const [focused, setFocused] = useState(false)
  const tabletOrMore = useMediaQuery(TABLET_QUERY)
  const docked = !tabletOrMore && focused
  const keyboardInset = useKeyboardInset(docked)

  // The latest listener, without registering the editor again each time the page re-renders.
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  })
  useEffect(() => {
    // `read` first commits the initial text: only what the person changes from here on is reported.
    let lastHtml = editor.read($toHtml)
    return editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return
      const html = editorState.read($toHtml)
      if (html === lastHtml) return
      lastHtml = html
      onChangeRef.current(html)
    })
  }, [editor])

  // Whether the focus is anywhere in the field, tools included: moving from the text to a tool is still in it.
  useEffect(() => {
    const element = frame.current
    if (element === null) return undefined
    const enter = () => {
      setFocused(true)
    }
    const leave = (event: FocusEvent) => {
      if (!(event.relatedTarget instanceof Node) || !element.contains(event.relatedTarget)) {
        setFocused(false)
      }
    }
    element.addEventListener('focusin', enter)
    element.addEventListener('focusout', leave)
    return () => {
      element.removeEventListener('focusin', enter)
      element.removeEventListener('focusout', leave)
    }
  }, [])

  const message = error ?? hint

  return (
    <div className="flex flex-col gap-1.5">
      <div id={labelId} className="text-body font-bold">
        {label}
        {note && (
          <>
            {' '}
            <span className="ml-1 text-detail font-normal text-ink-700">{note}</span>
          </>
        )}
      </div>
      <div
        ref={frame}
        className={classNames('overflow-hidden rounded-m', error ? FRAMES.error : FRAMES.idle)}
      >
        {/* The tools keep their place in the field even when they sit above the keyboard: the text does not jump. */}
        <div className="min-h-15 border-b-2 border-paper-300 bg-paper-100">
          <Toolbar
            editor={editor}
            state={toolbar}
            {...(docked ? { dockedAbove: keyboardInset } : {})}
          />
        </div>
        <div className="relative">
          <ContentEditable
            aria-labelledby={labelId}
            aria-multiline
            aria-invalid={error ? true : undefined}
            aria-describedby={message ? messageId : undefined}
            aria-placeholder={placeholder}
            placeholder={
              <div
                aria-hidden="true"
                className={classNames(
                  'pointer-events-none absolute top-0 left-0 px-4 py-3.5 text-ink-700',
                  VARIANTS[variant],
                )}
              >
                {placeholder}
              </div>
            }
            className={classNames(
              'rich-text px-4 py-3.5 text-ink-900 outline-none',
              VARIANTS[variant],
            )}
          />
        </div>
      </div>
      {message && (
        <p
          id={messageId}
          className={classNames(
            'flex items-start gap-2 text-detail',
            error ? 'font-bold text-brick' : 'text-ink-700',
          )}
        >
          {error && <Icon name="alert" size={22} strokeWidth={2.4} />}
          {message}
        </p>
      )}
    </div>
  )
}
