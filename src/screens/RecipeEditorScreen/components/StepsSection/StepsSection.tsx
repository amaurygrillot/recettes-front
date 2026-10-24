import { useFieldArray, useFormContext } from 'react-hook-form'
import { useToasts } from '../../../../app/useToasts'
import { Button } from '../../../../components/Button/Button'
import { Icon } from '../../../../components/Icon/Icon'
import { FieldMessage } from '../../../../components/TextField/fieldParts'
import { plainText } from '../../../../lib/plainText'
import { emptyStep, type EditorValues, type StepValue } from '../../editorModel'
import { messageOf } from '../../fieldError'
import { strings } from '../../strings'
import { useFocusNewItem } from '../../useFocusNewItem'
import { useFollowedMove } from '../../useFollowedMove'
import { useReorder } from '../../useReorder'
import { EditorSection } from '../EditorSection/EditorSection'
import { NumberBadge } from '../NumberBadge/NumberBadge'
import { SortableItem, SortableList, type ReorderWords } from '../SortableList/SortableList'
import { StepCard } from '../StepCard/StepCard'

const { steps } = strings

const WORDS: ReorderWords = {
  lifted: steps.lifted,
  moved: steps.moved,
  dropped: steps.dropped,
  cancelled: strings.photos.dragCancelled,
  instructions: steps.dragInstructions,
  grip: steps.gripRole,
}

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
        <SortableList
          layout="stack"
          ids={fields.map(({ id }) => id)}
          words={WORDS}
          onReorder={moveItem}
          renderLifted={(id) => {
            const index = fields.findIndex((field) => field.id === id)
            return (
              <div className="flex min-h-21 items-center gap-1.5 rounded-l border-2 border-ink-900 bg-butter-100 py-2 pr-2 pl-1 shadow-sheet">
                <span className="grid size-14 shrink-0 place-items-center">
                  <Icon name="grip" size={24} />
                </span>
                <NumberBadge number={index + 1} lifted />
                <p className="min-w-0 flex-1 truncate px-2 text-body">
                  {plainText(getValues(`steps.${index}.html`))}
                </p>
              </div>
            )
          }}
        >
          {fields.map((field, index) => (
            <SortableItem
              key={field.id}
              id={field.id}
              grip={steps.gripRole}
              dropHere={strings.photos.dropHere}
            >
              {({ handle }) => (
                <StepCard
                  index={index}
                  total={fields.length}
                  handle={handle}
                  onMove={(direction) => {
                    follow(field.id, direction === -1 ? 'back' : 'forward')
                    moveItem(index, index + direction)
                  }}
                  onRemove={() => {
                    removeStep(index)
                  }}
                />
              )}
            </SortableItem>
          ))}
        </SortableList>
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
