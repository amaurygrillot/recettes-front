import type { ReactNode } from 'react'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/iconShapes'
import { SECTION_INDEX_ENTRY_BASE } from './sectionIndexStyles'

export interface SectionIndexItem {
  /** The `id` of the section it leads to. */
  id: string
  label: string
  icon: IconName
}

export interface SectionIndexProps {
  /** Names the landmark: « Sections du compte ». */
  label: string
  items: readonly SectionIndexItem[]
  /** The section the reader is on: its pill is yellow. */
  activeId: string | undefined
  onSelect: (id: string) => void
  /** What comes after the dashed rule (« Se déconnecter »): another entry of the index. */
  children?: ReactNode
}

/**
 * The column of a long page's sections, on a tablet and a desktop: each entry scrolls to its
 * section, the yellow pill follows the one being read.
 */
export function SectionIndex({ label, items, activeId, onSelect, children }: SectionIndexProps) {
  return (
    <nav aria-label={label} className="flex flex-col gap-1.5">
      {items.map(({ id, label: itemLabel, icon }) => {
        const current = id === activeId
        return (
          <a
            key={id}
            href={`#${id}`}
            aria-current={current ? 'true' : undefined}
            onClick={(event) => {
              // A hash would add a history entry for a scroll: the page moves itself.
              event.preventDefault()
              onSelect(id)
            }}
            className={classNames(
              SECTION_INDEX_ENTRY_BASE,
              current
                ? 'border-ink-900 bg-butter-300 font-bold text-ink-900'
                : 'border-transparent text-ink-800 hover:bg-paper-200',
            )}
          >
            <Icon name={icon} size={24} strokeWidth={2.4} />
            {itemLabel}
          </a>
        )
      })}
      {children && (
        <>
          <hr className="mx-1 my-2 border-t-2 border-dashed border-ink-500" />
          {children}
        </>
      )}
    </nav>
  )
}
