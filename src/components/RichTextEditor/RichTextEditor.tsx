import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { classNames } from '../../lib/classNames'
import { useKeyboardInset } from '../../lib/useKeyboardInset'
import { useLayoutKind } from '../../lib/useLayoutKind'
import { Icon } from '../Icon/Icon'
import { RichTextView } from '../RichTextView/RichTextView'
import { EditableText } from './EditableText'
import { $toHtml } from './htmlConversion'
import { createRichTextExtension } from './richTextExtension'
import { strings } from './strings'
import { baseOf, FIELD_LOOK, type RichTextVariant } from './textSizes'
import { Toolbar } from './Toolbar'
import { useChangeReport } from './useChangeReport'
import { useToolbarState } from './useToolbarState'
import { useWritingMode } from './useWritingMode'
import { WritingMode } from './WritingMode'

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
  /** The text cannot be changed for now (a recipe being saved): it keeps its look and says nothing. */
  locked?: boolean
  /** Told when the writing mode, opened on a phone, is closed: the page can say the field was updated. */
  onWritingDone?: (() => void) | undefined
}

const FRAMES = {
  idle: 'border-2 border-ink-500 bg-paper-50 focus-within:border-ink-900 focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-ink-900',
  error: 'border-3 border-brick bg-brick-wash',
  // The recipe page's stitched frame at rest, a plain ink one with the ring while it is being written in.
  advice:
    'border-2 border-dashed border-ink-500 bg-paper-50 focus-within:border-solid focus-within:border-ink-900 focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-ink-900',
}

/**
 * A rich text field, drawn once and used for the introduction, the steps and the tip: a bar of tools (size, bold,
 * italic, underline, strikethrough, two lists, undo, redo) in one scrolling line, and a writing mode that gives the
 * text a screen of its own. On a phone the tools only come with the writing mode, which a tap on the text opens;
 * from a tablet the bar sits at the top of the field and « Plein écran » (or Ctrl + Maj + F) opens the mode.
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

function Field({
  variant,
  label,
  note,
  placeholder,
  onChange,
  hint,
  error,
  locked = false,
  onWritingDone,
}: RichTextEditorProps) {
  const [editor] = useLexicalComposerContext()
  const toolbar = useToolbarState()
  const labelId = useId()
  const messageId = useId()
  const frame = useRef<HTMLDivElement>(null)
  const layout = useLayoutKind()
  const phone = layout === 'phone'
  const advice = variant === 'advice'
  const base = baseOf(variant)

  const mode = useWritingMode({
    phone,
    onClosedOnPhone: () => {
      onWritingDone?.()
    },
  })
  const keyboardInset = useKeyboardInset(mode.writing && phone)
  // What the text says while it is being written over there: the field here shows it, dimmed behind.
  const [snapshot, setSnapshot] = useState('')

  useEffect(() => {
    editor.setEditable(!locked)
  }, [editor, locked])

  useChangeReport(editor, (html) => {
    onChange(html)
    setSnapshot(html)
  })

  // The editor is moved into the mode and back (the text takes the caret itself on its way in). Back on the page, the
  // field is scrolled into view, and with a keyboard (not a phone) the caret returns to the text.
  const wasWriting = useRef(false)
  useEffect(() => {
    if (!mode.writing && wasWriting.current) {
      frame.current?.scrollIntoView({ block: 'center' })
      if (!phone) editor.focus()
    }
    wasWriting.current = mode.writing
  }, [mode.writing, editor, phone])

  function openWriting(): void {
    setSnapshot(editor.read($toHtml))
    mode.open()
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (mode.writing) return
    if (event.shiftKey && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') {
      event.preventDefault()
      if (!locked) openWriting()
    }
  }

  const message = error ?? hint
  const text = (
    <EditableText
      variant={variant}
      labelId={labelId}
      placeholder={placeholder}
      messageId={message ? messageId : undefined}
      invalid={error !== undefined}
      fill={mode.writing}
      onTap={phone && !locked && !mode.writing ? openWriting : undefined}
      onKeyDown={onKeyDown}
    />
  )

  const labelNode = (
    <div
      id={labelId}
      className={advice ? 'font-hand text-annotation text-mustard-700' : 'text-body font-bold'}
    >
      {label}
      {note && (
        <>
          {' '}
          <span className="ml-1 font-body text-detail font-normal text-ink-700">{note}</span>
        </>
      )}
    </div>
  )

  const fullScreenButton = !phone && !locked && (
    <button
      type="button"
      aria-label={strings.writeFullScreen}
      onClick={openWriting}
      className="inline-flex h-11 flex-none cursor-pointer items-center gap-2 rounded-m border-2 border-ink-900 bg-paper-50 py-0 pr-3.5 pl-3 text-detail font-bold text-ink-900 hover:bg-butter-100 focus-visible:outline-offset-2 active:bg-butter-200"
    >
      <Icon name="expand" size={22} strokeWidth={2.4} />
      {strings.fullScreenLabel}
    </button>
  )

  // On a phone the tools come with the writing mode only.
  const toolbarNode = !phone && !mode.writing && (
    <div className={advice ? undefined : 'border-b-2 border-paper-300'}>
      <Toolbar editor={editor} state={toolbar} base={base} surface="field" />
    </div>
  )

  const body = mode.writing ? (
    <div
      className={classNames(FIELD_LOOK[variant].height, advice ? 'px-0.5 py-0.5' : 'px-4 py-3.5')}
    >
      <RichTextView html={snapshot} size={base} />
    </div>
  ) : (
    text
  )

  const labelRow = (
    <div className="flex items-center justify-between gap-3">
      {labelNode}
      {fullScreenButton}
    </div>
  )

  return (
    <div className="flex flex-col gap-1.5">
      {advice ? (
        <div
          ref={frame}
          className={classNames(
            'flex flex-col gap-1.5 rounded-frame px-3.5 pt-3.5 pb-1',
            error ? FRAMES.error : FRAMES.advice,
          )}
        >
          {labelRow}
          {toolbarNode}
          {body}
        </div>
      ) : (
        <>
          {labelRow}
          <div
            ref={frame}
            className={classNames('overflow-hidden rounded-m', error ? FRAMES.error : FRAMES.idle)}
          >
            {toolbarNode}
            {body}
          </div>
        </>
      )}
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
      <WritingMode
        open={mode.writing}
        title={label}
        note={note}
        layout={layout}
        keyboardInset={keyboardInset}
        onClose={mode.close}
        toolbar={<Toolbar editor={editor} state={toolbar} base={base} surface="writing" />}
      >
        {text}
      </WritingMode>
    </div>
  )
}
