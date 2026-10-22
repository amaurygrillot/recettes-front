import type { ReactNode } from 'react'
import { useHasElapsed } from '../../lib/useHasElapsed'

export interface LoadingRegionProps {
  /** Announced to screen readers instead of the skeletons: « Chargement des recettes… ». */
  label: string
  /** Nothing is shown under this delay, so a fast response never flashes a skeleton. */
  delayMs?: number
  children: ReactNode
}

/**
 * Announces a wait and shows its skeletons after a short delay (300 ms in the design). The status
 * region is always mounted: screen readers only announce text added to a region that already exists.
 */
export function LoadingRegion({ label, delayMs = 300, children }: LoadingRegionProps) {
  const visible = useHasElapsed(delayMs)

  return (
    <div role="status">
      {visible && (
        <>
          <span className="sr-only">{label}</span>
          <div aria-hidden="true">{children}</div>
        </>
      )}
    </div>
  )
}
