import { Link } from 'react-router'
import { paths, searchPath } from '../../../../app/paths'
import { strings as appStrings } from '../../../../app/strings'
import { Icon } from '../../../../components/Icon/Icon'
import { Logo } from '../../../../components/Logo/Logo'
import { strings } from '../../strings'

/**
 * The top of the home page on a phone and a tablet: the logo, then a field that is not one. Touching
 * it opens the search page, where the keyboard is ready; the real field only exists there (and, on a
 * desktop, in the bar).
 */
export function HomeHeader() {
  return (
    <div className="flex flex-col gap-3 tablet:gap-3.5">
      <Link
        to={paths.home}
        aria-label={appStrings.navigation.homeLink}
        className="inline-flex self-start rounded-m"
      >
        <Logo variant="lockup" size={44} decorative />
      </Link>
      <Link
        to={searchPath()}
        aria-label={strings.searchPromptLabel}
        className="flex h-14 items-center gap-3 rounded-pill border-2 border-ink-500 bg-paper-50 px-5 text-label text-ink-700"
      >
        <Icon name="search" size={26} strokeWidth={2.4} />
        {strings.searchPrompt}
      </Link>
    </div>
  )
}
