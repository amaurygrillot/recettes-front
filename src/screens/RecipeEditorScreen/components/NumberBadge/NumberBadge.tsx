import { classNames } from '../../../../lib/classNames'

export interface NumberBadgeProps {
  number: number
  /** Brighter while its card is carried. */
  lifted?: boolean
}

/** The number of a section or of a step: a round butter badge, outlined in ink. Decorative: the heading says it too. */
export function NumberBadge({ number, lifted = false }: NumberBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={classNames(
        'grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink-900 font-title text-body font-extrabold',
        lifted ? 'bg-butter-300' : 'bg-butter-200',
      )}
    >
      {number}
    </span>
  )
}
