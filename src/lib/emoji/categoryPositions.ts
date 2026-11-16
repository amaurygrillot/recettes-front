import type { EmojiData } from 'frimousse'

/** Where a category starts in the picker's one long list: the scroll position of its title. */
export interface CategoryPosition {
  /** The category, as the data numbers it. */
  index: number
  top: number
}

/**
 * The picker draws one list of rows, a title above each category's emojis; each title and each row
 * has one fixed height. So where a category starts is arithmetic: a title for each category before it
 * and a row for each `columns` emojis of those. A category with no emoji has no title.
 */
export function categoryPositions(
  { emojis, categories }: Pick<EmojiData, 'emojis' | 'categories'>,
  columns: number,
  rowHeight: number,
  titleHeight: number,
): CategoryPosition[] {
  const positions: CategoryPosition[] = []
  let rows = 0
  for (const category of categories) {
    const count = emojis.filter((emoji) => emoji.category === category.index).length
    if (count === 0) continue
    positions.push({
      index: category.index,
      top: positions.length * titleHeight + rows * rowHeight,
    })
    rows += Math.ceil(count / columns)
  }
  return positions
}

/**
 * The category being read: the last whose title has reached the top, and the last of all once the
 * list cannot scroll further (its title never gets to the top, but it is the one being read).
 */
export function activeCategory(
  positions: readonly CategoryPosition[],
  scrollTop: number,
  atEnd: boolean,
): number | undefined {
  if (atEnd) return positions.at(-1)?.index
  return (
    positions.findLast((position) => position.top <= scrollTop + 1)?.index ?? positions[0]?.index
  )
}
