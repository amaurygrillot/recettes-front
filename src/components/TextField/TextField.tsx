import { useId, type ComponentProps, type ReactNode } from 'react'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import { FieldLabel, FieldMessage } from './fieldParts'
import { describeField, FIELD_BORDERS, type FieldCounter, type FieldMessages } from './fieldStatus'
import { strings } from './strings'

export type TextFieldProps = Omit<
  ComponentProps<'input'>,
  'className' | 'id' | 'aria-invalid' | 'aria-describedby'
> &
  FieldMessages & {
    /** Always visible, above the field: a placeholder is never a label. */
    label: string
    /** Said next to the label in a lighter weight (« facultatif »): a field that may stay empty says so. */
    note?: string | undefined
    /** A control inside the field, at its right end (the password's show / hide button). */
    trailing?: ReactNode
    /** The characters typed out of the limit: shown under the field once it gets near. */
    counter?: FieldCounter | undefined
  }

export function TextField({
  label,
  note,
  hint,
  hintMet,
  error,
  invalid,
  success,
  trailing,
  counter,
  type = 'text',
  ...rest
}: TextFieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const { status, message } = describeField({ error, invalid, success, hint, hintMet })

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor={id} label={label} note={note} />
      <div className="relative">
        <input
          id={id}
          type={type}
          aria-invalid={status === 'error' ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={classNames(
            'h-14 w-full rounded-m px-4 text-label text-ink-900 placeholder:text-ink-700',
            'disabled-look',
            FIELD_BORDERS[status],
            trailing !== undefined && 'pr-17',
          )}
          {...rest}
        />
        {status === 'success' && (
          <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-herb">
            <Icon name="check" size={26} strokeWidth={2.8} />
          </span>
        )}
        {trailing !== undefined && <div className="absolute top-1 right-1">{trailing}</div>}
      </div>
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
