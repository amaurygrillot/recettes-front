import { classNames } from '../../../../lib/classNames'
import type { SectionId } from '../../problems'
import { strings } from '../../strings'

export interface EditorIndexProps {
  /** The section being read: its pill is yellow. */
  activeId: string | undefined
  /** What is wrong in each section, after a « Enregistrer » that was refused: a red count on its entry. */
  problems: Partial<Record<SectionId, number>>
  onSelect: (id: SectionId) => void
}

const ENTRIES: readonly { id: SectionId; label: string }[] = [
  { id: 'informations', label: strings.sections.information },
  { id: 'photos', label: strings.sections.photos },
  { id: 'ingredients', label: strings.sections.ingredients },
  { id: 'steps', label: strings.sections.steps },
  { id: 'advice', label: strings.sections.advice },
]

/**
 * The sections of the form, from a desktop: numbered pills that scroll to their section, the yellow one
 * following what is being read. Once saving was refused, the sections with something to correct carry
 * the number of things, so that the way to them is shown before the page is scrolled.
 */
export function EditorIndex({ activeId, problems, onSelect }: EditorIndexProps) {
  return (
    <nav aria-label={strings.sections.label} className="flex flex-col gap-1.5">
      {ENTRIES.map(({ id, label }, index) => {
        const current = id === activeId
        const count = problems[id] ?? 0
        return (
          <a
            key={id}
            href={`#${id}`}
            aria-current={current ? 'true' : undefined}
            aria-label={count > 0 ? strings.sections.withProblems(label, count) : undefined}
            onClick={(event) => {
              // A hash would add a history entry for a scroll: the page moves itself.
              event.preventDefault()
              onSelect(id)
            }}
            className={classNames(
              'flex h-13 items-center gap-3 rounded-pill border-2 pr-3 pl-2.5 text-body whitespace-nowrap',
              current
                ? 'border-ink-900 bg-butter-300 font-bold text-ink-900 shadow-stamp-sm'
                : 'border-transparent text-ink-800 hover:bg-paper-200',
            )}
          >
            <span
              aria-hidden="true"
              className={classNames(
                'grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink-900 font-title text-detail font-extrabold text-ink-900',
                current ? 'bg-paper-50' : 'bg-butter-200',
              )}
            >
              {index + 1}
            </span>
            {label}
            {count > 0 && (
              <span
                aria-hidden="true"
                className="ml-auto grid h-6 min-w-6 place-items-center rounded-pill border-2 border-paper-50 bg-brick px-1.5 text-caption leading-none font-bold text-paper-50"
              >
                {count}
              </span>
            )}
          </a>
        )
      })}
    </nav>
  )
}
