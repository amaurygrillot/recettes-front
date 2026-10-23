import { useState } from 'react'
import { Outlet } from 'react-router'
import { useSession } from '../api/session'
import { TabBar } from '../components/TabBar/TabBar'
import { TopBar } from '../components/TopBar/TopBar'
import { classNames } from '../lib/classNames'
import { useScrolledDown } from '../lib/useScrolledDown'
import {
  CreateButtonModeContext,
  DEFAULT_CREATE_BUTTON_MODE,
  type CreateButtonMode,
} from './createButtonMode'
import { HeaderSearch } from './HeaderSearch'
import { canCreateRecipes, navigationItems } from './navigation'
import { paths } from './paths'
import { strings } from './strings'

const { navigation } = strings

/**
 * The frame of the pages that have navigation: the bar at the top from 1024 px, the tabs at the
 * bottom below it. The page itself brings its own `<main>`, and its own « Nouvelle recette » button
 * on a desktop (the bar has none).
 */
export function AppShell() {
  const session = useSession()
  const items = navigationItems(session)
  const mayCreate = canCreateRecipes(session)
  const [createMode, setCreateMode] = useState<CreateButtonMode>(DEFAULT_CREATE_BUTTON_MODE)
  const scrolledDown = useScrolledDown()

  return (
    <CreateButtonModeContext value={setCreateMode}>
      <div className="flex min-h-dvh flex-col">
        <TopBar
          label={navigation.desktopLabel}
          homeLabel={navigation.homeLink}
          items={items}
          search={<HeaderSearch />}
        />
        <div className="flex-1">
          {/* The « + » floats over the last 104 px of a phone's page: they stay clear for it. */}
          <div className={classNames('page-margins', mayCreate && 'pb-26 desktop:pb-0')}>
            <Outlet />
          </div>
        </div>
        <TabBar
          label={navigation.phoneLabel}
          items={items}
          createAction={
            mayCreate && createMode !== 'hidden'
              ? { to: paths.newRecipe, label: navigation.newRecipe }
              : undefined
          }
          createExpanded={createMode === 'extends-at-top' && !scrolledDown}
        />
      </div>
    </CreateButtonModeContext>
  )
}
