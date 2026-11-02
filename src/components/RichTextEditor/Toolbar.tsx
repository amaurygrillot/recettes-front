import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'
import { FORMAT_TEXT_COMMAND, REDO_COMMAND, UNDO_COMMAND, type LexicalEditor } from 'lexical'
import { useRef } from 'react'
import { classNames } from '../../lib/classNames'
import { useCanScrollMore } from '../../lib/useCanScrollMore'
import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/iconShapes'
import { SizeMenu } from './SizeMenu'
import { strings } from './strings'
import type { TextBase } from './textSizes'
import type { ToolbarState } from './useToolbarState'

/** Unavailable: dashed, like every disabled control. On: yellow. Off: paper. */
function toolLook(disabled: boolean, pressed: boolean | undefined): string {
  if (disabled) {
    return 'cursor-not-allowed border-dashed border-disabled-border bg-disabled-bg text-disabled-text'
  }
  if (pressed) return 'border-ink-900 bg-butter-300 text-ink-900'
  return 'border-ink-900 bg-paper-50 text-ink-900 hover:bg-butter-100 active:bg-butter-200'
}

interface ToolButtonProps {
  label: string
  icon: IconName
  /** Set for a tool that is on or off (`aria-pressed`); absent for an action. */
  pressed?: boolean
  disabled?: boolean
  onPress: () => void
}

function ToolButton({ label, icon, pressed, disabled = false, onPress }: ToolButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onPress}
      className={classNames(
        'grid size-11 shrink-0 cursor-pointer place-items-center rounded-m border-2 p-0 focus-visible:outline-offset-2',
        toolLook(disabled, pressed),
      )}
    >
      <Icon name={icon} size={24} strokeWidth={2.4} />
    </button>
  )
}

const SEPARATOR = <span aria-hidden="true" className="h-7 w-0.5 shrink-0 rounded-s bg-paper-300" />

/** Where the bar sits decides the colour it fades into at its edge: the cream of a field's top, or the white of the writing mode. */
const SURFACES = {
  field: { bar: 'bg-paper-100', fade: 'to-paper-100', inset: 'px-2.5' },
  // The board's bar starts 16 px from the edge on a phone, 32 px from a tablet.
  writing: { bar: 'bg-paper-50', fade: 'to-paper-50', inset: 'px-4 tablet:px-8' },
} as const

export interface ToolbarProps {
  editor: LexicalEditor
  state: ToolbarState
  /** The size of the field's own text: it decides which sizes are offered. */
  base: TextBase
  surface: keyof typeof SURFACES
}

/**
 * The tools in one line that scrolls sideways, in the order of use: the size, the marks (bold, italic, underline,
 * strikethrough), the two lists, undo and redo. A fade and a « › » at the right edge say there is more, until the end
 * of the line. A button says whether its tool is on at the caret (`aria-pressed`); undo and redo are dashed when there
 * is nothing to undo or redo. Pressing one never takes the focus out of the text.
 */
export function Toolbar({ editor, state, base, surface }: ToolbarProps) {
  const row = useRef<HTMLDivElement>(null)
  const more = useCanScrollMore(row, base, 'horizontal')
  const look = SURFACES[surface]

  function toggleList(on: boolean, command: typeof INSERT_UNORDERED_LIST_COMMAND): void {
    editor.dispatchCommand(on ? REMOVE_LIST_COMMAND : command, undefined)
  }

  return (
    <div className={classNames('relative', look.bar)}>
      <div
        ref={row}
        role="toolbar"
        aria-label={strings.toolbar}
        // A tap on a tool must not blur the text: the caret, and on a phone the keyboard, stay.
        onMouseDown={(event) => {
          event.preventDefault()
        }}
        className={classNames(
          'scrollbar-hidden flex items-center gap-3.5 overflow-x-auto py-2',
          look.inset,
        )}
      >
        <SizeMenu editor={editor} base={base} size={state.size} />
        {SEPARATOR}
        <div className="flex shrink-0 gap-1.5">
          <ToolButton
            label={strings.bold}
            icon="bold"
            pressed={state.bold}
            onPress={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          />
          <ToolButton
            label={strings.italic}
            icon="italic"
            pressed={state.italic}
            onPress={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          />
          <ToolButton
            label={strings.underline}
            icon="underline"
            pressed={state.underline}
            onPress={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
          />
          <ToolButton
            label={strings.strikethrough}
            icon="strike"
            pressed={state.strikethrough}
            onPress={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
          />
        </div>
        {SEPARATOR}
        <div className="flex shrink-0 gap-1.5">
          <ToolButton
            label={strings.bulletList}
            icon="list-bullet"
            pressed={state.bulletList}
            onPress={() => {
              toggleList(state.bulletList, INSERT_UNORDERED_LIST_COMMAND)
            }}
          />
          <ToolButton
            label={strings.numberList}
            icon="list-number"
            pressed={state.numberList}
            onPress={() => {
              toggleList(state.numberList, INSERT_ORDERED_LIST_COMMAND)
            }}
          />
        </div>
        {SEPARATOR}
        <div className="flex shrink-0 gap-1.5">
          <ToolButton
            label={strings.undo}
            icon="undo"
            disabled={!state.canUndo}
            onPress={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          />
          <ToolButton
            label={strings.redo}
            icon="redo"
            disabled={!state.canRedo}
            onPress={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          />
        </div>
      </div>
      {more && (
        <div
          aria-hidden="true"
          className={classNames(
            'pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-end bg-linear-to-r from-transparent pr-1.5 text-ink-900',
            look.fade,
          )}
        >
          <Icon name="chevron-right" size={22} strokeWidth={2.6} />
        </div>
      )}
    </div>
  )
}
