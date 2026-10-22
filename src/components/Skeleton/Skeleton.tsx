import { classNames } from '../../lib/classNames'

export interface SkeletonProps {
  /** Size and corner radius, from the theme tokens (`h-6 w-3/4 rounded-s`): same footprint as the real content. */
  className: string
}

/** One placeholder block. Put a group of them in a LoadingRegion, which announces the wait and hides them. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={classNames('animate-skeleton bg-skeleton motion-reduce:animate-none', className)}
    />
  )
}
