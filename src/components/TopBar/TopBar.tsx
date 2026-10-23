import { Link, NavLink } from 'react-router'
import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import { Logo } from '../Logo/Logo'
import type { CreateAction, NavigationItem } from '../TabBar/TabBar'

export interface TopBarProps {
  /** The accessible name of the navigation landmark. */
  label: string
  /** The accessible name of the logo, which links to the home page. */
  homeLabel: string
  /** The same items as the phone's tab bar, in the same order: the last one sits at the far right. */
  items: readonly NavigationItem[]
  /** A button in the bar. Absent for a visitor. */
  createAction?: CreateAction | undefined
}

const TAB =
  'inline-flex h-13 items-center gap-2.5 rounded-pill border-2 pr-4 pl-3 text-body whitespace-nowrap'
const TAB_ACTIVE = 'border-ink-900 bg-butter-300 font-bold text-ink-900'
const TAB_IDLE =
  'border-transparent text-ink-700 hover:bg-butter-100 hover:text-ink-900 active:border-dashed active:border-ink-900 active:bg-butter-200 active:text-ink-900'

function BarLink({ item }: { item: NavigationItem }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) => classNames(TAB, isActive ? TAB_ACTIVE : TAB_IDLE)}
    >
      {({ isActive }) => (
        <>
          <Icon name={item.icon} strokeWidth={isActive ? 2.5 : 2.2} />
          {item.label}
        </>
      )}
    </NavLink>
  )
}

/**
 * The navigation from 1024 px: the same tabs as the phone, in a bar at the top of the page.
 * Below that width it is not displayed and the tab bar takes over.
 */
export function TopBar({ label, homeLabel, items, createAction }: TopBarProps) {
  const accountItem = items.at(-1)
  const pageItems = items.slice(0, -1)

  return (
    <nav
      aria-label={label}
      className="hidden h-21 border-b-2 border-ink-900 bg-paper-50 desktop:block"
    >
      <div className="page-margins flex h-full items-center gap-0.5">
        <Link to="/" aria-label={homeLabel} className="mr-2.5 flex items-center rounded-m">
          <Logo variant="lockup" size={32} decorative />
        </Link>
        {pageItems.map((item) => (
          <BarLink key={item.to} item={item} />
        ))}
        <div className="flex-1" />
        {createAction && (
          <Link
            to={createAction.to}
            className="mr-1 inline-flex h-13 items-center gap-2 rounded-l border-2 border-ink-900 bg-butter-300 pr-5 pl-3.5 text-body font-bold whitespace-nowrap text-ink-900 shadow-stamp-sm hover:bg-butter-400 focus-visible:outline-offset-4 active:translate-0.5 active:bg-mustard-500 active:shadow-none"
          >
            <Icon name="plus" strokeWidth={3} />
            {createAction.label}
          </Link>
        )}
        {accountItem && <BarLink item={accountItem} />}
      </div>
    </nav>
  )
}
