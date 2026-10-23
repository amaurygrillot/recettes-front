import { LoadingRegion } from '../../../../components/LoadingRegion/LoadingRegion'
import { Skeleton } from '../../../../components/Skeleton/Skeleton'
import { strings } from '../../strings'

/** The page of a recipe before it has arrived: the same blocks, in the same order, and no wheel. */
export function RecipeSkeleton() {
  return (
    <LoadingRegion label={strings.loading}>
      <div className="flex flex-col gap-5.5">
        <Skeleton className="aspect-4/3 rounded-xl" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-4/5 rounded-s" />
          <Skeleton className="h-8 w-24 rounded-pill" />
          <div className="flex gap-2">
            <Skeleton className="h-7.5 w-16 rounded-pill" />
            <Skeleton className="h-7.5 w-20 rounded-pill" />
          </div>
          <Skeleton className="h-4 w-1/2 rounded-s" />
          <Skeleton className="h-5 w-full rounded-s" />
          <Skeleton className="h-5 w-11/12 rounded-s" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-2/3 rounded-s" />
          <Skeleton className="h-8 w-full rounded-s" />
          <Skeleton className="h-8 w-5/6 rounded-s" />
          <Skeleton className="h-8 w-full rounded-s" />
        </div>
      </div>
    </LoadingRegion>
  )
}
