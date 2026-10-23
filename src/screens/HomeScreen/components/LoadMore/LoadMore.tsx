import { useEffect, useRef } from 'react'
import type { ApiFailure } from '../../../../api/failure'
import { failureMessage } from '../../../../app/failureMessage'
import { Button } from '../../../../components/Button/Button'
import { ErrorBanner } from '../../../../components/ErrorBanner/ErrorBanner'
import { Icon } from '../../../../components/Icon/Icon'
import { strings } from '../../strings'
import type { MoreRecipes } from '../../useRecipeFeed'

const { loadMore } = strings

type PendingMore = Exclude<MoreRecipes, { status: 'exhausted' }>

export interface LoadMoreProps {
  /** How many recipes are on the page. */
  shown: number
  /** How many recipes exist. */
  total: number
  more: MoreRecipes
  /** How many recipes the last request added: announced once they are there. */
  lastBatch: number | undefined
}

/** A failed next page is « Impossible de charger la suite. » when the network is the cause, else the cause itself. */
function failedText(failure: ApiFailure): string {
  return failure.kind === 'network' ? loadMore.failed : failureMessage(failure)
}

function announcementFor(more: MoreRecipes, lastBatch: number | undefined): string {
  if (more.status === 'loading') return loadMore.incoming(more.incoming)
  return lastBatch === undefined ? '' : loadMore.loaded(lastBatch)
}

function counterFor(more: PendingMore, shown: number, total: number): string {
  return more.status === 'loading' ? loadMore.incoming(more.incoming) : loadMore.count(shown, total)
}

/**
 * One button for the three moments, so that it stays the same element: it keeps its place and the
 * keyboard's focus while loading and when asking again.
 */
function MoreButton({ more }: { more: PendingMore }) {
  switch (more.status) {
    case 'loading':
      return (
        <Button variant="secondary" fullWidth busy>
          {loadMore.waiting}
        </Button>
      )
    case 'failed':
      return (
        <Button variant="secondary" fullWidth icon="refresh" onClick={more.retry}>
          {loadMore.retry}
        </Button>
      )
    case 'available':
      return (
        <Button variant="secondary" fullWidth onClick={more.load}>
          {loadMore.action}
          <Icon name="chevron-down" strokeWidth={2.6} />
        </Button>
      )
  }
}

/**
 * What follows the cards: how many are shown, and « Voir plus de recettes » to get the next ones.
 * No endless scrolling, so the page never moves on its own while someone cooks. The button gives
 * way to a sentence once everything is shown.
 */
export function LoadMore({ shown, total, more, lastBatch }: LoadMoreProps) {
  const endRef = useRef<HTMLParagraphElement>(null)
  const wasLoading = useRef(false)

  // The button the reader just pressed disappears with the last page: the focus goes to what
  // replaces it, otherwise the keyboard would start again from the top of the document.
  useEffect(() => {
    if (wasLoading.current && more.status === 'exhausted') endRef.current?.focus()
    wasLoading.current = more.status === 'loading'
  }, [more.status])

  return (
    <div className="mx-auto flex w-full flex-col gap-2.5 tablet:max-w-96">
      <p role="status" className="sr-only">
        {announcementFor(more, lastBatch)}
      </p>
      {more.status === 'exhausted' ? (
        <p ref={endRef} tabIndex={-1} className="text-center text-body text-ink-800">
          {loadMore.end(total)}
        </p>
      ) : (
        <>
          <p className="text-center text-detail text-ink-700">{counterFor(more, shown, total)}</p>
          {more.status === 'failed' && <ErrorBanner message={failedText(more.failure)} />}
          <MoreButton more={more} />
        </>
      )}
    </div>
  )
}
