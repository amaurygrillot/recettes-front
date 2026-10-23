import { LoadingRegion } from '../../../../components/LoadingRegion/LoadingRegion'
import { Skeleton } from '../../../../components/Skeleton/Skeleton'
import { strings } from '../../strings'
import { TILE_ROW } from './tileRow'

const PLACEHOLDER_COUNT = 6

/** Six empty tiles of the real tiles' size, announced once as « Chargement des catégories… ». */
export function CategoryTilesSkeleton() {
  return (
    <LoadingRegion label={strings.categories.loading}>
      <div className={TILE_ROW}>
        {Array.from({ length: PLACEHOLDER_COUNT }, (_, position) => (
          <Skeleton
            key={position}
            className="h-22 w-23 shrink-0 rounded-frame border-2 border-paper-300"
          />
        ))}
      </div>
    </LoadingRegion>
  )
}
