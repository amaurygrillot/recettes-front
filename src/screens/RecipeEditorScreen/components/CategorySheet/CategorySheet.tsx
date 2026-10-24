import { useMemo, useState } from 'react'
import type { CategoryNode } from '../../../../app/categoryNodes'
import { BottomSheet } from '../../../../components/BottomSheet/BottomSheet'
import { Button } from '../../../../components/Button/Button'
import { CheckboxRow } from '../../../../components/CheckboxRow/CheckboxRow'
import { IconButton } from '../../../../components/IconButton/IconButton'
import { SearchPill } from '../../../../components/SearchPill/SearchPill'
import { startsAWord } from '../../../../lib/normalizeText'
import { applyChoice, categoryOptions, chosenBeneath } from '../../choices'
import type { Choice } from '../../editorModel'
import { strings } from '../../strings'

const { category } = strings.choice

export interface CategorySheetProps {
  categories: readonly CategoryNode[]
  /** What is chosen now: the boxes start ticked for these. */
  chosen: readonly Choice[]
  /** « Valider »: the whole choice, to replace what was chosen. */
  onApply: (chosen: Choice[]) => void
  /** Closed without applying anything. */
  onClose: () => void
}

/**
 * The categories as a tree of two levels in a sheet, with a search that lists the matches flat, each
 * with its path. The boxes do not answer one another: a recipe can be filed in « Desserts », in
 * « Tartes », or in both. Nothing is created from here.
 */
export function CategorySheet({ categories, chosen, onApply, onClose }: CategorySheetProps) {
  const options = useMemo(() => categoryOptions(categories), [categories])
  const [ids, setIds] = useState<ReadonlySet<string>>(() => new Set(chosen.map(({ id }) => id)))
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(
    () => new Set(categories.filter((node) => chosenBeneath(node, ids) > 0).map(({ id }) => id)),
  )
  const [search, setSearch] = useState('')
  const typed = search.trim()
  const matches = options.filter(({ label }) => startsAWord(label, typed))

  function toggle(id: string): void {
    setIds((current) => {
      const next = new Set(current)
      if (!next.delete(id)) next.add(id)
      return next
    })
  }

  function toggleExpanded(id: string): void {
    setExpanded((current) => {
      const next = new Set(current)
      if (!next.delete(id)) next.add(id)
      return next
    })
  }

  function branch(node: CategoryNode) {
    const open = expanded.has(node.id)
    const hidden = open ? 0 : chosenBeneath(node, ids)
    return (
      <div key={node.id}>
        <div className="flex items-center">
          <div className="min-w-0 flex-1">
            <CheckboxRow
              label={node.name}
              checked={ids.has(node.id)}
              onChange={() => {
                toggle(node.id)
              }}
            />
          </div>
          {node.children.length > 0 && (
            <>
              {hidden > 0 && (
                <span className="text-detail text-ink-700">{category.chosenInside(hidden)}</span>
              )}
              <IconButton
                label={open ? category.collapse(node.name) : category.expand(node.name)}
                icon={open ? 'chevron-up' : 'chevron-down'}
                variant="bare"
                size="medium"
                aria-expanded={open}
                onClick={() => {
                  toggleExpanded(node.id)
                }}
              />
            </>
          )}
        </div>
        {open && node.children.length > 0 && (
          <div className="ml-6 border-l-2 border-dotted border-ink-500 pl-3">
            {node.children.map(branch)}
          </div>
        )}
      </div>
    )
  }

  /** What the search found: a flat list, each with its path, or the sentence that says there is nothing. */
  function found() {
    if (matches.length === 0) {
      return (
        <p role="status" className="py-4 text-body text-ink-800">
          {category.noResult(typed)}
        </p>
      )
    }
    return (
      <>
        <p role="status" className="pt-2 text-detail text-ink-700">
          {strings.choice.results(matches.length)}
        </p>
        {matches.map(({ id, name, parentPath }) => (
          <CheckboxRow
            key={id}
            label={name}
            hint={parentPath === undefined ? undefined : `${parentPath} › ${name}`}
            checked={ids.has(id)}
            onChange={() => {
              toggle(id)
            }}
          />
        ))}
      </>
    )
  }

  return (
    <BottomSheet
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title={category.sheetTitle}
      toolbar={
        <div className="px-5 pt-3 pb-2">
          <SearchPill
            label={category.search}
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
              onApply(applyChoice(chosen, options, ids))
            }}
          >
            {category.confirm(ids.size)}
          </Button>
        </>
      }
    >
      <fieldset>
        <legend className="sr-only">{category.existing}</legend>
        {typed === '' ? categories.map(branch) : found()}
      </fieldset>
    </BottomSheet>
  )
}
