export interface CountBadgeProps {
  count: number
}

/**
 * The brick dot with a number: how many choices are active. Decorative, like the icon next to it:
 * the control it sits on says the count in its own accessible name (« Filtres, 2 actifs »).
 */
export function CountBadge({ count }: CountBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className="inline-grid h-6 min-w-6 place-items-center rounded-pill border-2 border-paper-50 bg-brick px-1.5 text-caption leading-none font-bold text-paper-50"
    >
      {count}
    </span>
  )
}
