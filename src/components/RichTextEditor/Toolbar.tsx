import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'
import { FORMAT_TEXT_COMMAND, REDO_COMMAND, UNDO_COMMAND, type LexicalEditor } from 'lexical'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/iconShapes'
import { strings } from './strings'
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

export interface ToolbarProps {
  editor: LexicalEditor
  state: ToolbarState
  /**
   * Set while a phone's keyboard is up: the bar then leaves the field and sits that many pixels
   * above the bottom of the screen, just over the keyboard, on the whole width. Absent: it is the
   * top of the text field, with a rule under it.
   */
  dockedAbove?: number
}

/**
 * Six tools in three groups, and no more: bold and italic, the two lists, undo and redo. A button
 * says whether its tool is on at the caret (`aria-pressed`); undo and redo are dashed when there
 * is nothing to undo or redo. Pressing one never takes the focus out of the text.
 */
export function Toolbar({ editor, state, dockedAbove }: ToolbarProps) {
  const docked = dockedAbove !== undefined
  function toggleList(on: boolean, command: typeof INSERT_UNORDERED_LIST_COMMAND): void {
    editor.dispatchCommand(on ? REMOVE_LIST_COMMAND : command, undefined)
  }

  return (
    <div
      role="toolbar"
      aria-label={strings.toolbar}
      // A tap on a tool must not blur the text: the caret, and on a phone the keyboard, stay.
      onMouseDown={(event) => {
        event.preventDefault()
      }}
      style={docked ? { bottom: dockedAbove } : undefined}
      className={classNames(
        'flex items-center gap-3.5 bg-paper-100 px-2.5 py-2',
        docked && 'fixed inset-x-0 z-40 border-t-2 border-ink-900',
      )}
    >
      <div className="flex gap-1.5">
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
      </div>
      {SEPARATOR}
      <div className="flex gap-1.5">
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
      <div className="flex gap-1.5">
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
  )
}
