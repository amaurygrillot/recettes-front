export interface ProgressBarProps {
  /** What is going on, for those who do not see the bar: « Envoi de la photo ». */
  label: string
  /** How far it is, from 0 to 100. Absent when the length of the wait is not known: the bar then keeps moving. */
  value?: number
}

/**
 * A bar in an ink outline, filled in butter. With a `value` it shows how far a task is; without
 * one it only says that something is going on, which is all that a browser's request can tell
 * about an upload.
 */
export function ProgressBar({ label, value }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="h-4 overflow-hidden rounded-pill border-2 border-ink-900 bg-paper-50"
    >
      {value === undefined ? (
        <div className="h-full w-2/5 animate-progress border-r-2 border-ink-900 bg-butter-300 motion-reduce:w-full motion-reduce:animate-none motion-reduce:opacity-60" />
      ) : (
        <div
          className="h-full border-r-2 border-ink-900 bg-butter-300"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      )}
    </div>
  )
}
