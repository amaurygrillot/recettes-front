import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { AlertDialog } from '../../../../components/AlertDialog/AlertDialog'
import { Button } from '../../../../components/Button/Button'
import { FieldMessage } from '../../../../components/TextField/fieldParts'
import { emptyGroup, isBlankGroup, type EditorValues } from '../../editorModel'
import { messageOf } from '../../fieldError'
import { strings } from '../../strings'
import { useFocusNewItem } from '../../useFocusNewItem'
import { useFollowedMove } from '../../useFollowedMove'
import { useReorder } from '../../useReorder'
import { EditorSection } from '../EditorSection/EditorSection'
import { IngredientGroup } from '../IngredientGroup/IngredientGroup'

const { ingredients } = strings

/** Section 3: the ingredients, in one group or several, each with its lines. At least one ingredient is needed. */
export function IngredientsSection() {
  const { control, getValues, formState } = useFormContext<EditorValues>()
  const { fields, append, remove, move } = useFieldArray({ control, name: 'groups' })
  const { ref, follow } = useFollowedMove(fields)
  const focusNewGroup = useFocusNewItem(ref, fields, '[role="combobox"]')
  const { moveItem, announcement } = useReorder({
    count: fields.length,
    move,
    announce: ingredients.groupMoved,
  })
  // The group that is about to be removed, once the person was asked: a group with something in it.
  const [asking, setAsking] = useState<number | undefined>()

  const error = messageOf(formState.errors.groups)
  const empty = fields.length === 0

  function addGroup(): void {
    focusNewGroup()
    append(emptyGroup())
  }

  function removeGroup(index: number): void {
    if (isBlankGroup(getValues(`groups.${index}`))) remove(index)
    else setAsking(index)
  }

  const group = asking === undefined ? undefined : getValues(`groups.${asking}`)

  return (
    <EditorSection
      id="ingredients"
      number={3}
      title={strings.sections.ingredients}
      invalid={empty && error !== undefined}
    >
      <div ref={ref} className="flex flex-col gap-5.5">
        {empty ? (
          <div className="flex flex-col items-center gap-3 rounded-l border-2 border-dashed border-ink-500 bg-paper-50 px-4 py-4.5 text-center">
            <p className="font-title text-step font-bold">{ingredients.empty}</p>
            <Button variant="secondary" icon="plus" fullWidth onClick={addGroup}>
              {ingredients.addGroup}
            </Button>
          </div>
        ) : (
          fields.map((field, index) => (
            <div key={field.id} data-sortable={field.id}>
              <IngredientGroup
                index={index}
                total={fields.length}
                onMoveGroup={(direction) => {
                  follow(field.id, direction === -1 ? 'back' : 'forward')
                  moveItem(index, index + direction)
                }}
                onRemoveGroup={() => {
                  removeGroup(index)
                }}
              />
            </div>
          ))
        )}
        {!empty && (
          <Button variant="secondary" icon="plus" fullWidth onClick={addGroup}>
            {ingredients.addGroup}
          </Button>
        )}
        {empty && error !== undefined && (
          <FieldMessage
            id="ingredients-error"
            status="error"
            message={error}
            counter={undefined}
            counterLabel={strings.counter}
          />
        )}
      </div>
      <p role="status" className="sr-only">
        {announcement}
      </p>
      <AlertDialog
        open={group !== undefined}
        icon="trash"
        title={ingredients.removeGroupTitle}
        description={
          group === undefined ? '' : ingredients.removeGroupText(group.title, group.lines.length)
        }
      >
        <Button
          variant="secondary"
          fullWidth
          onClick={() => {
            setAsking(undefined)
          }}
        >
          {ingredients.cancel}
        </Button>
        <Button
          variant="danger"
          fullWidth
          onClick={() => {
            if (asking !== undefined) remove(asking)
            setAsking(undefined)
          }}
        >
          {ingredients.removeGroupConfirm}
        </Button>
      </AlertDialog>
    </EditorSection>
  )
}
