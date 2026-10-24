import type { ComponentProps } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Icon } from '../../../../components/Icon/Icon'
import { RichTextEditor } from '../../../../components/RichTextEditor/RichTextEditor'
import { classNames } from '../../../../lib/classNames'
import type { EditorValues } from '../../editorModel'
import { messageOf } from '../../fieldError'
import { useSaving } from '../../savingContext'
import { strings } from '../../strings'
import { NumberBadge } from '../NumberBadge/NumberBadge'
import { PhotoGallery } from '../PhotoGallery/PhotoGallery'

const { steps } = strings

const SMALL_BUTTON =
  'inline-grid size-11 shrink-0 cursor-pointer place-items-center rounded-m border-2 border-ink-900 bg-paper-50 enabled:active:bg-butter-200 disabled:cursor-not-allowed disabled:border-dashed disabled:border-disabled-border disabled:bg-disabled-bg disabled:text-disabled-text'

export interface StepCardProps {
  /** Where the step is, from 0: its number is this plus one, and follows it wherever it is moved. */
  index: number
  total: number
  /** The grip of the drag, with what the drag needs on it. */
  handle: ComponentProps<'button'>
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
}

/**
 * One step of the preparation: its number (the rank, never typed), the grip and the buttons that move
 * or remove it, its rich text, and its photos, which are optional and may be several. The text is
 * required: an empty step says so in its field.
 */
export function StepCard({ index, total, handle, onMove, onRemove }: StepCardProps) {
  const { control } = useFormContext<EditorValues>()
  const saving = useSaving()
  const position = index + 1

  return (
    <article
      aria-label={steps.step(position)}
      className="flex flex-col gap-3.5 rounded-frame border-2 border-ink-900 bg-paper-50 px-3.5 pt-3 pb-3.5"
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label={steps.grip(position)}
          {...handle}
          className="inline-grid size-11 shrink-0 cursor-grab touch-none place-items-center rounded-m border-2 border-transparent text-ink-700 focus-visible:text-ink-900 active:cursor-grabbing"
        >
          <Icon name="grip" size={22} />
        </button>
        <NumberBadge number={position} />
        <h3 className="ml-0.5 min-w-0 flex-1 font-title text-[1.1875rem] leading-[1.625rem] font-bold whitespace-nowrap">
          {steps.step(position)}
        </h3>
        <button
          type="button"
          aria-label={steps.moveUp(position)}
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
          aria-label={steps.moveDown(position)}
          disabled={index === total - 1}
          onClick={() => {
            onMove(1)
          }}
          className={SMALL_BUTTON}
          data-move="forward"
        >
          <Icon name="chevron-down" size={22} strokeWidth={2.6} />
        </button>
        <button
          type="button"
          aria-label={steps.remove(position)}
          onClick={onRemove}
          className={classNames(SMALL_BUTTON, 'text-brick')}
        >
          <Icon name="trash" size={22} strokeWidth={2.4} />
        </button>
      </div>
      <Controller
        control={control}
        name={`steps.${index}.html`}
        render={({ field, fieldState }) => (
          <RichTextEditor
            variant="step"
            label={steps.textLabel}
            placeholder={steps.textPlaceholder}
            initialHtml={field.value}
            onChange={field.onChange}
            error={messageOf(fieldState.error)}
            locked={saving}
          />
        )}
      />
      <div className="flex flex-col gap-1.5">
        <p className="text-body font-bold">
          {steps.photosLabel}{' '}
          <span className="ml-1 text-detail font-normal text-ink-700">{strings.optional}</span>
        </p>
        <PhotoGallery name={`steps.${index}.photos`} variant="step" />
      </div>
    </article>
  )
}
