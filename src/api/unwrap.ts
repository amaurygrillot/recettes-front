import { ApiRequestError, failureFromResponse } from './failure'

/** What every openapi-fetch call settles to, whatever the operation. */
interface Settled<TData> {
  data?: TData | undefined
  error?: unknown
  response: Response
}

async function settle<TData>(call: Promise<Settled<TData>>): Promise<Settled<TData>> {
  let settled: Settled<TData>
  try {
    settled = await call
  } catch (error) {
    // A body that is not the JSON it claims to be is the back end answering badly, not silence.
    if (error instanceof SyntaxError) {
      throw new ApiRequestError({ kind: 'unexpected', status: undefined, detail: undefined })
    }
    throw new ApiRequestError({ kind: 'network' })
  }
  if (!settled.response.ok) {
    throw new ApiRequestError(failureFromResponse(settled.response, settled.error))
  }
  return settled
}

/**
 * The body of a successful call; any other outcome is thrown as an `ApiRequestError` carrying the
 * failure (see `failure.ts`). This is the only place that reads `error` from openapi-fetch.
 */
export async function unwrap<TData>(call: Promise<Settled<TData>>): Promise<TData> {
  const { data, response } = await settle(call)
  if (data === undefined) {
    throw new ApiRequestError({ kind: 'unexpected', status: response.status, detail: undefined })
  }
  return data
}

/** For the operations that answer with no body (`202`, `204`): only success or failure matters. */
export async function unwrapEmpty(call: Promise<Settled<unknown>>): Promise<void> {
  await settle(call)
}
