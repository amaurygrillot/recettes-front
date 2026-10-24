import type { ReactNode } from 'react'
import { classNames } from '../../../../lib/classNames'

export interface EditorSectionProps {
  /** The `id` of the section: the index and the summary scroll to it, and its title is `<id>-title`. */
  id: string
  /** Its rank in the form: 1 to 5. */
  number: number
  title: string
  /** Puts the whole section in its brick frame: a required section that has nothing in it. */
  invalid?: boolean
  children: ReactNode
}

/** One section of the form, with its number in a round butter badge, as the index shows it. */
export function EditorSection({
  id,
  number,
  title,
  invalid = false,
  children,
}: EditorSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={classNames(
        'flex scroll-mt-40 flex-col gap-4.5',
        invalid && 'rounded-xl border-3 border-brick bg-brick-wash p-4',
      )}
    >
      <h2
        id={`${id}-title`}
        tabIndex={-1}
        className="flex items-center gap-3 font-title text-section-title outline-none"
      >
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink-900 bg-butter-200 text-body font-extrabold"
        >
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}
