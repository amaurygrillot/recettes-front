import { HttpResponse } from 'msw'

/** An error as the back end sends it: RFC 9457 `application/problem+json`. */
export function problemResponse(
  status: number,
  detail = 'What the back end said',
  headers: Record<string, string> = {},
) {
  return HttpResponse.json(
    { status, title: 'Problem', detail },
    { status, headers: { 'Content-Type': 'application/problem+json', ...headers } },
  )
}

/** What a promise rejected with; fails the test if it resolved. */
export async function rejectionOf(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise
  } catch (error) {
    return error
  }
  throw new Error('The promise was expected to reject')
}
