import { useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { SearchOverlay } from '../screens/SearchScreen/components/SearchOverlay/SearchOverlay'
import { logger } from '../lib/logger'
import { isSearchPage, paths, resultsPath } from './paths'
import { EMPTY_CRITERIA, type SearchCriteria } from './searchCriteria'
import {
  SearchOverlayContext,
  type OpenSearch,
  type SearchOverlayRequest,
} from './useSearchOverlay'
import { useSearchCriteria } from './useSearchCriteria'

interface AskedSearch extends SearchOverlayRequest {
  locationKey: string
  opener: HTMLElement | null
}

/**
 * Owns the search overlay and opens it on request. It is opened from « Mes recettes » for the member's own
 * recipes, from a results page on that page's search, and from anywhere else on an empty one. Validating leads to
 * the results: a new history entry from another page, a replacement of the entry of a results page (so « back » goes
 * to the page the search was opened from, not through every search).
 */
export function SearchOverlayProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { pathname, key: locationKey } = useLocation()
  const { criteria: addressed } = useSearchCriteria()
  // The page it was asked for on: the overlay belongs to it, and goes when the history moves to another.
  const [request, setRequest] = useState<AskedSearch | undefined>()

  // The history moved to another entry: the request is over for good (going forward again must not bring it back).
  if (request !== undefined && request.locationKey !== locationKey) setRequest(undefined)

  const onSearchPage = isSearchPage(pathname)
  const mine = pathname === paths.myRecipes
  // In « Mes recettes » a name in the address is ignored, as it is for the API.
  const initial: SearchCriteria = onSearchPage
    ? { ...addressed, author: mine ? '' : addressed.author }
    : EMPTY_CRITERIA

  const open: OpenSearch = (asked = {}) => {
    logger.debug('Opening the search', { focus: asked.focus ?? 'text' })
    const { activeElement } = document
    const opener =
      activeElement instanceof HTMLElement && activeElement !== document.body ? activeElement : null
    setRequest({ ...asked, locationKey, opener })
  }

  function search(criteria: SearchCriteria): void {
    void navigate(resultsPath(criteria, { mine }), { replace: onSearchPage })
    setRequest(undefined)
  }

  return (
    <SearchOverlayContext value={open}>
      {children}
      {request?.locationKey === locationKey && (
        <SearchOverlay
          initial={initial}
          typed={request.typed ?? ''}
          focus={request.focus ?? 'text'}
          mine={mine}
          opener={request.opener}
          onSearch={search}
          onClose={() => {
            setRequest(undefined)
          }}
        />
      )}
    </SearchOverlayContext>
  )
}
