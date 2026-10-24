import { ProgressBar } from '../../../../components/ProgressBar/ProgressBar'
import { classNames } from '../../../../lib/classNames'
import { strings } from '../../strings'

export interface StepProgressProps {
  /** The step being cooked, counted from 1. */
  step: number
  total: number
}

/** Up to this many steps each has its segment; beyond it they would be too thin to read. */
const MAX_SEGMENTS = 12

/**
 * Where the cook is: « Étape 3 sur 8 » and one segment per step (done in ink, the current one in
 * yellow outlined in ink, to come in cream with a lighter outline: three signs, never the colour
 * alone), or a thin continuous bar from thirteen steps on. A recipe with a single step has no progress to show.
 */
export function StepProgress({ step, total }: StepProgressProps) {
  if (total < 2) return null
  const label = strings.stepOf(step, total)

  return (
    <div className="flex flex-col gap-2 desktop:gap-2.5">
      <p aria-live="polite" className="text-label leading-none font-bold">
        {label}
      </p>
      {total > MAX_SEGMENTS ? (
        <ProgressBar label={label} value={(step / total) * 100} size="thin" />
      ) : (
        <div
          role="progressbar"
          aria-label={label}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={step}
          className="flex gap-1.25"
        >
          {Array.from({ length: total }, (_, index) => {
            const position = index + 1
            return (
              <span
                key={position}
                aria-current={position === step ? 'step' : undefined}
                className={classNames(
                  'h-3.5 min-w-0 flex-1 rounded-pill border-2',
                  position < step && 'border-ink-900 bg-ink-900',
                  position === step && 'border-ink-900 bg-butter-300',
                  position > step && 'border-ink-500 bg-paper-50',
                )}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
