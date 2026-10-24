export interface StepNumberProps {
  number: number
  /**
   * « ÉTAPE »: set above the number, which makes it the large stamp of the step-by-step screen
   * (104 px) instead of the 64 px number above a step of the recipe page.
   */
  word?: string
}

const RING = 'shadow-[inset_0_0_0_3px_var(--color-paper-50),inset_0_0_0_4.5px_var(--color-brick)]'
const LARGE_RING =
  'shadow-[inset_0_0_0_4px_var(--color-paper-50),inset_0_0_0_5.5px_var(--color-brick)]'

/**
 * The number of a step, as a slightly tilted brick stamp above its text: handwritten (Kalam) for
 * the number only, since the instruction itself is never set in a handwriting. Decorative: the
 * list it sits in is already numbered.
 */
export function StepNumber({ number, word }: StepNumberProps) {
  if (word !== undefined) {
    return (
      <div
        aria-hidden="true"
        className={`flex size-26 shrink-0 -rotate-6 flex-col items-center justify-center rounded-full border-3 border-brick bg-paper-50 text-brick ${LARGE_RING}`}
      >
        <span className="text-caption leading-none font-bold tracking-[0.08em]">{word}</span>
        <span className="mt-0.5 font-hand text-poster leading-[0.9] font-bold">{number}</span>
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className={`text-5xl grid size-16 -rotate-6 place-items-center rounded-full border-3 border-brick bg-paper-50 font-hand leading-none font-bold text-brick ${RING}`}
    >
      {number}
    </div>
  )
}
