import { Link } from 'react-router'
import { Logo } from '../components/Logo/Logo'
import { paths } from './paths'
import { SearchEntryField } from './SearchEntryField'
import { strings } from './strings'

/**
 * The top of a tablet's page that has no search field of its own: the logo, and the field that opens the search.
 * The phone has its tab, the desktop its bar.
 */
export function TabletHeader() {
  return (
    <header className="page-margins flex items-center gap-4 pt-4">
      <Link
        to={paths.home}
        aria-label={strings.navigation.homeLink}
        className="flex-none rounded-m"
      >
        <Logo variant="lockup" size={44} decorative />
      </Link>
      <div className="min-w-0 flex-1">
        <SearchEntryField />
      </div>
    </header>
  )
}
