import type { ApiFailure } from '../../api/failure'
import { failureMessage } from '../../app/failureMessage'
import { strings } from './strings'

/** What the API takes: a JPEG or a PNG of 8 MB at most (`POST /media`). */
const ACCEPTED_TYPES: readonly string[] = ['image/jpeg', 'image/png']
const MAX_BYTES = 8 * 1024 * 1024

/** The `accept` of the file inputs: the phone's gallery shows nothing else. */
export const ACCEPT = ACCEPTED_TYPES.join(',')

/** Why a picture was not stored: what is said under its tile, and whether sending it again can help. */
export type UploadProblem =
  | { kind: 'format' }
  | { kind: 'size' }
  | { kind: 'rate-limited'; retryAfterSeconds: number | undefined }
  | { kind: 'busy' }
  | { kind: 'other'; message: string }

/** What is wrong with the file before any request: the wrong format, too heavy. */
export function problemWithFile(file: File): UploadProblem | undefined {
  if (!ACCEPTED_TYPES.includes(file.type)) return { kind: 'format' }
  if (file.size > MAX_BYTES) return { kind: 'size' }
  return undefined
}

/** What the back end's answer means for the picture: one message per cause, as the board says. */
export function problemFromFailure(failure: ApiFailure): UploadProblem {
  switch (failure.kind) {
    case 'payload-too-large':
      return { kind: 'size' }
    case 'rate-limited':
      return { kind: 'rate-limited', retryAfterSeconds: failure.retryAfterSeconds }
    case 'unavailable':
      return { kind: 'busy' }
    default:
      return { kind: 'other', message: failureMessage(failure) }
  }
}

/** Sending the same file again cannot work when the file itself is refused. */
export function canRetry(problem: UploadProblem): boolean {
  return problem.kind !== 'format' && problem.kind !== 'size'
}

const { problems } = strings.photos

export function problemText(problem: UploadProblem): string {
  switch (problem.kind) {
    case 'format':
      return problems.format
    case 'size':
      return problems.size
    case 'rate-limited':
      return problems.rateLimited(problem.retryAfterSeconds)
    case 'busy':
      return problems.busy
    case 'other':
      return problem.message
  }
}
