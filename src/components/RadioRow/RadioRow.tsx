import type { ComponentProps } from 'react'
import { classNames } from '../../lib/classNames'

export type RadioRowProps = Omit<ComponentProps<'input'>, 'className' | 'type' | 'children'> & {
  /** The label: the whole row is touchable, as the circle is. */
  label: string
}

/** One choice among several: a 32 px circle in a row of 60 px at least. Group them in a `fieldset`. */
export function RadioRow({ label, disabled, ...rest }: RadioRowProps) {
  return (
    <label
      className={classNames(
        'flex min-h-15 cursor-pointer items-center gap-3.5 text-body text-ink-900',
        disabled && 'cursor-not-allowed text-disabled-text',
      )}
    >
      <input type="radio" disabled={disabled} className="peer sr-only" {...rest} />
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink-900 bg-paper-50 peer-checked:bg-butter-300 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-ink-900 peer-disabled:border-dashed peer-disabled:border-disabled-border peer-disabled:bg-disabled-bg peer-checked:[&>span]:scale-100"
      >
        <span className="size-3.5 scale-0 rounded-full bg-ink-900" />
      </span>
      {label}
    </label>
  )
}
