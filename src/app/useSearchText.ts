import { useState } from 'react'
import { useDebouncedCallback } from '../lib/useDebouncedCallback'
import { useSearchCriteria } from './useSearchCriteria'

/** A pause in the typing of this long is « I have finished »: the search follows, no button needed. */
export const TYPING_PAUSE_MS = 300

/**
 * The title text of the search, for a field that types into the address bar. What is typed shows
 * at once; the URL (and so the results) follows after a short pause or on Enter. Both fields of
 * the search page, the page's own and the desktop bar's, use it and stay in step through the URL.
 */
export function useSearchText() {
  const { criteria, update } = useSearchCriteria()
  // What has been typed and is not in the URL yet; none once it is, so « back » shows the URL's.
  const [typed, setTyped] = useState<string | undefined>()

  function commit(text: string): void {
    update({ query: text })
    setTyped(undefined)
  }
  const pause = useDebouncedCallback(commit, TYPING_PAUSE_MS)

  const text = typed ?? criteria.query

  return {
    text,
    change(next: string): void {
      setTyped(next)
      pause.schedule(next)
    },
    /** Search now, without waiting for the pause. */
    submit: () => {
      pause.cancel()
      commit(text)
    },
    clear: () => {
      pause.cancel()
      commit('')
    },
  }
}
