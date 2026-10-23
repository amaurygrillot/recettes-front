import { useId, useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router'
import { Icon } from '../components/Icon/Icon'
import { logger } from '../lib/logger'
import { searchPath } from './paths'
import { strings } from './strings'

/**
 * The search field of the desktop bar. Submitting it opens the search page on that text; the page
 * itself owns what happens next (results, filters).
 */
export function HeaderSearch() {
  const navigate = useNavigate()
  const inputId = useId()
  const [text, setText] = useState('')

  function search(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = text.trim()
    logger.info('Searching from the top bar', { hasText: query !== '' })
    void navigate(searchPath({ query }))
  }

  return (
    <form role="search" onSubmit={search} className="relative w-72.5 flex-none">
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
        onChange={(event) => {
          setText(event.target.value)
        }}
        placeholder={strings.navigation.searchField}
        className="h-13 w-full rounded-pill border-2 border-ink-500 bg-paper-50 pr-4 pl-13 text-label text-ink-900 placeholder:text-ink-700"
      />
    </form>
  )
}
