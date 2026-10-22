import type { ComponentProps, ReactNode } from 'react'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'

export type FilterChipProps = Omit<
  ComponentProps<'button'>,
  'className' | 'aria-pressed' | 'children'
> & {
  /** The label: it is the accessible name. */
  children: ReactNode
  selected: boolean
}

/** A toggle that filters a list. Chosen = yellow + tick + stamp shadow: three signs, not only colour. */
export function FilterChip({ selected, type = 'button', children, ...rest }: FilterChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={classNames(
        'inline-flex min-h-13 cursor-pointer items-center gap-2 rounded-pill border-2 border-ink-900 px-5 text-body font-bold text-ink-900',
        selected ? 'bg-butter-300 pl-3.5 shadow-stamp-sm' : 'bg-paper-50',
        'disabled-look',
      )}
      {...rest}
    >
      {selected && <Icon name="check" size={22} strokeWidth={3} />}
      {children}
    </button>
  )
}
