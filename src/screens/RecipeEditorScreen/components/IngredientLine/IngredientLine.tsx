import { useId, type ComponentProps } from 'react'
import { useController, useFormContext, useWatch } from 'react-hook-form'
import { AutocompleteField } from '../../../../components/AutocompleteField/AutocompleteField'
import { Icon } from '../../../../components/Icon/Icon'
import { SelectField } from '../../../../components/SelectField/SelectField'
import { TextField } from '../../../../components/TextField/TextField'
import { FieldMessage } from '../../../../components/TextField/fieldParts'
import type { EditorValues } from '../../editorModel'
import { LIMITS } from '../../editorSchema'
import { messageOf } from '../../fieldError'
import { useReferences } from '../../references'
import { strings } from '../../strings'
import { useIngredientChoice } from '../../useIngredientChoice'
import { IngredientNotice } from './IngredientNotice'

const { ingredients } = strings

const SMALL_BUTTON =
  'inline-grid size-11 shrink-0 cursor-pointer place-items-center rounded-m border-2 border-ink-900 bg-paper-50 enabled:active:bg-butter-200 disabled:cursor-not-allowed disabled:border-dashed disabled:border-disabled-border disabled:bg-disabled-bg disabled:text-disabled-text'

export interface IngredientLineProps {
  groupIndex: number
  /** Where the line is in its group, from 0. */
  index: number
  total: number
  /** The grip of the drag, with what the drag needs on it. */
  handle: ComponentProps<'button'>
  onRemove: () => void
  onMove: (direction: -1 | 1) => void
}

/**
 * One line of an ingredient group, compact for a phone: the ingredient (chosen from the ones that
 * exist, or created on the spot) with its grip and its bin, then the quantity, the unit and a note.
 * What is wrong is said once under the whole line, wide enough to be read. Moving it up or down
 * appears when the line is being used: the grip alone would leave out those who cannot drag.
 */
export function IngredientLine({
  groupIndex,
  index,
  total,
  handle,
  onRemove,
  onMove,
}: IngredientLineProps) {
  const { control, register, getFieldState, formState } = useFormContext<EditorValues>()
  const { units } = useReferences()
  const errorsId = useId()
  const position = index + 1
  const base = `groups.${groupIndex}.lines.${index}` as const
  const noteLength = useWatch({ control, name: `${base}.note` }).length

  const ingredient = useController({ control, name: `${base}.ingredient` })
  const choice = useIngredientChoice({
    chosen: ingredient.field.value,
    onChange: ingredient.field.onChange,
  })

  const messages = [
    messageOf(getFieldState(`${base}.ingredient`, formState).error),
    messageOf(getFieldState(`${base}.quantity`, formState).error),
    messageOf(getFieldState(`${base}.note`, formState).error),
  ]
  const ingredientInvalid = messages[0] !== undefined
  const quantityInvalid = messages[1] !== undefined
  const noteInvalid = messages[2] !== undefined

  return (
    <div
      role="group"
      aria-label={ingredients.line(position)}
      className="group/line flex flex-col gap-2.5 rounded-l border-2 border-ink-900 bg-paper-50 px-2.5 pt-2.5 pb-3"
    >
      <div className="flex items-start gap-1.5">
        <div className="mt-7.5 flex h-14 shrink-0 items-center">
          <button
            type="button"
            aria-label={ingredients.grip(position)}
            {...handle}
            className="inline-grid size-11 cursor-grab touch-none place-items-center rounded-m border-2 border-transparent text-ink-700 focus-visible:text-ink-900 active:cursor-grabbing"
          >
            <Icon name="grip" size={22} />
          </button>
        </div>
        <div className="min-w-0 flex-1">
          <AutocompleteField
            label={ingredients.ingredient}
            placeholder={ingredients.ingredientPlaceholder}
            suggestionsLabel={ingredients.suggestions}
            text={choice.text}
            onTextChange={choice.onTextChange}
            maxLength={choice.maxLength}
            suggestions={choice.suggestions}
            onChoose={choice.onChoose}
            create={choice.create}
            busyText={choice.busyText}
            disabled={choice.locked}
            invalid={ingredientInvalid}
            describedBy={ingredientInvalid ? errorsId : undefined}
          />
        </div>
        <div className="mt-7.5 flex h-14 shrink-0 items-center">
          <button
            type="button"
            aria-label={ingredients.remove(position)}
            onClick={onRemove}
            className={`${SMALL_BUTTON} text-brick`}
          >
            <Icon name="trash" size={22} strokeWidth={2.4} />
          </button>
        </div>
      </div>
      {choice.outcome !== undefined && (
        <IngredientNotice outcome={choice.outcome} onRetry={choice.retry} />
      )}
      <div className="flex items-end gap-2.5">
        <div className="w-24 shrink-0">
          <TextField
            label={ingredients.quantity}
            compact
            inputMode="decimal"
            autoComplete="off"
            invalid={quantityInvalid}
            aria-describedby={quantityInvalid ? errorsId : undefined}
            {...register(`${base}.quantity`)}
          />
        </div>
        <div className="w-28 shrink-0">
          <SelectField
            label={ingredients.unit}
            emptyLabel={ingredients.noUnit}
            options={units.map(({ id, label }) => ({ value: id, label }))}
            {...register(`${base}.unitId`)}
          />
        </div>
        <div className="min-w-0 flex-1">
          <TextField
            label={ingredients.note}
            compact
            placeholder={ingredients.notePlaceholder}
            autoComplete="off"
            invalid={noteInvalid}
            {...register(`${base}.note`)}
          />
        </div>
      </div>
      <div id={errorsId} className="flex flex-col gap-1">
        {messages.map(
          (message) =>
            message !== undefined && (
              <FieldMessage
                key={message}
                id={`${errorsId}-${message}`}
                status="error"
                message={message}
                counter={
                  message === messages[2] ? { typed: noteLength, max: LIMITS.note } : undefined
                }
                counterLabel={strings.counter}
              />
            ),
        )}
      </div>
      <div className="hidden gap-2 group-focus-within/line:flex">
        <button
          type="button"
          aria-label={ingredients.moveUp(position)}
          disabled={index === 0}
          onClick={() => {
            onMove(-1)
          }}
          className={SMALL_BUTTON}
          data-move="back"
        >
          <Icon name="chevron-up" size={22} strokeWidth={2.6} />
        </button>
        <button
          type="button"
          aria-label={ingredients.moveDown(position)}
          disabled={index === total - 1}
          onClick={() => {
            onMove(1)
          }}
          className={SMALL_BUTTON}
          data-move="forward"
        >
          <Icon name="chevron-down" size={22} strokeWidth={2.6} />
        </button>
      </div>
    </div>
  )
}
