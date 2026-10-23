import { Skeleton } from '../Skeleton/Skeleton'

/** The shape of a card while its recipe is on the way: same frame, same rows, nothing to read. */
export function RecipeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-paper-300 bg-paper-50">
      <Skeleton className="aspect-4/3" />
      <div className="flex flex-col gap-3 px-4.5 pt-3.5 pb-4.5">
        <Skeleton className="h-8 w-16 rounded-pill" />
        <Skeleton className="h-6 w-11/12 rounded-s" />
        <Skeleton className="h-6 w-2/3 rounded-s" />
        <div className="flex gap-2">
          <Skeleton className="h-7.5 w-15 rounded-pill" />
          <Skeleton className="h-7.5 w-18 rounded-pill" />
        </div>
        <Skeleton className="h-4 w-1/2 rounded-s" />
      </div>
    </div>
  )
}
