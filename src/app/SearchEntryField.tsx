import { useLocation } from 'react-router'
import { SearchLauncher } from '../components/SearchLauncher/SearchLauncher'
import { isSearchPage } from './paths'
import { strings } from './strings'
import { useSearchCriteria } from './useSearchCriteria'
import { useSearchOverlay } from './useSearchOverlay'

/**
 * The field that opens the search, wherever the page has one (the home page, the top bar, the tablet's header, the
 * results page). On a results page it shows the word searched and a cross that clears it in place; elsewhere it is
 * empty.
 */
export function SearchEntryField() {
  const openSearch = useSearchOverlay()
  const onSearchPage = isSearchPage(useLocation().pathname)
  const { criteria, update } = useSearchCriteria()
  const word = onSearchPage ? criteria.query : ''

  return (
    <SearchLauncher
      label={strings.navigation.searchField}
      value={word}
      onOpen={(firstKey) => {
        openSearch(firstKey === undefined ? {} : { typed: firstKey })
      }}
      clear={{
        label: strings.navigation.clearSearch,
        onClear: () => {
          update({ query: '' })
        },
      }}
    />
  )
}
