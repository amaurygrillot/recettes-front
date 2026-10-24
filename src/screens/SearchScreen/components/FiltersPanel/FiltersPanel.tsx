import { useState, type ReactNode } from 'react'
import { Button } from '../../../../components/Button/Button'
import { Combobox } from '../../../../components/Combobox/Combobox'
import { ErrorBanner } from '../../../../components/ErrorBanner/ErrorBanner'
import { findCategory, type CategoryNode } from '../../../../app/categoryNodes'
import { SECTION_IDS, type FilterChoices } from '../../filterChoices'
import { strings } from '../../strings'
import type { FilterOptions } from '../../useFilterOptions'
import { AuthorField } from './AuthorField'
import { CategoryTree } from './CategoryTree'
import { TagChips } from './TagChips'

const { filters } = strings

export interface FiltersPanelProps {
  choices: FilterChoices
  onChange: (changes: Partial<FilterChoices>) => void
  options: FilterOptions
  /** Not in « Mes recettes »: the author is the member. */
  showAuthor: boolean
  /** How long the author's field waits after the last letter; 0 where the choices are only a draft. */
  authorDebounceMs: number
  /** The narrow column of a desktop: search fields carry a short placeholder. */
  dense?: boolean
}

function Section({ id, legend, children }: { id: string; legend: string; children: ReactNode }) {
  return (
    <fieldset id={id} tabIndex={-1} className="scroll-mt-2 outline-none">
      <legend className="mb-3 p-0 font-title text-title-3 text-ink-900">{legend}</legend>
      <div className="flex flex-col gap-3">{children}</div>
    </fieldset>
  )
}

/** The branch of the tree down to a category, and the category itself when something is filed under it. */
function pathTo(categories: readonly CategoryNode[], id: string | undefined): string[] {
  if (id === undefined) return []
  const found = findCategory(categories, id)
  if (found === undefined) return []
  const opened = found.ancestors.map((ancestor) => ancestor.id)
  return found.node.children.length > 0 ? [...opened, found.node.id] : opened
}

/**
 * The filters: category (a tree and a search field), tag (chips and a search field), author.
 * The same panel is the content of the sheet on a phone and a tablet and the column of a desktop;
 * it holds no choice of its own, so whoever shows it decides when the choices count.
 */
export function FiltersPanel({
  choices,
  onChange,
  options,
  showAuthor,
  authorDebounceMs,
  dense = false,
}: FiltersPanelProps) {
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(new Set())
  const [seeded, setSeeded] = useState(false)

  // The tree opens on the chosen category once it is known: derived once from the data, not synchronised after.
  if (options.status === 'ready' && !seeded) {
    setSeeded(true)
    setExpandedIds(new Set(pathTo(options.categories, choices.categoryId)))
  }

  function expand(ids: readonly string[]): void {
    setExpandedIds((current) => new Set([...current, ...ids]))
  }

  function chooseCategory(categoryId: string | undefined): void {
    onChange({ categoryId, exactCategory: false })
    if (options.status === 'ready') expand(pathTo(options.categories, categoryId))
  }

  function toggleExpanded(id: string): void {
    setExpandedIds((current) => {
      const next = new Set(current)
      if (!next.delete(id)) next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-7 pt-2">
      {options.status === 'loading' && (
        <p role="status" className="text-body text-ink-800">
          {filters.loadingOptions}
        </p>
      )}
      {options.status === 'failed' && (
        <ErrorBanner message={filters.optionsFailed}>
          <Button variant="secondary" size="medium" icon="refresh" onClick={options.retry}>
            {filters.retryOptions}
          </Button>
        </ErrorBanner>
      )}
      {options.status === 'ready' && (
        <>
          <Section id={SECTION_IDS.category} legend={filters.category.legend}>
            <Combobox
              label={filters.category.searchLabel}
              placeholder={dense ? filters.searchShort : filters.category.searchLabel}
              suggestionsLabel={filters.category.suggestions}
              options={options.categoryOptions}
              selectedIds={choices.categoryId === undefined ? [] : [choices.categoryId]}
              onToggle={(option) => {
                chooseCategory(option.id === choices.categoryId ? undefined : option.id)
              }}
              noResultText={filters.category.noResult}
            />
            <CategoryTree
              categories={options.categories}
              categoryId={choices.categoryId}
              exactCategory={choices.exactCategory}
              expandedIds={expandedIds}
              onChoose={chooseCategory}
              onToggleExact={(exactCategory) => {
                onChange({ exactCategory })
              }}
              onToggleExpanded={toggleExpanded}
            />
          </Section>
          <Section id={SECTION_IDS.tags} legend={filters.tags.legend}>
            <Combobox
              label={filters.tags.searchLabel}
              placeholder={dense ? filters.searchShort : filters.tags.searchLabel}
              suggestionsLabel={filters.tags.suggestions}
              options={options.tagOptions}
              selectedIds={choices.tagId === undefined ? [] : [choices.tagId]}
              onToggle={(option) => {
                onChange({ tagId: option.id === choices.tagId ? undefined : option.id })
              }}
              noResultText={filters.tags.noResult}
            />
            <TagChips
              tags={options.tags}
              tagId={choices.tagId}
              onChoose={(tagId) => {
                onChange({ tagId })
              }}
            />
          </Section>
        </>
      )}
      {showAuthor && (
        <Section id={SECTION_IDS.author} legend={filters.author.legend}>
          <AuthorField
            value={choices.author}
            onChange={(author) => {
              onChange({ author })
            }}
            debounceMs={authorDebounceMs}
          />
        </Section>
      )}
    </div>
  )
}
