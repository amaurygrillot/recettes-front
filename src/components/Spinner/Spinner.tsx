export interface SpinnerProps {
  /** Rendered width and height in px; 24 beside a button label. */
  size?: number
}

/**
 * A quarter-turn arc going round, for a control that is waiting (« Chargement… »). Decorative:
 * the waiting is announced by the text next to it. It stands still under `prefers-reduced-motion`.
 */
export function Spinner({ size = 24 }: SpinnerProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      aria-hidden="true"
      className="shrink-0 animate-spinner motion-reduce:animate-none"
    >
      <path d="M12 3 a9 9 0 1 0 9 9" />
    </svg>
  )
}
