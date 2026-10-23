import { CountBadge } from '../../../../components/CountBadge/CountBadge'
import { classNames } from '../../../../lib/classNames'
import type { FilterSection } from '../../filterChoices'
import { strings } from '../../strings'

export interface SectionPillsProps {
  sections: readonly FilterSection[]
  activeId: string
  onSelect: (section: FilterSection) => void
}

/**
 * One pill per section of the filters, under the sheet's title: a touch (or Enter) jumps to the
 * section, and the pill of the section in view is the yellow one. They do not replace the
 * content, so what was chosen in another section stays in view of the mind.
 */
export function SectionPills({ sections, activeId, onSelect }: SectionPillsProps) {
  return (
    <nav
      aria-label={strings.filters.sections}
      className="scrollbar-hidden flex shrink-0 gap-2.5 overflow-x-auto px-5 pt-2 pb-3"
    >
      {sections.map((section) => {
        const active = section.id === activeId
        return (
          <button
            key={section.key}
            type="button"
            aria-current={active ? 'true' : undefined}
            aria-label={
              section.count > 0
                ? strings.filters.sectionActive(section.label, section.count)
                : undefined
            }
            onClick={() => {
              onSelect(section)
            }}
            className={classNames(
              'inline-flex h-13 shrink-0 cursor-pointer items-center gap-2 rounded-pill border-2 border-ink-900 px-5 text-body font-bold text-ink-900 focus-visible:outline-offset-3',
              active ? 'bg-butter-300 shadow-stamp-sm' : 'bg-paper-50',
            )}
          >
            {section.label}
            {section.count > 0 && <CountBadge count={section.count} />}
          </button>
        )
      })}
    </nav>
  )
}
