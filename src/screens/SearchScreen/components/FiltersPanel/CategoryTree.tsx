import { CheckboxRow } from '../../../../components/CheckboxRow/CheckboxRow'
import { IconButton } from '../../../../components/IconButton/IconButton'
import { RadioRow } from '../../../../components/RadioRow/RadioRow'
import type { CategoryNode } from '../../categoryNodes'
import { strings } from '../../strings'

const { category } = strings.filters

export interface CategoryTreeProps {
  categories: readonly CategoryNode[]
  categoryId: string | undefined
  exactCategory: boolean
  expandedIds: ReadonlySet<string>
  onChoose: (categoryId: string | undefined) => void
  onToggleExact: (exact: boolean) => void
  onToggleExpanded: (categoryId: string) => void
}

/**
 * The categories as a two-level tree with one choice: touching a category chooses it, with
 * everything filed beneath it unless « Uniquement cette catégorie » is ticked. The chevron opens a
 * category without choosing it; the radio and its label choose without opening. The API takes one
 * category, so these are radio buttons, with « Toutes » to choose none.
 */
export function CategoryTree({
  categories,
  categoryId,
  exactCategory,
  expandedIds,
  onChoose,
  onToggleExact,
  onToggleExpanded,
}: CategoryTreeProps) {
  return (
    <div>
      <RadioRow
        name="category"
        value=""
        label={category.all}
        checked={categoryId === undefined}
        onChange={() => {
          onChoose(undefined)
        }}
      />
      {categories.map((node) => (
        <CategoryBranch
          key={node.id}
          node={node}
          categoryId={categoryId}
          exactCategory={exactCategory}
          expandedIds={expandedIds}
          onChoose={onChoose}
          onToggleExact={onToggleExact}
          onToggleExpanded={onToggleExpanded}
        />
      ))}
    </div>
  )
}

interface CategoryBranchProps extends Omit<CategoryTreeProps, 'categories'> {
  node: CategoryNode
}

function CategoryBranch({
  node,
  categoryId,
  exactCategory,
  expandedIds,
  onChoose,
  onToggleExact,
  onToggleExpanded,
}: CategoryBranchProps) {
  const hasChildren = node.children.length > 0
  const expanded = expandedIds.has(node.id)
  return (
    <div>
      <div className="flex items-center">
        <div className="min-w-0 flex-1">
          <RadioRow
            name="category"
            value={node.id}
            label={node.name}
            checked={categoryId === node.id}
            onChange={() => {
              onChoose(node.id)
            }}
          />
        </div>
        {hasChildren && (
          <IconButton
            label={expanded ? category.collapse(node.name) : category.expand(node.name)}
            icon={expanded ? 'chevron-up' : 'chevron-down'}
            variant="bare"
            size="medium"
            aria-expanded={expanded}
            onClick={() => {
              onToggleExpanded(node.id)
            }}
          />
        )}
      </div>
      {hasChildren && expanded && (
        <div className="ml-6 border-l-2 border-dotted border-ink-500 pl-3">
          <CheckboxRow
            label={category.onlyThisOne}
            checked={exactCategory && categoryId === node.id}
            disabled={categoryId !== node.id}
            onChange={(event) => {
              onToggleExact(event.target.checked)
            }}
          />
          {node.children.map((child) => (
            <CategoryBranch
              key={child.id}
              node={child}
              categoryId={categoryId}
              exactCategory={exactCategory}
              expandedIds={expandedIds}
              onChoose={onChoose}
              onToggleExact={onToggleExact}
              onToggleExpanded={onToggleExpanded}
            />
          ))}
        </div>
      )}
    </div>
  )
}
