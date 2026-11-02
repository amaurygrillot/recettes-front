import type { Ref } from 'react'
import { NavLink } from 'react-router'
import { classNames } from '../../lib/classNames'
import { CreateLink } from '../CreateLink/CreateLink'
import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/iconShapes'

interface NavigationEntry {
  label: string
  icon: IconName
}

/** A tab that leads to a page. */
export interface NavigationLink extends NavigationEntry {
  to: string
  /** Active only on exactly this path (the home page), not on the pages beneath it. */
  end?: boolean | undefined
  /** The member's name: the top bar shows their avatar in place of the icon. The tab bar keeps the icon. */
  avatarName?: string | undefined
}

/** A tab that does something over the page instead of leading to another (« Rechercher » opens the search). */
export interface NavigationAction extends NavigationEntry {
  onSelect: () => void
  /** The page being shown is what the action leads to: the tab is the yellow one. */
  current: boolean
}

export type NavigationItem = NavigationLink | NavigationAction

/** The one action that creates something; it is never a tab. */
export interface CreateAction {
  to: string
  /** The accessible name of the round button. */
  label: string
}

export interface TabBarProps {
  /** The accessible name of the navigation landmark. */
  label: string
  /** Two to five tabs; the bar shares its width equally. */
  items: readonly NavigationItem[]
  /** Floats above the bar, at its right. Absent for a visitor. */
  createAction?: CreateAction | undefined
  /** Shows the action with its label (a page that has room for it) instead of the round « + ». */
  createExpanded?: boolean | undefined
  /** An empty place just above the tabs, for a page to put a bar into (a portal target). */
  slotRef?: Ref<HTMLDivElement> | undefined
}

const TAB =
  'group flex min-h-19 min-w-0 flex-1 flex-col items-center gap-1 rounded-l px-0.5 pt-0.5 text-center text-detail leading-4.5 focus-visible:outline-offset-1'
const TAB_ACTIVE = 'font-bold text-ink-900'
const TAB_IDLE = 'text-ink-700 active:text-ink-900'

// The yellow pill is what says « you are here »; pressed shows the dashed ink outline of the design.
const PILL = 'grid h-9 w-16 shrink-0 place-items-center rounded-pill border-2'
const PILL_ACTIVE = 'border-ink-900 bg-butter-300'
const PILL_IDLE =
  'border-transparent group-active:border-dashed group-active:border-ink-900 group-active:bg-butter-200'

function TabFace({ item, active }: { item: NavigationEntry; active: boolean }) {
  return (
    <>
      <span className={classNames(PILL, active ? PILL_ACTIVE : PILL_IDLE)}>
        <Icon name={item.icon} strokeWidth={active ? 2.5 : 2.2} />
      </span>
      {item.label}
    </>
  )
}

/**
 * The phone's navigation: tabs fixed at the bottom of the screen, up to 1023 px (the top bar takes
 * over from there). It sits at the end of the page and sticks to the bottom of the screen, so the
 * content never hides behind it.
 */
export function TabBar({
  label,
  items,
  createAction,
  createExpanded = false,
  slotRef,
}: TabBarProps) {
  return (
    <div className="sticky bottom-0 z-20 desktop:hidden">
      {createAction && (
        // 16 px above the bar and 16 px from the edge (24 px on a tablet, where the margins are wider).
        <div className="absolute right-4 bottom-full mb-4 tablet:right-6">
          <CreateLink to={createAction.to} label={createAction.label} expanded={createExpanded} />
        </div>
      )}
      <div ref={slotRef} />
      <nav
        aria-label={label}
        className="flex gap-0.5 border-t-2 border-ink-900 bg-paper-50 pt-2 pb-safe-bar"
      >
        {items.map((item) =>
          'to' in item ? (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end ?? false}
              className={({ isActive }) => classNames(TAB, isActive ? TAB_ACTIVE : TAB_IDLE)}
            >
              {({ isActive }) => <TabFace item={item} active={isActive} />}
            </NavLink>
          ) : (
            <button
              key={item.label}
              type="button"
              aria-haspopup="dialog"
              onClick={item.onSelect}
              className={classNames(TAB, 'cursor-pointer', item.current ? TAB_ACTIVE : TAB_IDLE)}
            >
              <TabFace item={item} active={item.current} />
            </button>
          ),
        )}
      </nav>
    </div>
  )
}
