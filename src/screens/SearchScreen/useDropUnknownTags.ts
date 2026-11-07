import { useEffect } from 'react'
import { logger } from '../../lib/logger'
import type { FilterChoices } from './filterChoices'
import type { FilterOptions } from './useFilterOptions'

/**
 * Takes out of the address the tags that no longer exist (a link made before one was deleted): once the tags
 * are known, a chosen id that is not among them would count as a filter and narrow the list with no chip to
 * see it or drop it. Nothing is done while the tags load or if they failed to load, so a good link is never
 * emptied because of a network error.
 */
export function useDropUnknownTags(
  tagIds: readonly string[],
  options: FilterOptions,
  change: (changes: Partial<FilterChoices>) => void,
): void {
  useEffect(() => {
    if (options.status !== 'ready') return
    const known = new Set(options.tags.map((tag) => tag.id))
    const kept = tagIds.filter((id) => known.has(id))
    if (kept.length === tagIds.length) return
    logger.info('Tags that no longer exist were dropped from the search', {
      dropped: tagIds.length - kept.length,
    })
    change({ tagIds: kept })
  }, [tagIds, options, change])
}
