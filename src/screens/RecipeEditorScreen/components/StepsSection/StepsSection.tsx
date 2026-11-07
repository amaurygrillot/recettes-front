import { useFieldArray, useFormContext } from 'react-hook-form'
import { useToasts } from '../../../../app/useToasts'
import { Button } from '../../../../components/Button/Button'
import { FieldMessage } from '../../../../components/TextField/fieldParts'
import { emptyStep, type EditorValues, type StepValue } from '../../editorModel'
import { messageOf } from '../../fieldError'
import { strings } from '../../strings'
import { useFocusNewItem } from '../../useFocusNewItem'
import { useFollowedMove } from '../../useFollowedMove'
import { useReorder } from '../../useReorder'
import { EditorSection } from '../EditorSection/EditorSection'
import { Item, ItemList } from '../ItemList/ItemList'
import { StepCard } from '../StepCard/StepCard'

const { steps } = strings

/** Section 4: the steps, in order. At least one is needed, and each needs its text. */
export function StepsSection() {
  const { control, getValues, formState } = useFormContext<EditorValues>()
  const toasts = useToasts()
  const { fields, append, insert, remove, move } = useFieldArray({ control, name: 'steps' })
  const { ref, follow } = useFollowedMove(fields)
  const focusNewStep = useFocusNewItem(ref, fields, '[role="textbox"]')
  const { moveItem, announcement } = useReorder({
    count: fields.length,
    move,
    announce: steps.moved,
  })

  const error = messageOf(formState.errors.steps)
  const empty = fields.length === 0

  function addStep(): void {
    focusNewStep()
    append(emptyStep())
  }

  function removeStep(index: number): void {
    const removed: StepValue = getValues(`steps.${index}`)
    remove(index)
    toasts.success(steps.removed, {
      label: steps.undo,
      run: () => {
        insert(Math.min(index, getValues('steps').length), removed)
      },
    })
  }

  return (
    <EditorSection
      id="steps"
      number={4}
      title={strings.sections.steps}
      invalid={empty && error !== undefined}
    >
      <div ref={ref} className="flex flex-col gap-4.5">
        <ItemList layout="stack">
          {fields.map((field, index) => (
            <Item key={field.id} id={field.id}>
              <StepCard
                index={index}
                total={fields.length}
                onMove={(direction) => {
                  follow(field.id, direction === -1 ? 'back' : 'forward')
                  moveItem(index, index + direction)
                }}
                onRemove={() => {
                  removeStep(index)
                }}
              />
            </Item>
          ))}
        </ItemList>
        {empty && error !== undefined && (
          <FieldMessage
            id="steps-error"
            status="error"
            message={error}
            counter={undefined}
            counterLabel={strings.counter}
          />
        )}
        <Button variant="secondary" icon="plus" fullWidth onClick={addStep}>
          {steps.add}
        </Button>
      </div>
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </EditorSection>
  )
}
