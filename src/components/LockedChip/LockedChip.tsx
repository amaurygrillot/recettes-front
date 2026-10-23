import { Icon } from '../Icon/Icon'

export interface LockedChipProps {
  /** What is fixed: « Mes recettes ». */
  label: string
  /** Said after the label to assistive technology, which does not see the padlock: « verrouillé ». */
  lockedLabel: string
}

/** A filter that cannot be removed, shown so that the reader sees why the list is what it is. Not a control. */
export function LockedChip({ label, lockedLabel }: LockedChipProps) {
  return (
    <span className="inline-flex h-13 shrink-0 items-center gap-2 rounded-pill border-2 border-ink-900 bg-butter-300 pr-4.5 pl-3.5 text-body font-bold whitespace-nowrap text-ink-900">
      <Icon name="lock" size={22} strokeWidth={2.4} />
      {label}
      <span className="sr-only"> {lockedLabel}</span>
    </span>
  )
}
