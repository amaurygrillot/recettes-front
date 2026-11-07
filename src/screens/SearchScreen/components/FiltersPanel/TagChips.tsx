import { FilterChip } from '../../../../components/FilterChip/FilterChip'
import type { TagChoice } from '../../useFilterOptions'

export interface TagChipsProps {
  tags: readonly TagChoice[]
  /** The tags chosen: a recipe has to carry all of them. */
  tagIds: readonly string[]
  /** Nothing more can be chosen: the chips that are not chosen are off, the chosen ones can still be dropped. */
  full: boolean
  onToggle: (tagId: string) => void
}

/**
 * The tags as chips that wrap, the chosen ones first. Any number can be chosen: touching a chip
 * chooses its tag or drops it.
 */
export function TagChips({ tags, tagIds, full, onToggle }: TagChipsProps) {
  const chosen = new Set(tagIds)
  const chosenFirst = [...tags].sort((a, b) => Number(chosen.has(b.id)) - Number(chosen.has(a.id)))

  return (
    <div className="flex flex-wrap gap-2.5">
      {chosenFirst.map((tag) => (
        <FilterChip
          key={tag.id}
          selected={chosen.has(tag.id)}
          disabled={full && !chosen.has(tag.id)}
          onClick={() => {
            onToggle(tag.id)
          }}
        >
          {tag.name}
        </FilterChip>
      ))}
    </div>
  )
}
