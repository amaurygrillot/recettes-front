import { useSession } from '../../api/session'
import { useCreateButtonMode } from '../../app/createButtonMode'
import { canCreateRecipes } from '../../app/navigation'
import { CategoryTiles } from './components/CategoryTiles/CategoryTiles'
import { FeedHeading } from './components/FeedHeading/FeedHeading'
import { HomeHeader } from './components/HomeHeader/HomeHeader'
import { RecipeFeed } from './components/RecipeFeed/RecipeFeed'
import { strings } from './strings'
import { useMainCategories } from './useMainCategories'
import { useRecipeFeed } from './useRecipeFeed'

/**
 * The front door: the newest recipes of the family, for a visitor as for a member, with the main
 * categories as shortcuts to the search. Blocks are in the order of a desktop's reading; on a phone
 * the shortcuts come first, as designed.
 */
export function HomeScreen() {
  const mayCreate = canCreateRecipes(useSession())
  const categories = useMainCategories()
  const feed = useRecipeFeed()
  // An empty feed already holds the invitation to write a first recipe: the « + » would double it.
  useCreateButtonMode(feed.status === 'empty' ? 'hidden' : 'extends-at-top')

  return (
    <main className="flex flex-col gap-4.5 pt-5 pb-8 tablet:pt-7 desktop:gap-5.5 desktop:pt-8">
      <h1 className="sr-only">{strings.pageTitle}</h1>
      <div className="order-0 desktop:hidden">
        <HomeHeader />
      </div>
      <div className="order-2 desktop:order-1">
        <FeedHeading mayCreate={mayCreate} />
      </div>
      <div className="order-1 desktop:order-2">
        <CategoryTiles categories={categories} />
      </div>
      <div className="order-3">
        <RecipeFeed feed={feed} mayCreate={mayCreate} />
      </div>
    </main>
  )
}
