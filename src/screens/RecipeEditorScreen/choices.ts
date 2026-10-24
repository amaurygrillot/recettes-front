import type { CategoryNode } from '../../app/categoryNodes'
import { findCategory } from '../../app/categoryNodes'
import type { Choice } from './editorModel'

/** Where a category sits, as it is written: « Desserts › Tartes ». A main category is just its name. */
export function categoryPath(nodes: readonly CategoryNode[], id: string): string | undefined {
  const found = findCategory(nodes, id)
  if (found === undefined) return undefined
  return [...found.ancestors, found.node].map(({ name }) => name).join(' › ')
}

export interface CategoryOption extends Choice {
  /** The category's own name. */
  name: string
  /** Where it sits when it is not a main category: the path above it. */
  parentPath: string | undefined
}

/** Every category at every depth, in the order of the tree, each with its path as its label. */
export function categoryOptions(
  nodes: readonly CategoryNode[],
  above: readonly string[] = [],
): CategoryOption[] {
  return nodes.flatMap((node) => [
    {
      id: node.id,
      label: [...above, node.name].join(' › '),
      name: node.name,
      parentPath: above.length === 0 ? undefined : above.join(' › '),
    },
    ...categoryOptions(node.children, [...above, node.name]),
  ])
}

/** How many of the categories beneath `node` (at any depth, not itself) are in `ids`. */
export function chosenBeneath(node: CategoryNode, ids: ReadonlySet<string>): number {
  return node.children.reduce(
    (count, child) => count + (ids.has(child.id) ? 1 : 0) + chosenBeneath(child, ids),
    0,
  )
}

/**
 * What the sheet's answer is: the ones that were already chosen and still are, in their order,
 * then the ones that were added, in the order the list shows them. Choosing again changes nothing
 * about what was there.
 */
export function applyChoice(
  current: readonly Choice[],
  options: readonly Choice[],
  chosen: ReadonlySet<string>,
): Choice[] {
  const kept = current.filter(({ id }) => chosen.has(id))
  const keptIds = new Set(kept.map(({ id }) => id))
  const added = options.filter(({ id }) => chosen.has(id) && !keptIds.has(id))
  return [...kept, ...added.map(({ id, label }) => ({ id, label }))]
}
