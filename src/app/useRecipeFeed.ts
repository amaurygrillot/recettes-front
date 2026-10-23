import { useState } from 'react'
import type { ApiFailure } from '../api/failure'
import { useRecipeSearch, type RecipeSearchFilters } from '../api/recipes'
import type { LoadMoreState } from '../components/LoadMore/LoadMore'
import type { RecipeCardModel } from '../components/RecipeCard/RecipeCard'
import { logger } from '../lib/logger'
import { nextPageFailureText } from './failureMessage'
import { recipeCardsOf } from './recipeCards'

export const FEED_PAGE_SIZE = 20

/** What a list of recipes shows, as one state: the component switches on `status` and nothing else. */
export type RecipeFeed =
  | { status: 'loading' }
  | { status: 'failed'; failure: ApiFailure; retry: () => void }
  | { status: 'empty'; refresh: () => void; refreshing: boolean; updating: boolean }
  | {
      status: 'ready'
      recipes: readonly RecipeCardModel[]
      total: number
      more: LoadMoreState
      /** How many recipes the last « Voir plus » added, to announce them. */
      lastBatch: number | undefined
      /** The criteria changed and the list shown is still the previous answer. */
      updating: boolean
    }

/**
 * A list of recipes, a page of 20 at a time, newest first unless the filters say otherwise (home,
 * search, « Mes recettes »). When the filters change the previous answer stays on screen,
 * flagged `updating`, until the new one arrives: typing never blanks the page.
 */
export function useRecipeFeed(filters: RecipeSearchFilters): RecipeFeed {
  const query = useRecipeSearch({
    sortBy: 'CREATED_AT',
    direction: 'DESC',
    ...filters,
    size: FEED_PAGE_SIZE,
  })
  const [lastBatch, setLastBatch] = useState<number | undefined>()
  const { data } = query
  const updating = query.isPlaceholderData

  if (data === undefined) {
    if (!query.isError) return { status: 'loading' }
    const retry = () => {
      logger.info('Trying the recipe list again')
      void query.refetch()
    }
    return { status: 'failed', failure: query.error.failure, retry }
  }

  const recipes = recipeCardsOf(data.pages)
  // Nothing to show is only « empty » when the API has nothing more to give either.
  if (recipes.length === 0 && !query.hasNextPage) {
    const refresh = () => {
      logger.info('Refreshing the empty recipe list')
      void query.refetch()
    }
    return { status: 'empty', refresh, refreshing: query.isFetching && !updating, updating }
  }

  const total = Math.max(recipes.length, data.pages.at(-1)?.totalElements ?? 0)

  async function loadMore() {
    logger.debug('Loading more recipes', { loaded: recipes.length })
    setLastBatch(undefined)
    const result = await query.fetchNextPage()
    if (result.isSuccess) setLastBatch(result.data.pages.at(-1)?.content?.length)
  }

  const loadMoreFailure = query.isFetchNextPageError ? query.error.failure : undefined
  let more: LoadMoreState = { status: 'exhausted' }
  if (loadMoreFailure !== undefined) {
    more = {
      status: 'failed',
      message: nextPageFailureText(loadMoreFailure),
      retry: () => void loadMore(),
    }
  } else if (query.isFetchingNextPage) {
    const remaining = total - recipes.length
    more = {
      status: 'loading',
      incoming: remaining > 0 ? Math.min(FEED_PAGE_SIZE, remaining) : FEED_PAGE_SIZE,
    }
  } else if (query.hasNextPage) {
    more = { status: 'available', load: () => void loadMore() }
  }

  return { status: 'ready', recipes, total, more, lastBatch, updating }
}
