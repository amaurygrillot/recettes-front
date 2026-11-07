export interface NumberBadgeProps {
  number: number
}

/** The number of a section or of a step: a round butter badge, outlined in ink. Decorative: the heading says it too. */
export function NumberBadge({ number }: NumberBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink-900 bg-butter-200 font-title text-body font-extrabold"
    >
      {number}
    </span>
  )
}
