import { Link } from 'react-router'
import { paths } from '../../../../app/paths'
import { SearchEntryField } from '../../../../app/SearchEntryField'
import { strings as appStrings } from '../../../../app/strings'
import { Logo } from '../../../../components/Logo/Logo'
import { NAMED_LOGO_QUERY } from '../../../../lib/breakpoints'
import { useMediaQuery } from '../../../../lib/useMediaQuery'

/**
 * The top of the home page on a phone and a tablet: the logo, then the field that opens the search over
 * the page (on a desktop it is in the bar).
 */
export function HomeHeader() {
  const named = useMediaQuery(NAMED_LOGO_QUERY)

  return (
    <div className="flex flex-col gap-3 tablet:gap-3.5">
      <Link
        to={paths.home}
        aria-label={appStrings.navigation.homeLink}
        className="inline-flex self-start rounded-m"
      >
        <Logo variant={named ? 'lockup' : 'mark'} size={44} decorative />
      </Link>
      <SearchEntryField />
    </div>
  )
}
