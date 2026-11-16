import type { EmojiData } from 'frimousse'
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { activeCategory, categoryPositions } from '../../lib/emoji/categoryPositions'
import { useMediaQuery } from '../../lib/useMediaQuery'

/** The height of a row of emojis (the 56 px cell) and of a category's title (`h-10`): fixed, so a category's place is arithmetic. */
export const ROW_PX = 56
export const TITLE_PX = 40

/**
 * What the pills of the categories need: which category is being read as the list scrolls, and how
 * to scroll it to another. The list opens on the category of the emoji already chosen.
 */
export function useCategoryNavigation(
  data: EmojiData,
  columns: number,
  viewportRef: RefObject<HTMLDivElement | null>,
  chosen: string | undefined,
) {
  const positions = useMemo(
    () => categoryPositions(data, columns, ROW_PX, TITLE_PX),
    [data, columns],
  )
  const chosenCategory = data.emojis.find((emoji) => emoji.emoji === chosen)?.category
  const [active, setActive] = useState<number | undefined>(chosenCategory ?? positions[0]?.index)
  const instant = useMediaQuery('(prefers-reduced-motion: reduce)')
  const placed = useRef(false)

  // On opening, the list is put on the category of the emoji in force, once (not when the columns change).
  useEffect(() => {
    if (placed.current) return
    placed.current = true
    const top = positions.find((position) => position.index === chosenCategory)?.top
    if (top !== undefined) viewportRef.current?.scrollTo({ top, behavior: 'instant' })
  }, [positions, chosenCategory, viewportRef])

  const onScroll = useCallback(
    (viewport: HTMLElement) => {
      const atEnd = viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 1
      setActive(activeCategory(positions, viewport.scrollTop, atEnd))
    },
    [positions],
  )

  const goTo = useCallback(
    (category: number) => {
      const top = positions.find((position) => position.index === category)?.top
      if (top === undefined) return
      setActive(category)
      viewportRef.current?.scrollTo({ top, behavior: instant ? 'instant' : 'smooth' })
    },
    [positions, viewportRef, instant],
  )

  return { active, onScroll, goTo }
}
