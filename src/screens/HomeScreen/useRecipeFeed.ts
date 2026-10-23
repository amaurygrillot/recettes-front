import { useState } from 'react'
import type { ApiFailure } from '../../api/failure'
import { useRecipeSearch, type RecipeSearchFilters } from '../../api/recipes'
import { logger } from '../../lib/logger'
import { recipeCardsOf, type RecipeCardModel } from './recipeCards'

export const FEED_PAGE_SIZE = 20

// Newest first is the API's default; saying so keeps the feed from changing with the back end's.
const FEED_FILTERS: RecipeSearchFilters = {
  sortBy: 'CREATED_AT',
  direction: 'DESC',
  size: FEED_PAGE_SIZE,
}

/** What « Voir plus de recettes » is doing. */
export type MoreRecipes =
  | { status: 'available'; load: () => void }
  | { status: 'loading'; incoming: number }
  | { status: 'failed'; failure: ApiFailure; retry: () => void }
  | { status: 'exhausted' }

/** What the feed shows, as one state: the component switches on `status` and nothing else. */
export type RecipeFeed =
  | { status: 'loading' }
  | { status: 'failed'; failure: ApiFailure; retry: () => void }
  | { status: 'empty'; refresh: () => void; refreshing: boolean }
  | {
      status: 'ready'
      recipes: readonly RecipeCardModel[]
      total: number
      more: MoreRecipes
      /** How many recipes the last « Voir plus » added, to announce them. */
      lastBatch: number | undefined
    }

/** The home feed: the newest recipes first, a page at a time, as a single state to render. */
export function useRecipeFeed(): RecipeFeed {
  const query = useRecipeSearch(FEED_FILTERS)
  const [lastBatch, setLastBatch] = useState<number | undefined>()
  const { data } = query

  if (data === undefined) {
    if (!query.isError) return { status: 'loading' }
    const retry = () => {
      logger.info('Trying the home feed again')
      void query.refetch()
    }
    return { status: 'failed', failure: query.error.failure, retry }
  }

  const recipes = recipeCardsOf(data.pages)
  // Nothing to show is only « empty » when the API has nothing more to give either.
  if (recipes.length === 0 && !query.hasNextPage) {
    const refresh = () => {
      logger.info('Refreshing the empty home feed')
      void query.refetch()
    }
    return { status: 'empty', refresh, refreshing: query.isFetching }
  }

  const total = Math.max(recipes.length, data.pages.at(-1)?.totalElements ?? 0)

  async function loadMore() {
    logger.debug('Loading more recipes into the home feed', { loaded: recipes.length })
    setLastBatch(undefined)
    const result = await query.fetchNextPage()
    if (result.isSuccess) setLastBatch(result.data.pages.at(-1)?.content?.length)
  }

  const loadMoreFailure = query.isFetchNextPageError ? query.error.failure : undefined
  let more: MoreRecipes = { status: 'exhausted' }
  if (loadMoreFailure !== undefined) {
    more = { status: 'failed', failure: loadMoreFailure, retry: () => void loadMore() }
  } else if (query.isFetchingNextPage) {
    const remaining = total - recipes.length
    more = {
      status: 'loading',
      incoming: remaining > 0 ? Math.min(FEED_PAGE_SIZE, remaining) : FEED_PAGE_SIZE,
    }
  } else if (query.hasNextPage) {
    more = { status: 'available', load: () => void loadMore() }
  }

  return { status: 'ready', recipes, total, more, lastBatch }
}
