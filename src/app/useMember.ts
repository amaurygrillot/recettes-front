import { useState } from 'react'
import { useSession } from '../api/session'
import type { Member } from '../api/sessionStore'

/**
 * The member whose page this is. When the back end refuses their token the session is `expired`,
 * but the page stays up behind the « Ta session a expiré. » dialog (nothing they were doing is
 * lost), so the last member seen is kept until the session becomes a visitor's (they signed out).
 */
export function useMember(): Member | undefined {
  const session = useSession()
  const [kept, setKept] = useState<Member | undefined>(
    session.status === 'member' ? session : undefined,
  )

  // Adjusting state while rendering, the way React documents it, so the page never shows a stale member.
  if (session.status === 'member' && kept !== session) setKept(session)
  if (session.status === 'visitor' && kept !== undefined) setKept(undefined)

  return session.status === 'member' ? session : kept
}
