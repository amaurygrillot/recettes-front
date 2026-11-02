import { useEffect, useRef, useState } from 'react'
import { MAX_QUERY_LENGTH, type SearchCriteria } from '../../../../app/searchCriteria'
import { BottomSheet } from '../../../../components/BottomSheet/BottomSheet'
import { TopPanel } from '../../../../components/TopPanel/TopPanel'
import { DESKTOP_QUERY } from '../../../../lib/breakpoints'
import { logger } from '../../../../lib/logger'
import { useMediaQuery } from '../../../../lib/useMediaQuery'
import { filterSectionsOf } from '../../filterChoices'
import { canSearch, criteriaOf, draftOf, EMPTY_DRAFT, type SearchDraft } from '../../searchDraft'
import { strings } from '../../strings'
import { useFilterOptions } from '../../useFilterOptions'
import { FiltersPanel } from '../FiltersPanel/FiltersPanel'
import { SectionPills } from '../FiltersPanel/SectionPills'
import { SearchActions } from './SearchActions'
import { SearchTextField } from './SearchTextField'
import { useFilterSections } from './useFilterSections'

export interface SearchOverlayProps {
  /** The search the overlay starts from: the results page's, or none. */
  initial: SearchCriteria
  /** A key typed on a field outside the overlay: it is written at the end of the text. */
  typed: string
  /** What takes the focus: the text field (the keyboard comes up) or, from « Filtres », the filters. */
  focus: 'text' | 'filters'
  /** « Mes recettes »: the author is the member, so there is no author field and nothing to choose to search. */
  mine: boolean
  /** Validated: the search to make. The overlay closes itself by being unmounted. */
  onSearch: (criteria: SearchCriteria) => void
  onClose: () => void
}

function initialDraft(initial: SearchCriteria, typed: string): SearchDraft {
  const start = draftOf(initial)
  return { ...start, query: `${start.query}${typed}`.slice(0, MAX_QUERY_LENGTH) }
}

/**
 * The search, over the page that opened it: the title field and every filter, on a draft that the address
 * hears of only when « Rechercher » is pressed. A sheet on a phone and a tablet, a panel under the top bar on a
 * desktop; closing it any other way applies nothing.
 */
export function SearchOverlay({
  initial,
  typed,
  focus,
  mine,
  onSearch,
  onClose,
}: SearchOverlayProps) {
  const desktop = useMediaQuery(DESKTOP_QUERY)
  const options = useFilterOptions()
  const [draft, setDraft] = useState(() => initialDraft(initial, typed))
  const textRef = useRef<HTMLInputElement>(null)
  const sections = filterSectionsOf(draft, !mine)
  const sectionPills = useFilterSections(sections)
  const searchable = canSearch(draft, mine)

  // A text that starts filled (a search to refine, a key carried over) is continued, not selected or prepended to.
  useEffect(() => {
    const end = textRef.current?.value.length ?? 0
    textRef.current?.setSelectionRange(end, end)
  }, [])

  function search(): void {
    if (!searchable) return
    logger.info('Searching from the overlay', { hasText: draft.query.trim() !== '', mine })
    onSearch(criteriaOf(draft, initial.sort))
  }

  const field = (
    <SearchTextField
      value={draft.query}
      onChange={(query) => {
        setDraft((current) => ({ ...current, query }))
      }}
      onSubmit={search}
      inputRef={textRef}
    />
  )
  const filters = (
    <FiltersPanel
      choices={draft}
      onChange={(changes) => {
        setDraft((current) => ({ ...current, ...changes }))
      }}
      options={options}
      showAuthor={!mine}
      authorDebounceMs={0}
      columns={desktop}
    />
  )
  const actions = (
    <SearchActions
      searchable={searchable}
      onReset={() => {
        setDraft(EMPTY_DRAFT)
      }}
      onSearch={search}
      stretch={!desktop}
    />
  )
  const initialFocusRef = focus === 'text' ? textRef : undefined
  const onOpenChange = (open: boolean): void => {
    if (!open) onClose()
  }

  if (desktop) {
    return (
      <TopPanel
        open
        onOpenChange={onOpenChange}
        title={strings.overlay.title}
        initialFocusRef={initialFocusRef}
        toolbar={field}
        actions={actions}
      >
        {filters}
      </TopPanel>
    )
  }

  return (
    <BottomSheet
      open
      onOpenChange={onOpenChange}
      title={strings.overlay.title}
      initialFocusRef={initialFocusRef}
      toolbar={
        <>
          <div className="px-5 pt-1">{field}</div>
          <SectionPills
            sections={sections}
            activeId={sectionPills.activeId}
            onSelect={sectionPills.jumpTo}
          />
        </>
      }
      onContentScroll={sectionPills.onScroll}
      actions={actions}
    >
      {filters}
    </BottomSheet>
  )
}
