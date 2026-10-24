import { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Icon } from '../../../../components/Icon/Icon'
import { TextField } from '../../../../components/TextField/TextField'
import { classNames } from '../../../../lib/classNames'
import type { EditorValues } from '../../editorModel'
import { LIMITS } from '../../editorSchema'
import { messageOf } from '../../fieldError'
import { strings } from '../../strings'

const { ingredients } = strings

const SQUARE_BUTTON =
  'inline-grid size-12 shrink-0 cursor-pointer place-items-center rounded-m border-2 border-ink-900 bg-paper-50 enabled:active:bg-butter-200 disabled:cursor-not-allowed disabled:border-dashed disabled:border-disabled-border disabled:bg-disabled-bg disabled:text-disabled-text'

export interface GroupHeaderProps {
  index: number
  total: number
  lineCount: number
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
}

/**
 * The top of a group: its title (or « Groupe sans titre », the usual case of a recipe with a single
 * group), how many ingredients it has, and the buttons to rename it, move it up or down, or remove it.
 * Renaming turns the title into a field, and the same button, now « Valider le titre », turns it back.
 */
export function GroupHeader({ index, total, lineCount, onMove, onRemove }: GroupHeaderProps) {
  const { control, register, getFieldState, formState } = useFormContext<EditorValues>()
  const path = `groups.${index}.title` as const
  const title = useWatch({ control, name: path })
  const [renaming, setRenaming] = useState(false)
  const untitled = title.trim() === ''
  const toggleLabel = untitled ? ingredients.addTitle : ingredients.rename

  return (
    <div className="flex flex-col gap-2.5">
      {renaming ? (
        <TextField
          label={ingredients.titleField}
          note={strings.optional}
          counter={{ typed: title.length, max: LIMITS.groupTitle }}
          error={messageOf(getFieldState(path, formState).error)}
          // The field replaces the title the person asked to change: the typing starts in it.
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          {...register(path)}
        />
      ) : (
        <div className="flex flex-col gap-0.5">
          <h3
            className={classNames(
              'font-title text-title-3',
              untitled && 'font-normal text-ink-700',
            )}
          >
            {untitled ? ingredients.untitled : title}
          </h3>
          <span className="text-detail text-ink-700">{ingredients.count(lineCount)}</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setRenaming((current) => !current)
          }}
          className="inline-flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-m border-2 border-ink-900 bg-paper-50 pr-3.5 pl-2.5 text-detail font-bold enabled:active:bg-butter-200"
        >
          <Icon name={renaming ? 'check' : 'edit'} size={22} strokeWidth={2.4} />
          {renaming ? ingredients.validateTitle : toggleLabel}
        </button>
        <button
          type="button"
          aria-label={ingredients.moveGroupUp}
          disabled={index === 0}
          onClick={() => {
            onMove(-1)
          }}
          className={SQUARE_BUTTON}
          data-move="back"
        >
          <Icon name="chevron-up" size={24} strokeWidth={2.6} />
        </button>
        <button
          type="button"
          aria-label={ingredients.moveGroupDown}
          disabled={index === total - 1}
          onClick={() => {
            onMove(1)
          }}
          className={SQUARE_BUTTON}
          data-move="forward"
        >
          <Icon name="chevron-down" size={24} strokeWidth={2.6} />
        </button>
        <button
          type="button"
          aria-label={ingredients.removeGroup}
          onClick={onRemove}
          className={`${SQUARE_BUTTON} text-brick`}
        >
          <Icon name="trash" size={24} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  )
}
