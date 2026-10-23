import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router'
import { classNames } from '../../lib/classNames'
import { Avatar } from '../Avatar/Avatar'
import { Icon } from '../Icon/Icon'
import { Logo } from '../Logo/Logo'
import type { NavigationItem } from '../TabBar/TabBar'

export interface TopBarProps {
  /** The accessible name of the navigation landmark. */
  label: string
  /** The accessible name of the logo, which links to the home page. */
  homeLabel: string
  /** The same items as the phone's tab bar, in the same order: the last one sits at the far right. */
  items: readonly NavigationItem[]
  /** The search field, between the tabs and the account. */
  search?: ReactNode
}

const TAB =
  'inline-flex h-13 items-center gap-2.5 rounded-pill border-2 pr-4 pl-3 text-body whitespace-nowrap'
const TAB_ACTIVE = 'border-ink-900 bg-butter-300 font-bold text-ink-900'
const TAB_IDLE =
  'border-transparent text-ink-700 hover:bg-butter-100 hover:text-ink-900 active:border-dashed active:border-ink-900 active:bg-butter-200 active:text-ink-900'

function BarLink({ item }: { item: NavigationItem }) {
  const { avatarName } = item
  return (
    <NavLink
      to={item.to}
      end={item.end ?? false}
      className={({ isActive }) =>
        classNames(TAB, isActive ? TAB_ACTIVE : TAB_IDLE, avatarName !== undefined && 'pl-2')
      }
    >
      {({ isActive }) => (
        <>
          {avatarName === undefined ? (
            <Icon name={item.icon} strokeWidth={isActive ? 2.5 : 2.2} />
          ) : (
            <Avatar name={avatarName} size={36} decorative />
          )}
          {item.label}
        </>
      )}
    </NavLink>
  )
}

/**
 * The navigation from 1024 px: the logo, the tabs centered, the search field and the account (with
 * the member's avatar) in a bar at the top of the page. Below that width it is not displayed and
 * the tab bar takes over.
 */
export function TopBar({ label, homeLabel, items, search }: TopBarProps) {
  const accountItem = items.at(-1)
  const pageItems = items.slice(0, -1)

  return (
    <nav
      aria-label={label}
      className="hidden h-22 border-b-2 border-ink-900 bg-paper-50 desktop:block"
    >
      <div className="page-margins flex h-full items-center gap-2">
        <Link to="/" aria-label={homeLabel} className="flex items-center rounded-m">
          <Logo variant="lockup" size={40} decorative />
        </Link>
        <div className="flex flex-1 justify-center gap-1">
          {pageItems.map((item) => (
            <BarLink key={item.to} item={item} />
          ))}
        </div>
        {search}
        {accountItem && <BarLink item={accountItem} />}
      </div>
    </nav>
  )
}
