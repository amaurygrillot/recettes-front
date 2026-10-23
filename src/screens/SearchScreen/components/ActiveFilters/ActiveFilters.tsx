import { Button } from '../../../../components/Button/Button'
import { LockedChip } from '../../../../components/LockedChip/LockedChip'
import { RemovableChip } from '../../../../components/RemovableChip/RemovableChip'
import { strings } from '../../strings'

export interface ActiveFilter {
  key: string
  /** As shown: « Desserts ». */
  label: string
  /** As named: « Retirer le filtre Desserts ». */
  removeLabel: string
  onRemove: () => void
}

export interface ActiveFiltersProps {
  filters: readonly ActiveFilter[]
  /** A filter that cannot be removed (« Mes recettes »): kept first. */
  lockedLabel?: string | undefined
  onClearAll: () => void
}

/** The filters in force, one touch each to drop; « Tout effacer » once there are two. */
export function ActiveFilters({ filters, lockedLabel, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0 && lockedLabel === undefined) return null

  return (
    <div className="-mx-4 -mt-1 scrollbar-hidden flex items-center gap-2.5 overflow-x-auto px-4 pt-1.5 pb-2 tablet:-mx-8 tablet:px-8 desktop:mx-0 desktop:px-0.5">
      {lockedLabel !== undefined && (
        <LockedChip label={lockedLabel} lockedLabel={strings.active.locked} />
      )}
      {filters.map((filter) => (
        <RemovableChip
          key={filter.key}
          label={filter.label}
          removeLabel={filter.removeLabel}
          onRemove={filter.onRemove}
        />
      ))}
      {filters.length >= 2 && (
        <Button variant="quiet" size="medium" onClick={onClearAll}>
          {strings.active.clearAll}
        </Button>
      )}
    </div>
  )
}
