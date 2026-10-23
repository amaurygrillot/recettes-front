import { useId, useState, type SubmitEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Icon } from '../components/Icon/Icon'
import { logger } from '../lib/logger'
import { isSearchPage, searchPath } from './paths'
import { MAX_QUERY_LENGTH } from './searchCriteria'
import { strings } from './strings'
import { useSearchText } from './useSearchText'

/**
 * The search field of the desktop bar. On the search pages it is their field: what is typed
 * searches as the reader types. Elsewhere, Enter opens the search page on that text.
 */
export function HeaderSearch() {
  const navigate = useNavigate()
  const onSearchPage = isSearchPage(useLocation().pathname)
  const inputId = useId()
  const pageText = useSearchText()
  const [draft, setDraft] = useState('')

  const text = onSearchPage ? pageText.text : draft

  function search(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (onSearchPage) {
      pageText.submit()
      return
    }
    const query = draft.trim()
    logger.info('Searching from the top bar', { hasText: query !== '' })
    void navigate(searchPath({ query }))
  }

  return (
    <form
      role="search"
      aria-label={strings.navigation.searchLandmark}
      onSubmit={search}
      className="relative w-72.5 flex-none"
    >
      <label htmlFor={inputId} className="sr-only">
        {strings.navigation.searchField}
      </label>
      <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-900">
        <Icon name="search" size={26} strokeWidth={2.4} />
      </span>
      <input
        id={inputId}
        type="search"
        value={text}
        maxLength={MAX_QUERY_LENGTH}
        onChange={(event) => {
          if (onSearchPage) pageText.change(event.target.value)
          else setDraft(event.target.value)
        }}
        placeholder={strings.navigation.searchField}
        className="h-13 w-full rounded-pill border-2 border-ink-500 bg-paper-50 pr-4 pl-13 text-label text-ink-900 placeholder:text-ink-700"
      />
    </form>
  )
}
