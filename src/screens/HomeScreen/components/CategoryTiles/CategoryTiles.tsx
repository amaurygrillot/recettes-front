import { paths, searchPath } from '../../../../app/paths'
import { strings } from '../../strings'
import type { MainCategories } from '../../useMainCategories'
import { CategoryTile } from './CategoryTile'
import { CategoryTilesSkeleton } from './CategoryTilesSkeleton'
import { TILE_ROW } from './tileRow'

export interface CategoryTilesProps {
  categories: MainCategories
}

/**
 * « Toutes » (the feed below is every recipe) and the main categories, each opening the search page
 * on its recipes. While the categories load only the skeletons show; if they never do, « Toutes » alone.
 */
export function CategoryTiles({ categories }: CategoryTilesProps) {
  if (categories.status === 'loading') return <CategoryTilesSkeleton />

  return (
    <ul aria-label={strings.categories.label} className={TILE_ROW}>
      <li>
        <CategoryTile to={paths.home} label={strings.categories.all} icon="grid" current />
      </li>
      {categories.categories.map((category) => (
        <li key={category.id}>
          <CategoryTile
            to={searchPath({ categoryId: category.id })}
            label={category.name}
            icon={category.icon}
          />
        </li>
      ))}
    </ul>
  )
}
