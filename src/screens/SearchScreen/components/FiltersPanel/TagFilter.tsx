import { MAX_TAG_FILTERS } from '../../../../app/searchCriteria'
import { Combobox, type ComboboxOption } from '../../../../components/Combobox/Combobox'
import { logger } from '../../../../lib/logger'
import { strings } from '../../strings'
import type { TagChoice } from '../../useFilterOptions'
import { TagChips } from './TagChips'

const { filters } = strings
const { tags: tagStrings } = filters

export interface TagFilterProps {
  tags: readonly TagChoice[]
  /** The same tags as suggestions for the search field. */
  tagOptions: readonly ComboboxOption[]
  /** The tags a recipe must all carry, in the order they were chosen. */
  tagIds: readonly string[]
  onChange: (tagIds: string[]) => void
  /** The narrow column of a desktop: the search field carries a short placeholder. */
  dense: boolean
}

/**
 * The tags to cook by: chips and a search field that both choose a tag or drop it, any number of them up to
 * what the API takes, and what that means for the list (« Recettes avec tous ces tags »). At the limit the
 * field gives way to a message and the tags not chosen go off, so a touch can never ask for more than the
 * API accepts.
 */
export function TagFilter({ tags, tagOptions, tagIds, onChange, dense }: TagFilterProps) {
  const full = tagIds.length >= MAX_TAG_FILTERS

  function toggle(tagId: string): void {
    if (tagIds.includes(tagId)) {
      onChange(tagIds.filter((chosen) => chosen !== tagId))
      return
    }
    if (full) return
    logger.debug('A tag was chosen as a filter', { count: tagIds.length + 1 })
    onChange([...tagIds, tagId])
  }

  return (
    <>
      {full ? (
        <p className="text-body text-ink-800">{tagStrings.limit(MAX_TAG_FILTERS)}</p>
      ) : (
        <Combobox
          label={tagStrings.searchLabel}
          placeholder={dense ? filters.searchShort : tagStrings.searchLabel}
          suggestionsLabel={tagStrings.suggestions}
          options={tagOptions}
          selectedIds={tagIds}
          onToggle={(option) => {
            toggle(option.id)
          }}
          noResultText={tagStrings.noResult}
        />
      )}
      <TagChips tags={tags} tagIds={tagIds} full={full} onToggle={toggle} />
      <p className="text-detail text-ink-800">
        {tagIds.length === 0 ? tagStrings.none : tagStrings.all}
      </p>
    </>
  )
}
