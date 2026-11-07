import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { Button } from '../../../../components/Button/Button'
import { FieldMessage } from '../../../../components/TextField/fieldParts'
import { useToasts } from '../../../../app/useToasts'
import { emptyLine, type EditorValues, type LineValue } from '../../editorModel'
import { messageOf } from '../../fieldError'
import { strings } from '../../strings'
import { useFocusNewItem } from '../../useFocusNewItem'
import { useFollowedMove } from '../../useFollowedMove'
import { useReorder } from '../../useReorder'
import { IngredientLine } from '../IngredientLine/IngredientLine'
import { Item, ItemList } from '../ItemList/ItemList'
import { GroupHeader } from './GroupHeader'

const { ingredients } = strings

export interface IngredientGroupProps {
  /** Where the group is in the recipe, from 0. */
  index: number
  total: number
  onMoveGroup: (direction: -1 | 1) => void
  onRemoveGroup: () => void
}

/**
 * One group of ingredients (« Pour la pâte »): its title and the buttons of the group, its lines
 * that can be moved within it (never from one group to another: an ingredient belongs to its
 * group), and the button that adds a line. A line removed can be taken back.
 */
export function IngredientGroup({
  index,
  total,
  onMoveGroup,
  onRemoveGroup,
}: IngredientGroupProps) {
  const { control, getValues, getFieldState, formState } = useFormContext<EditorValues>()
  const toasts = useToasts()
  const { fields, append, insert, remove, move } = useFieldArray({
    control,
    name: `groups.${index}.lines`,
  })
  const title = useWatch({ control, name: `groups.${index}.title` })
  const { ref, follow } = useFollowedMove(fields)
  const focusNewLine = useFocusNewItem(ref, fields, '[role="combobox"]')
  const { moveItem, announcement } = useReorder({
    count: fields.length,
    move,
    announce: ingredients.lineMoved,
  })

  // A group whose last line was removed: it says it needs one, where the line was.
  const emptied =
    fields.length === 0
      ? messageOf(getFieldState(`groups.${index}.lines`, formState).error)
      : undefined

  function addLine(): void {
    focusNewLine()
    append(emptyLine())
  }

  function removeLine(lineIndex: number): void {
    const removed: LineValue = getValues(`groups.${index}.lines.${lineIndex}`)
    remove(lineIndex)
    toasts.success(ingredients.removed, {
      label: ingredients.undo,
      run: () => {
        insert(Math.min(lineIndex, getValues(`groups.${index}.lines`).length), removed)
      },
    })
  }

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ingredients.groupOf(title)}
      className="flex flex-col gap-3.5"
    >
      <GroupHeader
        index={index}
        total={total}
        lineCount={fields.length}
        onMove={onMoveGroup}
        onRemove={onRemoveGroup}
      />
      <ItemList layout="stack">
        {fields.map((field, lineIndex) => (
          <Item key={field.id} id={field.id}>
            <IngredientLine
              groupIndex={index}
              index={lineIndex}
              total={fields.length}
              onRemove={() => {
                removeLine(lineIndex)
              }}
              onMove={(direction) => {
                follow(field.id, direction === -1 ? 'back' : 'forward')
                moveItem(lineIndex, lineIndex + direction)
              }}
            />
          </Item>
        ))}
      </ItemList>
      {emptied !== undefined && (
        <FieldMessage
          id={`group-${index}-lines-error`}
          status="error"
          message={emptied}
          counter={undefined}
          counterLabel={strings.counter}
        />
      )}
      <Button variant="secondary" size="medium" icon="plus" fullWidth onClick={addLine}>
        {ingredients.addLine}
      </Button>
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </div>
  )
}
