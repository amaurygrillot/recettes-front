import { useId, type ComponentProps } from 'react'
import { classNames } from '../../lib/classNames'
import { FieldLabel, FieldMessage } from '../TextField/fieldParts'
import {
  describeField,
  FIELD_BORDERS,
  type FieldCounter,
  type FieldMessages,
} from '../TextField/fieldStatus'
import { strings } from '../TextField/strings'

export type TextAreaProps = Omit<
  ComponentProps<'textarea'>,
  'className' | 'id' | 'aria-invalid' | 'aria-describedby'
> &
  FieldMessages & {
    /** Always visible, above the field: a placeholder is never a label. */
    label: string
    /** Said next to the label (« facultatif »). */
    note?: string | undefined
    /** The characters typed out of the limit: shown under the field once it gets near. */
    counter?: FieldCounter | undefined
  }

/**
 * A text field of several lines (the title of a recipe, which may run long), with the same label,
 * messages and frames as `TextField`. It starts 92 px high and can be pulled taller.
 */
export function TextArea({
  label,
  note,
  hint,
  hintMet,
  error,
  invalid,
  success,
  counter,
  ...rest
}: TextAreaProps) {
  const id = useId()
  const messageId = `${id}-message`
  const { status, message } = describeField({ error, invalid, success, hint, hintMet })

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor={id} label={label} note={note} />
      <textarea
        id={id}
        aria-invalid={status === 'error' ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={classNames(
          'block min-h-23 w-full resize-y rounded-m px-4 py-3.5 text-label leading-7 text-ink-900 placeholder:text-ink-700',
          'disabled-look',
          FIELD_BORDERS[status],
        )}
        {...rest}
      />
      <FieldMessage
        id={messageId}
        status={status}
        message={message}
        counter={counter}
        counterLabel={strings.counter}
      />
    </div>
  )
}
