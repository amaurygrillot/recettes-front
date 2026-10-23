import { FilterChip } from '../../../../components/FilterChip/FilterChip'
import type { TagChoice } from '../../useFilterOptions'

export interface TagChipsProps {
  tags: readonly TagChoice[]
  tagId: string | undefined
  onChoose: (tagId: string | undefined) => void
}

/**
 * The tags as chips that wrap, the chosen one first. The API takes one tag: touching the chosen
 * one drops it, touching another replaces it.
 */
export function TagChips({ tags, tagId, onChoose }: TagChipsProps) {
  const chosenFirst = [...tags].sort((a, b) => Number(b.id === tagId) - Number(a.id === tagId))

  return (
    <div className="flex flex-wrap gap-2.5">
      {chosenFirst.map((tag) => (
        <FilterChip
          key={tag.id}
          selected={tag.id === tagId}
          onClick={() => {
            onChoose(tag.id === tagId ? undefined : tag.id)
          }}
        >
          {tag.name}
        </FilterChip>
      ))}
    </div>
  )
}
