import type { ReactNode } from 'react'
import type { ApiFailure } from '../api/failure'
import { Mascot } from '../components/Mascot/Mascot'

/** The sleeping mascot for a missing connection, which is nobody's fault; any other cause keeps the warning badge. */
export function failureIllustration(failure: ApiFailure): ReactNode {
  return failure.kind === 'network' ? <Mascot mood="asleep" size="large" /> : undefined
}
