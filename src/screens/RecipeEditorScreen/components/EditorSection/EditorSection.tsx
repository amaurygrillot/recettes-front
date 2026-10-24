import type { ReactNode } from 'react'
import { classNames } from '../../../../lib/classNames'
import { NumberBadge } from '../NumberBadge/NumberBadge'

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
        'flex scroll-mt-48 flex-col gap-4.5',
        invalid && 'rounded-xl border-3 border-brick bg-brick-wash p-4',
      )}
    >
      <h2
        id={`${id}-title`}
        tabIndex={-1}
        className="flex items-center gap-3 font-title text-section-title outline-none"
      >
        <NumberBadge number={number} />
        {title}
      </h2>
      {children}
    </section>
  )
}
