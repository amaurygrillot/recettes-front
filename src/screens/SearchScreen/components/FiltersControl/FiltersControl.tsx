import { useState } from 'react'
import { useRecipeCount } from '../../../../api/recipes'
import { activeFilterCount, type SearchCriteria } from '../../../../app/searchCriteria'
import { BottomSheet } from '../../../../components/BottomSheet/BottomSheet'
import { Button } from '../../../../components/Button/Button'
import { CountBadge } from '../../../../components/CountBadge/CountBadge'
import { Icon } from '../../../../components/Icon/Icon'
import { IconButton } from '../../../../components/IconButton/IconButton'
import {
  filterChoicesOf,
  filterSectionsOf,
  NO_FILTERS,
  type FilterChoices,
  type FilterSection,
} from '../../filterChoices'
import { toRecipeFilters, type SearchScope } from '../../recipeFilters'
import { strings } from '../../strings'
import type { FilterOptions } from '../../useFilterOptions'
import { FiltersPanel } from '../FiltersPanel/FiltersPanel'
import { SectionPills } from '../FiltersPanel/SectionPills'

const { filters } = strings

export interface FiltersControlProps {
  criteria: SearchCriteria
  scope: SearchScope
  options: FilterOptions
  /** Writes the chosen filters into the search. */
  onApply: (choices: FilterChoices) => void
  /** From 600 px the button carries its word, as designed. */
  labelled: boolean
}

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
 * The « Filtres » button and the sheet it opens, on a phone and a tablet. The sheet works on a
 * draft: « Voir les N recettes » applies it, with N kept up to date as choices are made; closing
 * the sheet any other way drops it.
 */
export function FiltersControl({
  criteria,
  scope,
  options,
  onApply,
  labelled,
}: FiltersControlProps) {
  // The sheet is open exactly while there is a draft.
  const [draft, setDraft] = useState<FilterChoices | undefined>()
  const [activeSection, setActiveSection] = useState<string | undefined>()
  const count = activeFilterCount(criteria)
  const showAuthor = scope.kind === 'all'
  const sections = filterSectionsOf(draft ?? NO_FILTERS, showAuthor)

  // Only while the sheet is open: a closed one has nothing to count.
  const matching = useRecipeCount(
    toRecipeFilters({ ...criteria, ...(draft ?? NO_FILTERS) }, scope),
    draft !== undefined,
  )

  function open(): void {
    setDraft(filterChoicesOf(criteria))
    setActiveSection(undefined)
  }

  function jumpTo(section: FilterSection): void {
    setActiveSection(section.id)
    const target = document.getElementById(section.id)
    target?.scrollIntoView({ block: 'start' })
    target?.focus({ preventScroll: true })
  }

  const label = count > 0 ? filters.buttonActive(count) : filters.button

  return (
    <>
      {labelled ? (
        <Button
          variant={count > 0 ? 'primary' : 'secondary'}
          size="medium"
          aria-label={label}
          onClick={open}
        >
          <Icon name="filter" />
          {filters.button}
          {count > 0 && <CountBadge count={count} />}
        </Button>
      ) : (
        <IconButton
          label={label}
          icon="filter"
          variant={count > 0 ? 'active' : 'outlined'}
          badge={count}
          onClick={open}
        />
      )}
      <BottomSheet
        open={draft !== undefined}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDraft(undefined)
        }}
        title={filters.title}
        toolbar={
          <SectionPills
            sections={sections}
            activeId={activeSection ?? sections[0]?.id ?? ''}
            onSelect={jumpTo}
          />
        }
        onContentScroll={(event) => {
          setActiveSection(sectionInView(event.currentTarget, sections))
        }}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setDraft(NO_FILTERS)
              }}
            >
              {filters.reset}
            </Button>
            <div className="min-w-0 flex-1">
              <Button
                fullWidth
                onClick={() => {
                  if (draft !== undefined) onApply(draft)
                  setDraft(undefined)
                }}
              >
                {matching.data === undefined
                  ? filters.showRecipesWithoutCount
                  : filters.showRecipes(matching.data)}
              </Button>
            </div>
          </>
        }
      >
        <FiltersPanel
          choices={draft ?? NO_FILTERS}
          onChange={(changes) => {
            setDraft((current) => ({ ...(current ?? NO_FILTERS), ...changes }))
          }}
          options={options}
          showAuthor={showAuthor}
          authorDebounceMs={0}
        />
      </BottomSheet>
    </>
  )
}
