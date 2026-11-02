import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { useSession } from '../api/session'
import { TabBar } from '../components/TabBar/TabBar'
import { TopBar } from '../components/TopBar/TopBar'
import { classNames } from '../lib/classNames'
import { useLayoutKind } from '../lib/useLayoutKind'
import { useScrolledDown } from '../lib/useScrolledDown'
import { BottomSlotContext } from './bottomSlot'
import {
  CreateButtonModeContext,
  DEFAULT_CREATE_BUTTON_MODE,
  type CreateButtonMode,
} from './createButtonMode'
import { canCreateRecipes, navigationLinks, phoneNavigation } from './navigation'
import { isSearchPage, paths } from './paths'
import { SearchEntryField } from './SearchEntryField'
import { strings } from './strings'
import { TabletHeader } from './TabletHeader'
import { useSearchOverlay } from './useSearchOverlay'

const { navigation } = strings

/**
 * The frame of the pages that have navigation: the bar at the top from 1024 px, the tabs at the
 * bottom below it, and, on a tablet, a header with the search field on the pages that have none of
 * their own. The page itself brings its own `<main>`, and its own « Nouvelle recette » button on a
 * desktop (the bar has none).
 */
export function AppShell() {
  const session = useSession()
  const layout = useLayoutKind()
  const { pathname } = useLocation()
  const openSearch = useSearchOverlay()
  const links = navigationLinks(session)
  // « Rechercher » is a tab on a phone only: from a tablet the field is the way in, and it is on the page.
  const tabs =
    layout === 'phone'
      ? phoneNavigation(session, {
          label: navigation.search,
          icon: 'search',
          onSelect: () => {
            openSearch()
          },
          current: pathname === paths.search,
        })
      : links
  // The home page and the results have their own field.
  const showTabletHeader = layout === 'tablet' && pathname !== paths.home && !isSearchPage(pathname)
  const [createMode, setCreateMode] = useState<CreateButtonMode>(DEFAULT_CREATE_BUTTON_MODE)
  const createAction =
    canCreateRecipes(session) && createMode !== 'hidden'
      ? { to: paths.newRecipe, label: navigation.newRecipe }
      : undefined
  const scrolledDown = useScrolledDown()
  const [bottomSlot, setBottomSlot] = useState<HTMLElement | null>(null)

  return (
    <CreateButtonModeContext value={setCreateMode}>
      <BottomSlotContext value={bottomSlot}>
        <div className="flex min-h-dvh flex-col">
          <TopBar
            label={navigation.desktopLabel}
            homeLabel={navigation.homeLink}
            items={links}
            search={layout === 'desktop' ? <SearchEntryField /> : null}
          />
          <div className="flex-1">
            {showTabletHeader && <TabletHeader />}
            {/* The « + » floats over the last 104 px of a phone's page: they stay clear for it. */}
            <div
              className={classNames(
                'page-margins',
                createAction !== undefined && 'pb-26 desktop:pb-0',
              )}
            >
              <Outlet />
            </div>
          </div>
          <TabBar
            label={navigation.phoneLabel}
            items={tabs}
            createAction={createAction}
            createExpanded={createMode === 'extends-at-top' && !scrolledDown}
            slotRef={setBottomSlot}
          />
        </div>
      </BottomSlotContext>
    </CreateButtonModeContext>
  )
}
