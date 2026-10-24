import { useId, type ComponentProps } from 'react'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import { FieldLabel } from '../TextField/fieldParts'

export interface SelectOption {
  value: string
  label: string
}

export type SelectFieldProps = Omit<
  ComponentProps<'select'>,
  'className' | 'id' | 'children' | 'aria-invalid'
> & {
  /** Always visible, above the field. */
  label: string
  note?: string | undefined
  /** What none of the options says, as the first choice (« — »): its value is the empty string. */
  emptyLabel: string
  options: readonly SelectOption[]
  /** The frame of an error whose words are said elsewhere. */
  invalid?: boolean
}

/**
 * A choice among a few, with the system's own list (the best one on a phone), in the frame of the
 * text fields and with a chevron that says what it is. The first choice is « none ».
 */
export function SelectField({
  label,
  note,
  emptyLabel,
  options,
  invalid = false,
  ...rest
}: SelectFieldProps) {
  const id = useId()

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <FieldLabel htmlFor={id} label={label} note={note} />
      <div className="relative text-ink-900">
        <select
          id={id}
          aria-invalid={invalid || undefined}
          className={classNames(
            'h-14 w-full cursor-pointer appearance-none rounded-m bg-paper-50 pr-9 pl-3 text-label text-ink-900',
            'disabled-look',
            invalid
              ? 'border-3 border-brick bg-brick-wash'
              : 'border-2 border-ink-500 focus:border-ink-900',
          )}
          {...rest}
        >
          <option value="">{emptyLabel}</option>
          {options.map(({ value, label: optionLabel }) => (
            <option key={value} value={value}>
              {optionLabel}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2">
          <Icon name="chevron-down" size={24} strokeWidth={2.4} />
        </span>
      </div>
    </div>
  )
}
