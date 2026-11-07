import { classNames } from '../../lib/classNames'
import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/iconShapes'

export interface RemovableChipProps {
  /** The chosen option, as shown: « Desserts ». */
  label: string
  /** The accessible name of the button, which has to contain `label`: « Retirer le filtre Desserts ». */
  removeLabel: string
  onRemove: () => void
  /** A picture before the label, for what the chip is (a cutlery for an ingredient). */
  icon?: IconName
}

/** A chosen filter that goes away with one touch: yellow, outlined, with a cross. */
export function RemovableChip({ label, removeLabel, onRemove, icon }: RemovableChipProps) {
  return (
    <button
      type="button"
      aria-label={removeLabel}
      onClick={onRemove}
      className={classNames(
        'inline-flex h-13 shrink-0 cursor-pointer items-center gap-2 rounded-pill border-2 border-ink-900 bg-butter-300 pr-3 text-body font-bold whitespace-nowrap text-ink-900 shadow-stamp-sm focus-visible:outline-offset-3 active:bg-mustard-500',
        icon === undefined ? 'pl-4.5' : 'pl-3.5',
      )}
    >
      {icon !== undefined && <Icon name={icon} size={22} />}
      {label}
      <Icon name="close" size={22} strokeWidth={2.8} />
    </button>
  )
}
