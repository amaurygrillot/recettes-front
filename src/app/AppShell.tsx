import { Outlet } from 'react-router'
import { useSession } from '../api/session'
import { classNames } from '../lib/classNames'
import { TabBar } from '../components/TabBar/TabBar'
import { TopBar } from '../components/TopBar/TopBar'
import { canCreateRecipes, navigationItems } from './navigation'
import { paths } from './paths'
import { strings } from './strings'

const { navigation } = strings

/**
 * The frame of the pages that have navigation: the bar at the top from 1024 px, the tabs at the
 * bottom below it. The page itself brings its own `<main>`.
 */
export function AppShell() {
  const session = useSession()
  const items = navigationItems(session)
  const mayCreate = canCreateRecipes(session)

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar
        label={navigation.desktopLabel}
        homeLabel={navigation.homeLink}
        items={items}
        createAction={mayCreate ? { to: paths.newRecipe, label: navigation.newRecipe } : undefined}
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
          mayCreate ? { to: paths.newRecipe, label: navigation.createRecipeButton } : undefined
        }
      />
    </div>
  )
}
