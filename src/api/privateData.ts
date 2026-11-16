import type { QueryClient } from '@tanstack/react-query'
import { logger } from '../lib/logger'
import { forgetOtherMembers } from '../lib/memberStorage'
import { listCoverKeys, listKeys } from './listKeys'
import type { Session, SessionStore } from './sessionStore'

/**
 * Lists, what they hold and their photos are private to one member, and a device may be shared:
 * nothing of one member may be on screen for the next. The query cache is therefore emptied of
 * everything private whenever the person changes hands (see `bindPrivateData`).
 */
function isPrivateQuery(queryKey: readonly unknown[]): boolean {
  return queryKey[0] === listKeys.all[0] || queryKey[0] === listCoverKeys.all[0]
}

/**
 * Empties them and tells whoever is showing one (a page still mounted): a query that is merely
 * removed from the cache would stay on screen, with its data, until its component renders again.
 */
export function clearPrivateQueries(queryClient: QueryClient): void {
  void queryClient.resetQueries({ predicate: (query) => isPrivateQuery(query.queryKey) })
}

/** Only the photos: what the lists say can stay on screen under the session dialog, the photos cannot. */
export function clearListPhotos(queryClient: QueryClient): void {
  void queryClient.resetQueries({ queryKey: listCoverKeys.all })
}

/** A rename keeps the same member (and their private data); a sign-in after an expiry does not count as the same. */
function isSameMember(before: Session, next: Session): boolean {
  return before.status === 'member' && next.status === 'member' && before.userId === next.userId
}

type SessionSource = Pick<SessionStore, 'subscribe' | 'getSnapshot'>

/**
 * Keeps the private data in step with the session, **before** the screens render with the new one
 * (the store tells its listeners synchronously, and React renders afterwards):
 *
 * - the session ends (sign-out, or « Se reconnecter » of the session dialog): everything private goes;
 * - someone signs in: everything private goes too (the previous member's data is never the next one's),
 *   and what other members left on the device (drafts) is forgotten;
 * - the session expires: the page stays under its dialog with what it shows, **except the photos**,
 *   which are private and are not shown to anyone without a session.
 *
 * Answers the function that stops it.
 */
export function bindPrivateData(queryClient: QueryClient, session: SessionSource): () => void {
  let previous: Session = session.getSnapshot()
  return session.subscribe(() => {
    const next = session.getSnapshot()
    const before = previous
    previous = next
    if (next.status === 'expired') {
      clearListPhotos(queryClient)
      logger.info('The photos of the lists were dropped: the session is over')
    } else if (next.status === 'visitor' && before.status !== 'visitor') {
      clearPrivateQueries(queryClient)
      logger.info('The private data was dropped: the session ended')
    } else if (next.status === 'member' && !isSameMember(before, next)) {
      clearPrivateQueries(queryClient)
      const forgotten = forgetOtherMembers(next.userId)
      logger.info('The private data was dropped: someone signed in', { draftsForgotten: forgotten })
    }
  })
}
