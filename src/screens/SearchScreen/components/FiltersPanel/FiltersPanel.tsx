import { useState, type ReactNode } from 'react'
import { Button } from '../../../../components/Button/Button'
import { Combobox } from '../../../../components/Combobox/Combobox'
import { ErrorBanner } from '../../../../components/ErrorBanner/ErrorBanner'
import { findCategory, type CategoryNode } from '../../../../app/categoryNodes'
import { MAX_TAG_FILTERS } from '../../../../app/searchCriteria'
import { logger } from '../../../../lib/logger'
import { SECTION_IDS, type FilterChoices } from '../../filterChoices'
import { strings } from '../../strings'
import type { FilterOptions } from '../../useFilterOptions'
import { AuthorField } from './AuthorField'
import { CategoryTree } from './CategoryTree'
import { IngredientFilter } from './IngredientFilter'
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
  /** The category tree on the left, the tags and the author on the right: the desktop search panel. */
  columns?: boolean
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
 * The filters: category (a tree and a search field), tags (chips and a search field; as many as wanted),
 * ingredients (a search field and the ones chosen), author.
 * The same panel is the content of the search overlay and the column of a desktop's results; it
 * holds no choice of its own, so whoever shows it decides when the choices count.
 */
export function FiltersPanel({
  choices,
  onChange,
  options,
  showAuthor,
  authorDebounceMs,
  dense = false,
  columns = false,
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

  const categorySection = options.status === 'ready' && (
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
  )

  const tagsFull = choices.tagIds.length >= MAX_TAG_FILTERS

  /** Chooses the tag, or drops it if it is chosen; at the limit nothing more is chosen. */
  function toggleTag(tagId: string): void {
    if (choices.tagIds.includes(tagId)) {
      onChange({ tagIds: choices.tagIds.filter((chosen) => chosen !== tagId) })
      return
    }
    if (tagsFull) return
    logger.debug('A tag was chosen as a filter', { count: choices.tagIds.length + 1 })
    onChange({ tagIds: [...choices.tagIds, tagId] })
  }

  const tagsSection = options.status === 'ready' && (
    <Section id={SECTION_IDS.tags} legend={filters.tags.legend}>
      {tagsFull ? (
        <p className="text-body text-ink-800">{filters.tags.limit(MAX_TAG_FILTERS)}</p>
      ) : (
        <Combobox
          label={filters.tags.searchLabel}
          placeholder={dense ? filters.searchShort : filters.tags.searchLabel}
          suggestionsLabel={filters.tags.suggestions}
          options={options.tagOptions}
          selectedIds={choices.tagIds}
          onToggle={(option) => {
            toggleTag(option.id)
          }}
          noResultText={filters.tags.noResult}
        />
      )}
      <TagChips tags={options.tags} tagIds={choices.tagIds} full={tagsFull} onToggle={toggleTag} />
    </Section>
  )

  // Not waiting for the category tree and the tags: the ingredients are searched as one types, whatever the others did.
  const ingredientsSection = (
    <Section id={SECTION_IDS.ingredients} legend={filters.ingredients.legend}>
      <IngredientFilter
        ingredientIds={choices.ingredientIds}
        onChange={(ingredientIds) => {
          onChange({ ingredientIds })
        }}
        dense={dense}
      />
    </Section>
  )

  const authorSection = showAuthor && (
    <Section id={SECTION_IDS.author} legend={filters.author.legend}>
      <AuthorField
        value={choices.author}
        onChange={(author) => {
          onChange({ author })
        }}
        debounceMs={authorDebounceMs}
      />
    </Section>
  )

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
      {columns ? (
        <div className="grid grid-cols-2 items-start gap-x-10">
          <div>{categorySection}</div>
          <div className="flex flex-col gap-7">
            {tagsSection}
            {ingredientsSection}
            {authorSection}
          </div>
        </div>
      ) : (
        <>
          {categorySection}
          {tagsSection}
          {ingredientsSection}
          {authorSection}
        </>
      )}
    </div>
  )
}
