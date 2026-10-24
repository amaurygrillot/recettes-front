import { useState } from 'react'
import { BottomSheet } from '../../../../components/BottomSheet/BottomSheet'
import { Button } from '../../../../components/Button/Button'
import { FilterChip } from '../../../../components/FilterChip/FilterChip'
import { SearchPill } from '../../../../components/SearchPill/SearchPill'
import { startsAWord } from '../../../../lib/normalizeText'
import { applyChoice } from '../../choices'
import type { Choice } from '../../editorModel'
import { strings } from '../../strings'

const { tag } = strings.choice

export interface TagSheetProps {
  /** Every tag that exists: the tags are a closed list. */
  tags: readonly Choice[]
  chosen: readonly Choice[]
  onApply: (chosen: Choice[]) => void
  onClose: () => void
}

/** The tags as chips that are touched to tick and untick, with a search; none can be created from here. */
export function TagSheet({ tags, chosen, onApply, onClose }: TagSheetProps) {
  const [ids, setIds] = useState<ReadonlySet<string>>(() => new Set(chosen.map(({ id }) => id)))
  const [search, setSearch] = useState('')
  const typed = search.trim()
  const shown = tags.filter(({ label }) => typed === '' || startsAWord(label, typed))

  function toggle(id: string): void {
    setIds((current) => {
      const next = new Set(current)
      if (!next.delete(id)) next.add(id)
      return next
    })
  }

  return (
    <BottomSheet
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title={tag.sheetTitle}
      toolbar={
        <div className="px-5 pt-3 pb-2">
          <SearchPill
            label={tag.search}
            value={search}
            onChange={setSearch}
            clearLabel={strings.choice.clearSearch}
          />
        </div>
      }
      actions={
        <>
          <Button variant="secondary" fullWidth onClick={onClose}>
            {strings.choice.cancel}
          </Button>
          <Button
            fullWidth
            onClick={() => {
              onApply(applyChoice(chosen, tags, ids))
            }}
          >
            {tag.confirm(ids.size)}
          </Button>
        </>
      }
    >
      <fieldset className="pt-2">
        <legend className="sr-only">{tag.existing}</legend>
        {shown.length === 0 ? (
          <p role="status" className="py-2 text-body text-ink-800">
            {tag.noResult(typed)}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {shown.map(({ id, label }) => (
              <FilterChip
                key={id}
                selected={ids.has(id)}
                onClick={() => {
                  toggle(id)
                }}
              >
                {label}
              </FilterChip>
            ))}
          </div>
        )}
      </fieldset>
    </BottomSheet>
  )
}
