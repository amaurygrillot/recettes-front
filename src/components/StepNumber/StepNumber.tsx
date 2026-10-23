export interface StepNumberProps {
  number: number
}

/**
 * The number of a step, as a slightly tilted brick stamp above its text: handwritten (Kalam) for
 * the number only, since the instruction itself is never set in a handwriting. Decorative: the
 * list it sits in is already numbered.
 */
export function StepNumber({ number }: StepNumberProps) {
  return (
    <div
      aria-hidden="true"
      className="text-5xl grid size-16 -rotate-6 place-items-center rounded-full border-3 border-brick bg-paper-50 font-hand leading-none font-bold text-brick shadow-[inset_0_0_0_3px_var(--color-paper-50),inset_0_0_0_4.5px_var(--color-brick)]"
    >
      {number}
    </div>
  )
}
