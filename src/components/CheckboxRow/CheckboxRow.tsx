import type { ComponentProps } from 'react'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'

export type CheckboxRowProps = Omit<ComponentProps<'input'>, 'className' | 'type' | 'children'> & {
  /** The label: the whole row is touchable, as the box is. */
  label: string
  /** A quieter line under the label (the path of a category: « Desserts › Tartes »). It is part of the name. */
  hint?: string | undefined
}

/** One thing to tick: a 32 px square in a row of 60 px at least. Ticked = yellow and a tick, two signs. */
export function CheckboxRow({ label, hint, disabled, ...rest }: CheckboxRowProps) {
  return (
    <label
      className={classNames(
        'flex min-h-15 cursor-pointer items-center gap-3.5 text-body text-ink-900',
        disabled && 'cursor-not-allowed text-disabled-text',
      )}
    >
      <input type="checkbox" disabled={disabled} className="peer sr-only" {...rest} />
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-s border-2 border-ink-900 bg-paper-50 text-transparent peer-checked:bg-butter-300 peer-checked:text-ink-900 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-ink-900 peer-disabled:border-dashed peer-disabled:border-disabled-border peer-disabled:bg-disabled-bg"
      >
        <Icon name="check" size={22} strokeWidth={3} />
      </span>
      <span className="flex min-w-0 flex-col">
        {label}
        {hint && (
          <>
            {' '}
            <span className="text-detail text-ink-700">{hint}</span>
          </>
        )}
      </span>
    </label>
  )
}
