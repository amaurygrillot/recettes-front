import { useState, type UIEvent } from 'react'
import type { FilterSection } from '../../filterChoices'

/** The section whose top is the nearest at or above the top of the scrolled body: the one being read. */
function sectionInView(body: HTMLElement, sections: readonly FilterSection[]): string | undefined {
  const reading = body.getBoundingClientRect().top + 8
  let current = sections[0]?.id
  for (const { id } of sections) {
    const top = body.querySelector(`[id="${id}"]`)?.getBoundingClientRect().top
    if (top !== undefined && top <= reading) current = id
  }
  return current
}

/**
 * Which section of the filters is being read, and the way to jump to another: what the section pills
 * of the overlay's sheet are made of. The pill of the section in view follows the scroll.
 */
export function useFilterSections(sections: readonly FilterSection[]) {
  const [activeSection, setActiveSection] = useState<string | undefined>()

  return {
    activeId: activeSection ?? sections[0]?.id ?? '',
    jumpTo: (section: FilterSection): void => {
      setActiveSection(section.id)
      const target = document.getElementById(section.id)
      target?.scrollIntoView({ block: 'start' })
      target?.focus({ preventScroll: true })
    },
    onScroll: (event: UIEvent<HTMLDivElement>): void => {
      setActiveSection(sectionInView(event.currentTarget, sections))
    },
  }
}
