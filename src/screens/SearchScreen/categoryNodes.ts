import type { components } from '../../api/schema'
import type { ComboboxOption } from '../../components/Combobox/Combobox'

type CategoryTree = components['schemas']['CategoryTreeResponse']

/** A category with what is filed beneath it, every field present: the API's tree, made certain. */
export interface CategoryNode {
  id: string
  name: string
  children: readonly CategoryNode[]
}

/** The tree the API sends, without the entries that have no id or no name (they could not be chosen). */
export function categoryNodesOf(tree: readonly CategoryTree[]): CategoryNode[] {
  return tree.flatMap(({ id, name, subcategories }) =>
    id && name ? [{ id, name, children: categoryNodesOf(subcategories ?? []) }] : [],
  )
}

/** Every category at every depth, for the search field; a subcategory says where it sits (« Tartes · Desserts »). */
export function categoryOptionsOf(
  nodes: readonly CategoryNode[],
  parent?: string,
): ComboboxOption[] {
  return nodes.flatMap((node) => [
    { id: node.id, label: node.name, hint: parent },
    ...categoryOptionsOf(node.children, node.name),
  ])
}

export interface FoundCategory {
  node: CategoryNode
  /** The categories above it, outermost first. */
  ancestors: readonly CategoryNode[]
}

export function findCategory(
  nodes: readonly CategoryNode[],
  id: string,
  ancestors: readonly CategoryNode[] = [],
): FoundCategory | undefined {
  for (const node of nodes) {
    if (node.id === id) return { node, ancestors }
    const inside = findCategory(node.children, id, [...ancestors, node])
    if (inside !== undefined) return inside
  }
  return undefined
}
